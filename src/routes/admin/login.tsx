import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { login, isAdmin } from "@/lib/api/auth";
import { useState } from "react";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: async () => {
    const { ok } = await isAdmin();
    if (ok) throw redirect({ to: "/admin" });
  },
  component: LoginPage,
});

function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await login({ data: { password } });
      if (res && typeof res === "object" && "error" in res && (res as { error?: string }).error) {
        setError((res as { error: string }).error);
        setBusy(false);
        return;
      }
    } catch (err) {
      if (!(err instanceof Response)) {
        setError("Could not reach the server.");
        setBusy(false);
        return;
      }
    }
    window.location.href = "/admin";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm rounded-3xl border-2 border-foreground bg-card p-8 shadow-[6px_6px_0_var(--ink)]">
        <span className="type-label text-muted-foreground">Private</span>
        <h1 className="type-display mt-3 text-4xl">
          Admin <span className="italic text-accent">login</span>
        </h1>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border-2 border-foreground bg-background px-4 py-2.5 text-sm outline-none transition-shadow focus:shadow-[3px_3px_0_var(--ink)]"
          />
          {error ? <p className="type-label text-accent">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="type-label w-full cursor-pointer border-2 border-foreground bg-foreground px-4 py-2.5 text-background transition-transform hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--accent)] disabled:opacity-50"
          >
            {busy ? "Checking…" : "Enter"}
          </button>
        </form>
        <p className="mt-6 text-center">
          <Link to="/" className="link-underline type-label text-muted-foreground">
            ← Back to site
          </Link>
        </p>
      </div>
    </main>
  );
}
