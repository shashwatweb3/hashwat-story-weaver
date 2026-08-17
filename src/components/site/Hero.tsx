import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { PERSON } from "@/lib/site-data";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const fade = useTransform(scrollYProgress, [0.4, 1], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative pt-32 md:pt-40" aria-label="Introduction">
      <motion.div style={{ scale, y, opacity: fade }} className="px-4 pb-16 md:px-6 md:pb-24">
        {/* Retro machine, drawn in CSS — the screen holds the headline */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease }}
          className="mx-auto w-full max-w-3xl rounded-[2.5rem] border-2 border-foreground bg-secondary p-5 shadow-[10px_10px_0_var(--ink)] md:p-8"
        >
          <div className="rounded-[1.75rem] border-2 border-foreground bg-void p-3 md:p-4">
            <div className="flex aspect-[4/3] items-center justify-center rounded-[1.1rem] bg-card px-6 text-center md:aspect-[5/4] md:px-12">
              <h1 className="type-display text-[9vw] leading-[1.02] md:text-6xl lg:text-7xl">
                {PERSON.first}{" "}
                <span className="italic text-accent">{PERSON.last}</span>
                <span className="block">builds software,</span>
                <span className="block">
                  communities &amp; experiments
                  <motion.span
                    aria-hidden
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  >
                    _
                  </motion.span>
                </span>
              </h1>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <span className="type-label text-muted-foreground">{PERSON.role}</span>
            <span className="h-3 w-24 rounded-sm border-2 border-foreground bg-card md:w-40" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-4 text-center"
        >
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {PERSON.statement}
          </p>
          <motion.span
            className="type-label flex flex-col items-center gap-2 text-foreground"
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            Scroll down
            <span aria-hidden className="text-base">
              ↓
            </span>
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}
