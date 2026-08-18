import {
  readFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
  unlinkSync,
} from "node:fs";
import { resolve } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import type { Article, ArticleInput } from "../article-types";
import { isValidSlug } from "../slug";

/**
 * Node-only implementation layer for the article + auth server functions.
 * This module must ONLY be loaded via `await import("./io")` from server fn
 * handlers — it is never statically imported by client code.
 */

marked.setOptions({ gfm: true, breaks: false });

function findEnvFile(): string | null {
  // Walk up from the current working directory so this also works when the
  // server runs from a build output (e.g. .output/server) instead of the
  // project root (dev server / local node runtime).
  let dir = process.cwd();
  for (let depth = 0; depth < 5; depth++) {
    const candidate = resolve(dir, ".env.local");
    if (existsSync(candidate)) return candidate;
    const parent = resolve(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/** Reads process.env first, then a gitignored `.env.local` in the project root. */
export function getServerEnv(): Record<string, string> {
  const env: Record<string, string> = { ...(process.env as Record<string, string>) };
  const file = findEnvFile();
  if (file) {
    try {
      for (const line of readFileSync(file, "utf8").split("\n")) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (m && !(m[1] in env)) {
          env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
        }
      }
    } catch {
      // fall through to process.env only
    }
  }
  return env;
}

const ARTICLES_DIR = "content/articles";

function getArticlesDir(): string {
  return resolve(process.cwd(), ARTICLES_DIR);
}

function ensureDir(): void {
  mkdirSync(getArticlesDir(), { recursive: true });
}

type Frontmatter = {
  title?: unknown;
  excerpt?: unknown;
  category?: unknown;
  tags?: unknown;
  coverImage?: unknown;
  publishedAt?: unknown;
  published?: unknown;
};

function parseArticleFile(file: string): Article | null {
  const raw = readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const fm = data as Frontmatter;
  const slug = file.slice(0, -3).split("/").pop() ?? "";
  if (!slug) return null;
  return {
    slug,
    title: typeof fm.title === "string" ? fm.title.trim() : "",
    excerpt: typeof fm.excerpt === "string" ? fm.excerpt.trim() : "",
    category: typeof fm.category === "string" ? fm.category.trim() : "",
    tags: Array.isArray(fm.tags) ? fm.tags.filter((t): t is string => typeof t === "string") : [],
    coverImage:
      typeof fm.coverImage === "string" && fm.coverImage.trim() ? fm.coverImage.trim() : undefined,
    publishedAt: typeof fm.publishedAt === "string" ? fm.publishedAt.trim() : "",
    published: fm.published === true,
    content,
  };
}

function listFiles(): string[] {
  ensureDir();
  return readdirSync(getArticlesDir()).filter((f) => f.endsWith(".md"));
}

function serializeArticle(input: ArticleInput): string {
  const tags = input.tags.filter(Boolean);
  const cover = input.coverImage?.trim() ?? "";
  const fm: Record<string, string | string[] | boolean> = {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    category: input.category,
    tags,
    published: input.published,
  };
  if (cover) fm.coverImage = cover;
  if (input.publishedAt) fm.publishedAt = input.publishedAt;
  const head = Object.entries(fm)
    .map(([k, v]) => {
      if (Array.isArray(v)) return `${k}: ${JSON.stringify(v)}`;
      if (typeof v === "boolean") return `${k}: ${v}`;
      return `${k}: ${JSON.stringify(v)}`;
    })
    .join("\n");
  const body = input.content.trimEnd();
  return `---\n${head}\n---\n\n${body}\n`;
}

export function validateInput(input: ArticleInput): string | null {
  if (!input.title.trim()) return "Title is required.";
  if (!isValidSlug(input.slug)) return "Slug must be lowercase letters, numbers and hyphens.";
  if (!input.excerpt.trim()) return "Excerpt is required.";
  if (!input.category.trim()) return "Category is required.";
  if (input.published && !input.publishedAt) return "A publication date is required to publish.";
  if (input.publishedAt && !/^\d{4}-\d{2}-\d{2}$/.test(input.publishedAt)) {
    return "Publication date must be YYYY-MM-DD.";
  }
  return null;
}

export function listArticleFiles(): Article[] {
  const files = listFiles();
  return files
    .map((f) => parseArticleFile(resolve(getArticlesDir(), f)))
    .filter((a): a is Article => a !== null);
}

export function readArticleFile(slug: string): Article | null {
  const file = resolve(getArticlesDir(), `${slug}.md`);
  if (!existsSync(file)) return null;
  return parseArticleFile(file);
}

export function saveArticleFile(
  input: ArticleInput,
  originalSlug?: string,
): { ok: boolean; error?: string } {
  const error = validateInput(input);
  if (error) return { ok: false, error };
  ensureDir();
  if (input.slug !== originalSlug) {
    const clash = resolve(getArticlesDir(), `${input.slug}.md`);
    if (existsSync(clash)) return { ok: false, error: "That slug is already in use." };
    if (originalSlug) {
      const old = resolve(getArticlesDir(), `${originalSlug}.md`);
      if (existsSync(old)) unlinkSync(old);
    }
  }
  const target = resolve(getArticlesDir(), `${input.slug}.md`);
  writeFileSync(target, serializeArticle(input), "utf8");
  return { ok: true };
}

export function deleteArticleFile(slug: string): void {
  const file = resolve(getArticlesDir(), `${slug}.md`);
  if (existsSync(file)) unlinkSync(file);
}

const ALLOWED_TAGS = [
  "h2",
  "h3",
  "h4",
  "p",
  "strong",
  "em",
  "a",
  "ul",
  "ol",
  "li",
  "blockquote",
  "code",
  "pre",
  "img",
  "hr",
  "br",
  "del",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

/** Server-side markdown → sanitized HTML for public article pages. */
export function renderArticleHtml(content: string): string {
  const raw = marked.parse(content, { async: false }) as string;
  return sanitizeHtml(raw, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "rel", "target"],
      img: ["src", "alt", "title"],
      th: ["align"],
      td: ["align"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "nofollow noopener noreferrer",
        target: "_blank",
      }),
    },
  });
}
