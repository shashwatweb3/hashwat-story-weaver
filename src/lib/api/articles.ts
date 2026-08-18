import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "./auth";
import type { Article, ArticleInput } from "./article-types";

type Io = typeof import("./io");

const io = () => import("./io") as Promise<Io>;

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
  const m = await io();
  return sortArticles(m.listArticleFiles(), includeDrafts === true);
});

export const getArticle = createServerFn({ method: "GET" }).handler(async ({ data }) => {
  const { slug } = data as { slug: string };
  const m = await io();
  return m.readArticleFile(slug);
});

export const getPublishedArticle = createServerFn({ method: "GET" }).handler(async ({ data }) => {
  const { slug } = data as { slug: string };
  const m = await io();
  const article = m.readArticleFile(slug);
  if (!article || !article.published) return null;
  return article;
});

/** Public article page payload: sanitized HTML stays on the server. */
export const getPublishedArticlePage = createServerFn({ method: "GET" }).handler(
  async ({ data }) => {
    const { slug } = data as { slug: string };
    const m = await io();
    const article = m.readArticleFile(slug);
    if (!article || !article.published) return null;
    return { article, html: m.renderArticleHtml(article.content) };
  },
);

export const saveArticle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    if (!context.isAdmin) throw new Error("Unauthorized");
    const { input, originalSlug } = data as { input: ArticleInput; originalSlug?: string };
    const m = await io();
    return m.saveArticleFile(input, originalSlug);
  });

export const deleteArticle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    if (!context.isAdmin) throw new Error("Unauthorized");
    const { slug } = data as { slug: string };
    const m = await io();
    m.deleteArticleFile(slug);
    return { ok: true };
  });
