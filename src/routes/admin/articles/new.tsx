import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAdmin } from "@/lib/api/auth";
import { ArticleEditor } from "@/components/admin/ArticleEditor";

export const Route = createFileRoute("/admin/articles/new")({
  beforeLoad: async () => {
    const { ok } = await isAdmin();
    if (!ok) throw redirect({ to: "/admin/login" });
  },
  loader: async () => ({ article: null }),
  component: NewArticle,
});

function NewArticle() {
  return (
    <main className="min-h-screen bg-background px-5 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        <ArticleEditor article={null} isNew />
      </div>
    </main>
  );
}
