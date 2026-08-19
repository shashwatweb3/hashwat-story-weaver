import type { Article, ArticleInput, NewsletterStatus, StoredArticle } from "../article-types";
import { isValidSlug } from "../slug";
import { validateInput } from "./io";

const io = () => import("./io") as Promise<Io>;
type Io = typeof import("./io");

/**
 * Persistent article storage backed by Vercel KV (Upstash Redis REST API).
 * The same store is used locally and in production — one implementation.
 *
 * Layout: one JSON record per article under `{ns}:articles:{slug}` (ns = dev
 * locally, prod on Vercel); the list is derived by scanning the key prefix.
 */

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

const SEND_LOCK_TTL_SECONDS = 300;

/**
 * Namespace so local development and production never touch each other's
 * records in the shared store. Vercel sets VERCEL_ENV=production; local runs
 * default to "dev". Overridable via STORAGE_NAMESPACE.
 */
async function namespace(): Promise<string> {
  const env = (await io()).getServerEnv();
  return env.STORAGE_NAMESPACE ?? (env.VERCEL_ENV === "production" ? "prod" : "dev");
}

const KEY = async (slug: string): Promise<string> => `${await namespace()}:articles:${slug}`;
const SEND_LOCK_KEY = async (slug: string): Promise<string> =>
  `${await namespace()}:articles:sendlock:${slug}`;

/** Normalizes a raw record, defaulting any legacy/missing fields. */
function normalizeStored(raw: Partial<StoredArticle>): StoredArticle {
  return {
    id: raw.id ?? crypto.randomUUID(),
    slug: raw.slug ?? "",
    title: raw.title ?? "",
    excerpt: raw.excerpt ?? "",
    category: raw.category ?? "",
    tags: raw.tags ?? [],
    coverImage: raw.coverImage,
    publishedAt: raw.publishedAt ?? "",
    status: raw.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
    content: raw.content ?? "",
    createdAt: raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
    newsletterStatus: raw.newsletterStatus ?? "NOT_SENT",
    newsletterSentAt: raw.newsletterSentAt ?? null,
  };
}

function toArticle(stored: StoredArticle): Article {
  return {
    ...stored,
    published: stored.status === "PUBLISHED",
  };
}

function toStored(input: ArticleInput, existing?: StoredArticle): StoredArticle {
  const now = new Date().toISOString();
  return {
    id: existing?.id ?? crypto.randomUUID(),
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    category: input.category,
    tags: input.tags.filter(Boolean),
    coverImage: input.coverImage?.trim() ? input.coverImage.trim() : undefined,
    publishedAt: input.publishedAt,
    status: input.published ? "PUBLISHED" : "DRAFT",
    content: input.content,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    newsletterStatus: existing?.newsletterStatus ?? "NOT_SENT",
    newsletterSentAt: existing?.newsletterSentAt ?? null,
  };
}

async function kvEnv(): Promise<{ url: string; token: string }> {
  const env = (await io()).getServerEnv();
  const url = env.KV_REST_API_URL ?? env.UPSTASH_REDIS_REST_URL;
  const token = env.KV_REST_API_TOKEN ?? env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new StorageError("Article storage is not configured on this server.");
  }
  return { url, token };
}

async function redis(command: string, ...parts: string[]): Promise<{ result: unknown }> {
  const { url, token } = await kvEnv();
  const endpoint = `${url}/${command}/${parts.map((p) => encodeURIComponent(p)).join("/")}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new StorageError("Article storage is temporarily unavailable. Please try again later.");
  }
  return (await res.json()) as { result: unknown };
}

async function getStored(slug: string): Promise<StoredArticle | null> {
  const { result } = await redis("get", await KEY(slug));
  if (typeof result !== "string" || !result) return null;
  try {
    return normalizeStored(JSON.parse(result) as Partial<StoredArticle>);
  } catch {
    return null;
  }
}

export async function listStoredArticles(): Promise<Article[]> {
  const { result } = await redis("keys", `${await namespace()}:articles:*`);
  const keys = Array.isArray(result) ? (result as string[]) : [];
  const articles = await Promise.all(
    keys.map(async (key) => {
      const prefix = `${await namespace()}:articles:`;
      const slug = key.startsWith(prefix) ? key.slice(prefix.length) : "";
      if (!slug) return null;
      const stored = await getStored(slug);
      return stored ? toArticle(stored) : null;
    }),
  );
  return articles.filter((a): a is Article => a !== null);
}

export async function getStoredArticle(slug: string): Promise<Article | null> {
  const stored = await getStored(slug);
  return stored ? toArticle(stored) : null;
}

export async function saveStoredArticle(
  input: ArticleInput,
  originalSlug?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const error = validateInput(input);
  if (error) return { ok: false, error };
  if (!isValidSlug(input.slug))
    return { ok: false, error: "Slug must be lowercase letters, numbers and hyphens." };

  const current =
    originalSlug && originalSlug !== input.slug ? await getStored(originalSlug) : null;
  if (input.slug !== originalSlug) {
    const clash = await getStored(input.slug);
    if (clash) return { ok: false, error: "That slug is already in use." };
  }
  const record = toStored(input, current ?? undefined);
  await redis("set", await KEY(input.slug), JSON.stringify(record));
  if (current && current.slug !== input.slug) {
    await redis("del", await KEY(current.slug));
  }
  return { ok: true };
}

export async function deleteStoredArticle(slug: string): Promise<void> {
  await redis("del", await KEY(slug));
}

export async function getNewsletterState(
  slug: string,
): Promise<{ status: NewsletterStatus; sentAt: string | null } | null> {
  const stored = await getStored(slug);
  if (!stored) return null;
  return { status: stored.newsletterStatus, sentAt: stored.newsletterSentAt };
}

export async function setNewsletterState(
  slug: string,
  status: NewsletterStatus,
  sentAt: string | null = null,
): Promise<void> {
  const stored = await getStored(slug);
  if (!stored) return;
  stored.newsletterStatus = status;
  stored.newsletterSentAt = sentAt;
  stored.updatedAt = new Date().toISOString();
  await redis("set", await KEY(slug), JSON.stringify(stored));
}

/**
 * Acquires a short-lived send lock (SETNX) so two concurrent requests can
 * never both start sending the same article. Returns false if the lock is
 * already held.
 */
export async function acquireSendLock(slug: string): Promise<boolean> {
  const { result } = await redis(
    "set",
    await SEND_LOCK_KEY(slug),
    "1",
    "NX",
    "EX",
    String(SEND_LOCK_TTL_SECONDS),
  );
  return result === "OK";
}

export async function releaseSendLock(slug: string): Promise<void> {
  await redis("del", await SEND_LOCK_KEY(slug));
}
