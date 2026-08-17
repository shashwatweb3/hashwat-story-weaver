import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { DISCIPLINES } from "@/lib/site-data";

export function WhatIDo() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(DISCIPLINES.length - 1, Math.floor(v * DISCIPLINES.length));
    setActive(next < 0 ? 0 : next);
  });

  const dark = active % 2 === 1;

  return (
    <section
      ref={ref}
      id="what-i-do"
      className="relative h-[240vh]"
      aria-label="Section 02 — What I do"
    >
      <div
        className={`sticky top-0 flex h-screen flex-col overflow-hidden transition-colors duration-700 ${
          dark ? "bg-secondary text-foreground" : "bg-background text-foreground"
        }`}
      >
        <div className="flex items-center gap-4 px-5 pt-24 md:px-10">
          <span className="type-label opacity-50">02 / What I do</span>
          <span className="h-px flex-1 bg-current opacity-15" />
          <span className="type-label opacity-50">
            {String(active + 1).padStart(2, "0")} — {String(DISCIPLINES.length).padStart(2, "0")}
          </span>
        </div>

        <div className="relative flex flex-1 items-center">
          {DISCIPLINES.map((d, i) => (
            <motion.div
              key={d.word}
              className="absolute inset-x-0 px-5 md:px-10"
              initial={false}
              animate={{
                opacity: i === active ? 1 : 0,
                y: i === active ? 0 : i < active ? "-28%" : "28%",
                filter: i === active ? "blur(0px)" : "blur(10px)",
              }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden={i !== active}
            >
              <h2 className="type-display text-[18vw] leading-[0.9] md:text-[12vw]">{d.word}</h2>
              <p className="mt-8 max-w-lg text-lg leading-relaxed opacity-70 md:ml-auto md:text-xl">
                {d.body}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-1 px-5 pb-10 md:px-10">
          {DISCIPLINES.map((d, i) => (
            <span
              key={d.word}
              className={`h-px flex-1 transition-all duration-500 ${
                i <= active ? "bg-accent" : "bg-current opacity-15"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
