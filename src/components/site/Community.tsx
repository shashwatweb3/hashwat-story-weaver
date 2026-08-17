import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/** Add real community / event photos here — src + alt. */
const GALLERY = [
  { id: "g1", alt: "Community photo slot", label: "Meetup" },
  { id: "g2", alt: "Community photo slot", label: "Workshop" },
  { id: "g3", alt: "Community photo slot", label: "Event" },
  { id: "g4", alt: "Community photo slot", label: "Collaboration" },
  { id: "g5", alt: "Community photo slot", label: "Ecosystem" },
];

export function Community() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.25, 1], ["2%", "-62%"]);

  return (
    <section
      ref={ref}
      className="relative h-[300vh] bg-void text-void-foreground"
      aria-label="Section 05 — Community"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="px-5 md:px-10">
          <span className="type-label opacity-50">05 / Community</span>
          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="type-display mt-8 max-w-5xl text-[8vw] leading-[0.86]"
          >
            I didn&apos;t just want to participate.
            <span className="block text-accent">I wanted to build.</span>
          </motion.h2>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] opacity-60">
            Lucknow DAO
          </p>
        </div>

        <motion.ul style={{ x }} className="mt-16 flex gap-6 px-5 md:px-10">
          {GALLERY.map((g) => (
            <li
              key={g.id}
              className="relative aspect-[4/3] w-[70vw] shrink-0 border border-white/15 md:w-[32vw]"
            >
              <div className="absolute inset-0 rule-grid opacity-10" />
              <div className="absolute inset-0 flex flex-col items-start justify-end gap-1 p-5">
                <span className="type-label text-accent">{g.label}</span>
                <span className="type-label opacity-40">Photo slot</span>
              </div>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
