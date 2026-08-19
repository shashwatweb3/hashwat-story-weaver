import { useState } from "react";
import { subscribeNewsletter } from "@/lib/api/articles";
import { NEWSLETTER } from "@/lib/site-config";

type State = "idle" | "submitting" | "success" | "already" | "error";

/**
 * Compact editorial newsletter form. Subscribes server-side; the provider
 * (Buttondown) owns double opt-in, subscriber storage and unsubscribe.
 */
export function NewsletterCta({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setMessage(NEWSLETTER.invalidEmail);
      setState("error");
      return;
    }
    setState("submitting");
    setMessage(null);
    const res = await subscribeNewsletter({ data: { email: value } });
    if (res.ok && !res.alreadySubscribed) {
      setState("success");
      setMessage(NEWSLETTER.success);
    } else if (res.ok) {
      setState("already");
      setMessage(NEWSLETTER.alreadySubscribed);
    } else {
      setState("error");
      setMessage(res.error ?? NEWSLETTER.error);
    }
  }

  const inputCls =
    "w-full min-w-0 border-2 border-foreground bg-card px-4 py-2.5 text-sm outline-none transition-shadow focus:shadow-[3px_3px_0_var(--ink)]";

  return (
    <div className="rounded-3xl border-2 border-foreground bg-card p-6 shadow-[6px_6px_0_var(--ink)] md:p-8">
      <h3 className={`type-display text-accent ${compact ? "text-2xl" : "text-3xl md:text-4xl"}`}>
        {NEWSLETTER.heading}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
        {NEWSLETTER.copy}
      </p>
      <form onSubmit={submit} noValidate className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={NEWSLETTER.placeholder}
          aria-label="Email address"
          className={`${inputCls} flex-1`}
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className="type-label cursor-pointer border-2 border-foreground bg-foreground px-6 py-2.5 text-background transition-transform hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--accent)] disabled:cursor-default disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {state === "submitting" ? "Subscribing…" : NEWSLETTER.button}
        </button>
      </form>
      <p
        className={`type-label mt-4 text-sm ${
          state === "error"
            ? "text-accent"
            : state === "success" || state === "already"
              ? "text-accent"
              : "text-muted-foreground"
        }`}
      >
        {message ?? NEWSLETTER.consent}
      </p>
    </div>
  );
}
