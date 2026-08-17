import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const LINES = ["Sometimes software.", "Sometimes communities.", "Usually both."];

export function Intro() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const headlineX = useTransform(scrollYProgress, [0, 1], ["6%", "-10%"]);
  const headlineOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.8, 1], [0, 1, 1, 0.2]);

  return (
    <section ref={ref} className="relative py-24" aria-label="Section 01 — The introduction">
      <div className="px-5 md:px-10">
        <div className="mb-16 flex items-center gap-4">
          <span className="type-label text-muted-foreground">01 / The introduction</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <motion.h2
          style={{ x: headlineX, opacity: headlineOpacity }}
          className="type-display whitespace-nowrap text-[14vw]"
        >
          I build things.
        </motion.h2>

        <div className="mt-16 grid gap-y-6 md:grid-cols-12">
          <div className="md:col-span-5 md:col-start-7">
            {LINES.map((line, i) => (
              <motion.p
                key={line}
                initial={{ y: 34, opacity: 0, filter: "blur(6px)" }}
                whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.9, delay: i * 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="border-b border-border py-6 text-3xl tracking-tight md:text-4xl"
              >
                {line}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
