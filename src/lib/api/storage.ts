import type { Article, ArticleInput, StoredArticle } from "../article-types";
import { isValidSlug } from "../slug";
import { validateInput } from "./io";

const io = () => import("./io") as Promise<Io>;
type Io = typeof import("./io");

/**
 * Persistent article storage backed by Vercel KV (Upstash Redis REST API).
 * The same store is used locally and in production — one implementation.
 *
 * Layout: one JSON record per article under `articles:{slug}`; the list is
 * derived by scanning the `articles:*` key prefix.
 */

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

const KEY = (slug: string): string => `articles:${slug}`;

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
  const { result } = await redis("get", KEY(slug));
  if (typeof result !== "string" || !result) return null;
  try {
    return JSON.parse(result) as StoredArticle;
  } catch {
    return null;
  }
}

export async function listStoredArticles(): Promise<Article[]> {
  const { result } = await redis("keys", "articles:*");
  const keys = Array.isArray(result) ? (result as string[]) : [];
  const articles = await Promise.all(
    keys.map(async (key) => {
      const slug = key.startsWith("articles:") ? key.slice("articles:".length) : "";
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
  await redis("set", KEY(input.slug), JSON.stringify(record));
  if (current && current.slug !== input.slug) {
    await redis("del", KEY(current.slug));
  }
  return { ok: true };
}

export async function deleteStoredArticle(slug: string): Promise<void> {
  await redis("del", KEY(slug));
}
