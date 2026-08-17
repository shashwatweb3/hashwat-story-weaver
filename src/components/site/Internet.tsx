import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { POSTS } from "@/lib/site-data";

export function Internet() {
  return (
    <section className="relative bg-background py-[16vh]" aria-label="Section 08 — Internet">
      <div className="px-5 md:px-10">
        <span className="type-label text-muted-foreground">08 / Internet</span>
        <motion.h2
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="type-display mt-8 max-w-4xl text-[10vw] leading-[0.84]"
        >
          I also post on the internet.
        </motion.h2>

        <div className="mt-10 flex flex-wrap items-center gap-8">
          <a
            href="https://x.com/Shashwat_web3"
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="Open ↗"
            className="link-underline text-2xl tracking-tight md:text-4xl"
          >
            @Shashwat_web3
          </a>
          <a
            href="https://www.linkedin.com/in/shshwt/"
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="Open ↗"
            className="type-label flex items-center gap-2 text-muted-foreground"
          >
            LinkedIn <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      <ul className="mt-16 grid gap-px border-y border-border bg-border md:grid-cols-3">
        {POSTS.map((p, i) => (
          <motion.li
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group flex min-h-[240px] flex-col justify-between bg-background p-6 transition-colors hover:bg-secondary"
          >
            <span className="type-label text-muted-foreground">Post slot {i + 1}</span>
            <p className="text-sm text-muted-foreground">
              Drop a real post, screenshot or embed into this card component.
            </p>
            <span className="type-label text-accent opacity-0 transition-opacity group-hover:opacity-100">
              Ready for content
            </span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
