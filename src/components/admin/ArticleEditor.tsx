import { useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { saveArticle, deleteArticle } from "@/lib/api/articles";
import type { Article, ArticleInput } from "@/lib/article-types";
import { slugify } from "@/lib/slug";
import { renderMarkdownClient } from "@/lib/markdown-client";

const emptyInput: ArticleInput = {
  slug: "",
  title: "",
  excerpt: "",
  category: "",
  tags: [],
  coverImage: "",
  publishedAt: "",
  published: false,
  content: "",
};

const inputCls =
  "w-full border-2 border-foreground bg-card px-4 py-2.5 text-sm outline-none transition-shadow focus:shadow-[3px_3px_0_var(--ink)]";
const labelCls = "type-label mb-2 block text-muted-foreground";
const btnCls =
  "type-label cursor-pointer border-2 border-foreground bg-card px-4 py-2.5 transition-transform hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--ink)]";

export function ArticleEditor({ article, isNew }: { article: Article | null; isNew: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleInput>(() =>
    article
      ? {
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          category: article.category,
          tags: article.tags,
          coverImage: article.coverImage ?? "",
          publishedAt: article.publishedAt,
          published: article.published,
          content: article.content,
        }
      : emptyInput,
  );
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewHtml = useMemo(() => renderMarkdownClient(form.content), [form.content]);

  function set<K extends keyof ArticleInput>(key: K, value: ArticleInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: !slugTouched ? slugify(title) : f.slug,
    }));
  }

  async function persist(next: ArticleInput, redirect = false) {
    setSaving(true);
    setMessage(null);
    setError(null);
    const res = await saveArticle({ data: { input: next, originalSlug: article?.slug } });
    setSaving(false);
    if (!res.ok) {
      setError(res.error ?? "Could not save.");
      return;
    }
    setMessage(next.published ? "Published." : "Saved as draft.");
    if (redirect && next.slug) {
      router.navigate({ to: "/admin/articles/$slug", params: { slug: next.slug } });
    }
  }

  function saveDraft() {
    persist({ ...form, published: false });
  }

  function publish() {
    const publishedAt = form.publishedAt || new Date().toISOString().slice(0, 10);
    persist({ ...form, published: true, publishedAt });
  }

  function unpublish() {
    persist({ ...form, published: false });
  }

  async function remove() {
    if (!article) return;
    if (!window.confirm(`Delete "${article.title}"? This cannot be undone.`)) return;
    const res = await deleteArticle({ data: { slug: article.slug } });
    if (res.ok) router.navigate({ to: "/admin" });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <span className="type-label text-muted-foreground">
            {isNew ? "New article" : `Editing · ${article?.slug}`}
          </span>
          <div className="flex border-2 border-foreground">
            {(["edit", "preview"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`type-label cursor-pointer px-4 py-2 ${
                  tab === t ? "bg-foreground text-background" : "bg-card text-muted-foreground"
                }`}
              >
                {t === "edit" ? "EDIT" : "PREVIEW"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {form.published ? (
            <button type="button" onClick={unpublish} className={btnCls} disabled={saving}>
              Unpublish
            </button>
          ) : (
            <button type="button" onClick={publish} className={btnCls} disabled={saving}>
              Publish
            </button>
          )}
          <button type="button" onClick={saveDraft} className={btnCls} disabled={saving}>
            {saving ? "Saving…" : "Save draft"}
          </button>
          {!isNew ? (
            <button
              type="button"
              onClick={remove}
              className="type-label cursor-pointer border-2 border-accent px-4 py-2.5 text-accent hover:bg-accent hover:text-accent-foreground"
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>

      {message ? <p className="type-label mt-4 text-accent">{message}</p> : null}
      {error ? <p className="type-label mt-4 text-accent">{error}</p> : null}

      {tab === "edit" ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <div>
              <label htmlFor="title" className={labelCls}>
                Title
              </label>
              <input
                id="title"
                className={inputCls}
                value={form.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Article title"
              />
            </div>
            <div>
              <label htmlFor="slug" className={labelCls}>
                Slug
              </label>
              <input
                id="slug"
                className={`${inputCls} font-mono`}
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value.toLowerCase());
                }}
                placeholder="my-article-slug"
              />
            </div>
            <div>
              <label htmlFor="excerpt" className={labelCls}>
                Excerpt
              </label>
              <textarea
                id="excerpt"
                className={`${inputCls} min-h-20 resize-y`}
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                placeholder="One or two sentences shown on the blog list and in search results."
              />
            </div>
            <div>
              <label htmlFor="content" className={labelCls}>
                Content · Markdown
              </label>
              <textarea
                id="content"
                className={`${inputCls} min-h-[26rem] resize-y font-mono text-[0.8125rem] leading-relaxed`}
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder={
                  "# Heading\n\nParagraph with **bold**, *italic*, [links](https://…)\n\n- list\n\n> quote\n\n```js\ncode\n```\n\n![alt](image-url)"
                }
              />
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <label htmlFor="category" className={labelCls}>
                Category
              </label>
              <input
                id="category"
                className={inputCls}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="Web3"
              />
            </div>
            <div>
              <label htmlFor="tags" className={labelCls}>
                Tags (comma separated)
              </label>
              <input
                id="tags"
                className={inputCls}
                value={form.tags.join(", ")}
                onChange={(e) =>
                  set(
                    "tags",
                    e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  )
                }
                placeholder="vara, rust, community"
              />
            </div>
            <div>
              <label htmlFor="coverImage" className={labelCls}>
                Cover image URL
              </label>
              <input
                id="coverImage"
                className={inputCls}
                value={form.coverImage ?? ""}
                onChange={(e) => set("coverImage", e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div>
              <label htmlFor="publishedAt" className={labelCls}>
                Publication date
              </label>
              <input
                id="publishedAt"
                type="date"
                className={inputCls}
                value={form.publishedAt}
                onChange={(e) => set("publishedAt", e.target.value)}
              />
            </div>
            <p className="type-label text-muted-foreground">
              Status: {form.published ? "PUBLISHED" : "DRAFT"}
            </p>
          </div>
        </div>
      ) : (
        <div className="article-prose mt-8 rounded-3xl border-2 border-foreground bg-card px-6 py-10 md:px-10">
          {previewHtml ? (
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          ) : (
            <p className="type-label text-muted-foreground">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
