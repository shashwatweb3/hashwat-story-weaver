import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import type { Article } from "@/lib/article-types";

const ease = [0.22, 1, 0.36, 1] as const;

function formatDate(publishedAt: string): string {
  if (!publishedAt) return "";
  return format(new Date(`${publishedAt}T00:00:00`), "MMM d, yyyy").toUpperCase();
}

export function Blog({ articles }: { articles: Article[] }) {
  return (
    <section id="blog" className="px-4 py-20 md:px-6 md:py-28" aria-label="Blog">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="type-label text-muted-foreground">03 / Blog</span>
            <h2 className="type-display mt-4 text-5xl md:text-6xl">
              Notes &amp; <span className="italic text-accent">writing</span>
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
            Short essays, ideas and things I&apos;ve learned while building software, products and
            communities.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="mt-10 rounded-3xl border-2 border-foreground bg-card px-6 py-14 text-center shadow-[6px_6px_0_var(--ink)]">
            <p className="type-label text-muted-foreground">Nothing published yet.</p>
          </div>
        ) : (
          <ul className="mt-10 divide-y-2 divide-foreground overflow-hidden rounded-3xl border-2 border-foreground bg-card shadow-[6px_6px_0_var(--ink)]">
            {articles.map((post, i) => (
              <motion.li
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.55, delay: i * 0.07, ease }}
              >
                <Link
                  to="/articles/$slug"
                  params={{ slug: post.slug }}
                  data-cursor="Read ↗"
                  className="group flex flex-col gap-3 px-6 py-7 transition-colors hover:bg-secondary md:flex-row md:items-center md:gap-8 md:px-8"
                >
                  <span className="type-label w-28 shrink-0 text-muted-foreground">
                    {formatDate(post.publishedAt)}
                  </span>
                  <div className="flex-1">
                    <h3 className="type-display text-2xl md:text-3xl">{post.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </div>
                  <span className="type-label flex items-center gap-2 text-accent">
                    {post.category}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
