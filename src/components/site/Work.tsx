import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/lib/site-data";

const ease = [0.22, 1, 0.36, 1] as const;

export function Work() {
  return (
    <section id="work" className="px-4 py-20 md:px-6 md:py-28" aria-label="Selected work">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="type-label text-muted-foreground">03 / Selected work</span>
            <h2 className="type-display mt-4 text-5xl md:text-6xl">
              Things I&apos;ve <span className="italic text-accent">built</span>
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
            Products, experiments and Web3 projects — the short version.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease }}
            >
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="Open ↗"
                className="panel group flex h-full flex-col gap-4 p-6 transition-transform duration-300 hover:-translate-x-1 hover:-translate-y-1 md:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="type-label text-muted-foreground">
                    {p.index} / {p.category}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>

                <h3 className="type-display text-3xl md:text-4xl">{p.name}</h3>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {p.tagline
                    ? `${p.tagline}${p.secondaryTagline ? " " + p.secondaryTagline : ""}`
                    : p.description
                      ? p.description
                      : "In progress — more soon."}
                </p>

                {p.concepts ? (
                  <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                    {p.concepts.slice(0, 4).map((c) => (
                      <li
                        key={c}
                        className="type-label rounded-full border border-border px-3 py-1.5 text-muted-foreground"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
