import { createFileRoute, redirect, Link, useRouterState } from "@tanstack/react-router";
import { isAdmin } from "@/lib/api/auth";
import { getArticle } from "@/lib/api/articles";
import { ArticleEditor } from "@/components/admin/ArticleEditor";

export const Route = createFileRoute("/admin/articles/$slug")({
  beforeLoad: async () => {
    const { ok } = await isAdmin();
    if (!ok) throw redirect({ to: "/admin/login" });
  },
  loader: async ({ params }) => {
    const article = await getArticle({ data: { slug: params.slug } });
    return { article };
  },
  component: EditArticle,
});

function EditArticle() {
  const { article } = Route.useLoaderData();
  const toast = useRouterState({
    select: (s) => (s.location.state as { editorToast?: string } | null)?.editorToast,
  });

  if (!article) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <div className="text-center">
          <p className="type-label text-muted-foreground">Article not found.</p>
          <Link to="/admin" className="link-underline type-label mt-4 inline-block text-accent">
            ← Back to admin
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-5 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        <ArticleEditor article={article} isNew={false} initialMessage={toast} />
      </div>
    </main>
  );
}
