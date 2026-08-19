import type { Article } from "../article-types";
import { SITE_URL as DEFAULT_SITE_URL, AUTHOR_HANDLE, AUTHOR_URL } from "../site-config";

const io = () => import("./io") as Promise<Io>;
type Io = typeof import("./io");
const storage = () => import("./storage") as Promise<typeof import("./storage")>;

/**
 * Server-only newsletter layer backed by Buttondown (api.buttondown.com/v1).
 * Never imported by client code; the API key never leaves the server.
 * Subscribers are stored by the provider (double opt-in confirmation email,
 * built-in unsubscribe handling, subscription status + date).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ProviderEnv = {
  apiKey: string;
  baseUrl: string;
  siteUrl: string;
};

function providerEnv(env: Record<string, string>): ProviderEnv | null {
  const apiKey = env.BUTTONDOWN_API_KEY;
  if (!apiKey) return null;
  return {
    apiKey,
    baseUrl: env.BUTTONDOWN_API_URL ?? "https://api.buttondown.com/v1",
    siteUrl: env.SITE_URL ?? DEFAULT_SITE_URL,
  };
}

async function buttondown(
  env: ProviderEnv,
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  headers?: Record<string, string>,
): Promise<{ status: number; json: unknown }> {
  const res = await fetch(`${env.baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Token ${env.apiKey}`,
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    // non-JSON response — status still tells us what we need
  }
  return { status: res.status, json };
}

/** Subscribes an email. Buttondown sends the double opt-in confirmation itself. */
export async function subscribeToNewsletter(
  email: string,
): Promise<{ ok: true; alreadySubscribed?: boolean } | { ok: false; error: string }> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !EMAIL_RE.test(normalized)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  const env = providerEnv((await io()).getServerEnv());
  if (!env) return { ok: false, error: "Couldn't subscribe right now. Please try again later." };

  try {
    const { status } = await buttondown(
      env,
      "POST",
      "/subscribers",
      {
        email_address: normalized,
      },
      {
        "X-Idempotency-Key": crypto.randomUUID(),
      },
    );
    if (status === 200) return { ok: true, alreadySubscribed: true };
    if (status === 201) return { ok: true };
    return { ok: false, error: "Couldn't subscribe right now. Please try again later." };
  } catch {
    return { ok: false, error: "Couldn't subscribe right now. Please try again later." };
  }
}

/** Active subscriber count, or null when unavailable — never a fabricated number. */
export async function getSubscriberCount(): Promise<number | null> {
  const env = providerEnv((await io()).getServerEnv());
  if (!env) return null;
  try {
    const { status, json } = await buttondown(env, "GET", "/subscribers?type=regular");
    if (
      status === 200 &&
      json &&
      typeof json === "object" &&
      typeof (json as { count?: unknown }).count === "number"
    ) {
      return (json as { count: number }).count;
    }
    const fallback = await buttondown(env, "GET", "/subscribers");
    if (
      fallback.status === 200 &&
      typeof (fallback.json as { count?: unknown } | null)?.count === "number"
    ) {
      return (fallback.json as { count: number }).count;
    }
    return null;
  } catch {
    return null;
  }
}

function articleUrl(siteUrl: string, slug: string): string {
  return `${siteUrl.replace(/\/+$/, "")}/articles/${slug}`;
}

/**
 * Buttondown emails are Markdown-native: the provider renders the body and
 * appends its own unsubscribe footer, so only `subject` and `body` (plus the
 * "live dangerously" header) are sent. The explicit editor-mode comment keeps
 * the rich HTML template rendering as-is instead of being auto-detected.
 */
function buildEmailBody(article: Article, siteUrl: string): string {
  const url = articleUrl(siteUrl, article.slug);
  return [
    "<!-- buttondown-editor-mode: fancy -->",
    '<div style="background:#faf6ef;padding:32px 16px;">',
    '<div style="max-width:560px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#0a0a0a;">',
    '<p style="font-family:Georgia,serif;font-size:22px;font-weight:bold;margin:0 0 28px;">Shashwat</p>',
    article.coverImage
      ? `<img src="${article.coverImage}" alt="" width="100%" style="width:100%;max-width:560px;height:auto;border-radius:14px;display:block;margin:0 0 24px;" />`
      : "",
    `<h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.2;margin:0 0 12px;">${article.title}</h1>`,
    `<p style="font-size:15px;line-height:1.6;color:#3d3a34;margin:0 0 24px;">${article.excerpt}</p>`,
    `<a href="${url}" style="display:inline-block;background:#0a0a0a;color:#faf6ef;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;padding:13px 26px;border-radius:10px;">Read the article</a>`,
    `<p style="font-size:13px;color:#3d3a34;margin:28px 0 0;">By <a href="${AUTHOR_URL}" style="color:#0a0a0a;font-weight:600;">${AUTHOR_HANDLE}</a> on X</p>`,
    '<hr style="border:none;border-top:2px solid #e5ddcc;margin:28px 0 16px;" />',
    '<p style="font-size:12px;line-height:1.5;color:#7a7468;margin:0;">You received this because you subscribed to Shashwat\'s newsletter.</p>',
    "</div>",
    "</div>",
  ].join("\n");
}

/**
 * Sends a published article to all subscribers. Guarded server-side:
 * send lock (no concurrent sends), published-only, and SENT articles are
 * never resent — duplicate protection lives in our state machine since the
 * provider's email endpoint accepts no idempotency key.
 */
export async function sendArticleNewsletter(
  slug: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const env = providerEnv((await io()).getServerEnv());
  if (!env) return { ok: false, error: "Newsletter is not configured yet." };

  const st = await storage();
  if (!(await st.acquireSendLock(slug))) {
    return { ok: false, error: "This article is already being sent. Please wait a moment." };
  }
  try {
    const article = await st.getStoredArticle(slug);
    if (!article) return { ok: false, error: "Article not found." };
    if (!article.published) {
      return { ok: false, error: "Only published articles can be sent to subscribers." };
    }
    const state = await st.getNewsletterState(slug);
    if (state?.status === "SENT") {
      return { ok: false, error: "This article has already been sent." };
    }

    await st.setNewsletterState(slug, "SENDING");
    const { status } = await buttondown(
      env,
      "POST",
      "/emails",
      {
        subject: article.title,
        body: buildEmailBody(article, env.siteUrl),
        status: "about_to_send",
      },
      {
        "X-Buttondown-Live-Dangerously": "true",
      },
    );

    if (status >= 200 && status < 300) {
      await st.setNewsletterState(slug, "SENT", new Date().toISOString());
      return { ok: true };
    }
    await st.setNewsletterState(slug, "FAILED");
    return {
      ok: false,
      error: `Could not send the newsletter (provider responded ${status}). Please try again later.`,
    };
  } catch {
    await st.setNewsletterState(slug, "FAILED");
    return { ok: false, error: "Could not send the newsletter. Please try again later." };
  } finally {
    await st.releaseSendLock(slug);
  }
}
