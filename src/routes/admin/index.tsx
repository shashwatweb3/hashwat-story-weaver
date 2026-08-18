import { createFileRoute, redirect, Link, useRouter } from "@tanstack/react-router";
import { isAdmin, logout } from "@/lib/api/auth";
import { listArticles, saveArticle, deleteArticle } from "@/lib/api/articles";
import { useState } from "react";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    const { ok } = await isAdmin();
    if (!ok) throw redirect({ to: "/admin/login" });
  },
  loader: async () => {
    const articles = await listArticles({ data: { includeDrafts: true } });
    return { articles };
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const { articles } = Route.useLoaderData();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function togglePublished(slug: string, published: boolean) {
    const article = articles.find((a) => a.slug === slug);
    if (!article) return;
    setBusy(true);
    setError(null);
    const input = {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      tags: article.tags,
      coverImage: article.coverImage ?? "",
      publishedAt: published
        ? article.publishedAt || new Date().toISOString().slice(0, 10)
        : article.publishedAt,
      published,
      content: article.content,
    };
    const res = await saveArticle({ data: { input, originalSlug: article.slug } });
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Could not save.");
      return;
    }
    router.invalidate();
  }

  async function remove(slug: string) {
    const article = articles.find((a) => a.slug === slug);
    if (!article) return;
    if (!window.confirm(`Delete "${article.title}"? This cannot be undone.`)) return;
    setBusy(true);
    const res = await deleteArticle({ data: { slug } });
    setBusy(false);
    if (!res.ok) setError("Could not delete.");
    router.invalidate();
  }

  return (
    <main className="min-h-screen bg-background px-5 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="type-label text-muted-foreground">Private</span>
            <h1 className="type-display mt-2 text-4xl md:text-5xl">
              Articles <span className="italic text-accent">admin</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="link-underline type-label text-muted-foreground"
              data-cursor="View site"
            >
              View site ↗
            </Link>
            <button
              type="button"
              onClick={async () => {
                try {
                  await logout();
                } catch {
                  // redirect Response from the server fn
                }
                window.location.href = "/admin/login";
              }}
              className="type-label cursor-pointer text-muted-foreground hover:text-accent"
            >
              Logout
            </button>
            <Link
              to="/admin/articles/new"
              className="type-label border-2 border-foreground bg-foreground px-4 py-2.5 text-background transition-transform hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--accent)]"
            >
              + New article
            </Link>
          </div>
        </header>

        {error ? <p className="type-label mt-6 text-accent">{error}</p> : null}

        <div className="mt-10 overflow-hidden rounded-3xl border-2 border-foreground bg-card shadow-[6px_6px_0_var(--ink)]">
          {articles.length === 0 ? (
            <p className="type-label px-6 py-14 text-center text-muted-foreground">
              No articles yet. Write your first one.
            </p>
          ) : (
            <ul className="divide-y-2 divide-foreground">
              {articles.map((a) => (
                <li
                  key={a.slug}
                  className="flex flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:gap-6"
                >
                  <div className="min-w-0 flex-1">
                    <p className="type-display truncate text-xl">{a.title}</p>
                    <p className="type-label mt-1 text-muted-foreground">
                      {a.slug} · {a.category}
                      {a.tags.length ? ` · ${a.tags.join(", ")}` : ""}
                    </p>
                  </div>
                  <span
                    className={`type-label w-24 shrink-0 ${
                      a.published ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    {a.published ? "PUBLISHED" : "DRAFT"}
                  </span>
                  <span className="type-label w-24 shrink-0 text-muted-foreground">
                    {a.publishedAt || "—"}
                  </span>
                  <div className="flex shrink-0 flex-wrap items-center gap-3">
                    <Link
                      to="/admin/articles/$slug"
                      params={{ slug: a.slug }}
                      className="link-underline type-label text-muted-foreground"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => togglePublished(a.slug, !a.published)}
                      disabled={busy}
                      className="type-label cursor-pointer text-accent disabled:opacity-50"
                    >
                      {a.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(a.slug)}
                      disabled={busy}
                      className="type-label cursor-pointer text-accent disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
