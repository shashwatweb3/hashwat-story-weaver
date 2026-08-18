import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const encoder = new TextEncoder();

type Io = typeof import("./io");
const io = () => import("./io") as Promise<Io>;

async function sha256(input: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", encoder.encode(input));
}

async function hmacSign(secret: string, payload: string): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", key, encoder.encode(payload));
}

async function hmacVerify(
  secret: string,
  payload: string,
  signature: ArrayBuffer,
): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  return crypto.subtle.verify("HMAC", key, signature, encoder.encode(payload));
}

function base64url(bytes: ArrayBuffer): string {
  return Buffer.from(bytes).toString("base64url");
}

function fromBase64url(s: string): Buffer {
  return Buffer.from(s, "base64url");
}

/** Explicit ADMIN_SECRET, else a deterministic digest derived from the password. */
async function getAdminSecret(password: string): Promise<string> {
  const env = (await io()).getServerEnv();
  const secret = env.ADMIN_SECRET;
  if (secret && secret.length >= 16) return secret;
  return Buffer.from(await sha256(password)).toString("base64url");
}

export function parseCookies(request: Request): Record<string, string> {
  const header = request.headers.get("cookie") ?? "";
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx > 0) {
      out[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
    }
  }
  return out;
}

export async function verifySession(request: Request): Promise<boolean> {
  const env = (await io()).getServerEnv();
  if (!env.ADMIN_PASSWORD) return false;
  const token = parseCookies(request)[COOKIE_NAME];
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  try {
    const data = JSON.parse(fromBase64url(payload).toString("utf8")) as { iat?: number };
    if (typeof data.iat !== "number" || Date.now() - data.iat > SESSION_TTL_MS) return false;
    const ok = await hmacVerify(
      await getAdminSecret(env.ADMIN_PASSWORD),
      payload,
      fromBase64url(sig),
    );
    if (!ok) return false;
    return true;
  } catch {
    return false;
  }
}

/** Middleware that reads the session cookie and exposes `isAdmin` to server fns. */
export const authMiddleware = createMiddleware().server(async ({ next, context }) => {
  const isAdmin = await verifySession(context.request);
  return next({ context: { isAdmin } });
});

export const login = createServerFn({ method: "POST" }).handler(async ({ data, context }) => {
  const { password } = data as { password: string };
  const env = (await io()).getServerEnv();
  const expected = env.ADMIN_PASSWORD;
  if (!expected) {
    return { ok: false, error: "Admin auth is not configured on this server." };
  }
  const a = Buffer.from(await sha256(password));
  const b = Buffer.from(await sha256(expected));
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  if (diff !== 0) {
    return { ok: false, error: "Invalid password." };
  }
  const payload = Buffer.from(JSON.stringify({ iat: Date.now() })).toString("base64url");
  const sig = base64url(await hmacSign(await getAdminSecret(expected), payload));
  const token = `${payload}.${sig}`;
  const { setCookie } = await import("@tanstack/react-start/server");
  setCookie(COOKIE_NAME, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: context.request.url.startsWith("https://"),
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  throw redirect({ to: "/admin", statusCode: 302 });
});

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const { setCookie } = await import("@tanstack/react-start/server");
  setCookie(COOKIE_NAME, "", { path: "/", httpOnly: true, sameSite: "lax", maxAge: 0 });
  throw redirect({ to: "/admin/login", statusCode: 302 });
});

export const isAdmin = createServerFn({ method: "GET" }).handler(async (ctx) => {
  return { ok: await verifySession(ctx.context.request) };
});
