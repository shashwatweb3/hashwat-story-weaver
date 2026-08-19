import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "./auth";
import type { Article, ArticleInput } from "../article-types";

type Io = typeof import("./io");
type Storage = typeof import("./storage");
type Newsletter = typeof import("./newsletter");

const io = () => import("./io") as Promise<Io>;
const storage = () => import("./storage") as Promise<Storage>;
const newsletter = () => import("./newsletter") as Promise<Newsletter>;

function sortArticles(articles: Article[], includeDrafts: boolean): Article[] {
  const visible = articles.filter((a) => includeDrafts || a.published);
  return visible.sort((a, b) => {
    if (a.published && b.published) return b.publishedAt.localeCompare(a.publishedAt);
    if (a.published !== b.published) return a.published ? -1 : 1;
    return 0;
  });
}

export const listArticles = createServerFn({ method: "GET" }).handler(async ({ data }) => {
  const { includeDrafts } = (data ?? {}) as { includeDrafts?: boolean };
  try {
    const all = await (await storage()).listStoredArticles();
    return sortArticles(all, includeDrafts === true);
  } catch {
    return [];
  }
});

export const getArticle = createServerFn({ method: "GET" }).handler(async ({ data }) => {
  const { slug } = data as { slug: string };
  try {
    return await (await storage()).getStoredArticle(slug);
  } catch {
    return null;
  }
});

export const getPublishedArticle = createServerFn({ method: "GET" }).handler(async ({ data }) => {
  const { slug } = data as { slug: string };
  try {
    const article = await (await storage()).getStoredArticle(slug);
    if (!article || !article.published) return null;
    return article;
  } catch {
    return null;
  }
});

/** Public article page payload: sanitized HTML stays on the server. */
export const getPublishedArticlePage = createServerFn({ method: "GET" }).handler(
  async ({ data }) => {
    const { slug } = data as { slug: string };
    try {
      const article = await (await storage()).getStoredArticle(slug);
      if (!article || !article.published) return null;
      const m = await io();
      return { article, html: m.renderArticleHtml(article.content) };
    } catch {
      return null;
    }
  },
);

export const saveArticle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    if (!context.isAdmin) throw new Error("Unauthorized");
    const { input, originalSlug } = data as { input: ArticleInput; originalSlug?: string };
    try {
      return await (await storage()).saveStoredArticle(input, originalSlug);
    } catch {
      return { ok: false, error: "Could not save the article. Please try again later." };
    }
  });

export const deleteArticle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    if (!context.isAdmin) throw new Error("Unauthorized");
    const { slug } = data as { slug: string };
    try {
      await (await storage()).deleteStoredArticle(slug);
      return { ok: true };
    } catch {
      return { ok: false, error: "Could not delete the article. Please try again later." };
    }
  });

/** Public: subscribe an email to the newsletter (double opt-in handled by the provider). */
export const subscribeNewsletter = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  const { email } = data as { email: string };
  return (await newsletter()).subscribeToNewsletter(email);
});

/** Admin: subscriber count (null when the provider is unreachable) + sent article count. */
export const getNewsletterStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.isAdmin) throw new Error("Unauthorized");
    try {
      const all = await (await storage()).listStoredArticles();
      const sentCount = all.filter((a) => a.newsletterStatus === "SENT").length;
      return { subscribers: await (await newsletter()).getSubscriberCount(), sentCount };
    } catch {
      return { subscribers: null, sentCount: 0 };
    }
  });

/** Admin: send a published article to newsletter subscribers (explicit action only). */
export const sendArticleNewsletter = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    if (!context.isAdmin) throw new Error("Unauthorized");
    const { slug } = data as { slug: string };
    return (await newsletter()).sendArticleNewsletter(slug);
  });
