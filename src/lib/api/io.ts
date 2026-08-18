import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import type { ArticleInput } from "../article-types";
import { isValidSlug } from "../slug";

/**
 * Server-only helpers for the article + auth server functions.
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
