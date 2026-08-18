import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPublishedArticlePage } from "@/lib/api/articles";
import { format } from "date-fns";

export const Route = createFileRoute("/articles/$slug")({
  loader: async ({ params }) => {
    const page = await getPublishedArticlePage({ data: { slug: params.slug } });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => {
    const a = loaderData.article;
    return {
      meta: [
        { title: `${a.title} — Shashwat Chauhan` },
        { name: "description", content: a.excerpt },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.excerpt },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(a.coverImage
          ? [
              { property: "og:image", content: a.coverImage },
              { name: "twitter:image", content: a.coverImage },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: `/articles/${a.slug}` }],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article, html } = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-background px-5 pb-24 pt-8 md:px-8 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="link-underline type-label text-muted-foreground hover:text-foreground"
        >
          ← Back to writing
        </Link>

        <article className="mt-10">
          <header>
            <span className="type-label text-accent">{article.category}</span>
            <h1 className="type-display mt-4 text-5xl leading-[1.02] md:text-6xl">
              {article.title}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              {article.excerpt}
            </p>
            <div className="type-label mt-6 flex flex-wrap items-center gap-3 text-muted-foreground">
              <time dateTime={article.publishedAt}>
                {article.publishedAt
                  ? format(new Date(`${article.publishedAt}T00:00:00`), "MMM d, yyyy")
                  : ""}
              </time>
              {article.tags.length > 0 ? (
                <span className="flex flex-wrap gap-2">
                  {article.tags.map((t) => (
                    <span key={t} className="rounded-full border border-border px-2 py-0.5">
                      {t}
                    </span>
                  ))}
                </span>
              ) : null}
            </div>
          </header>

          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt=""
              className="mt-10 aspect-video w-full rounded-2xl border-2 border-foreground object-cover shadow-[6px_6px_0_var(--ink)]"
            />
          ) : null}

          <div className="article-prose mt-12" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </div>
    </main>
  );
}
