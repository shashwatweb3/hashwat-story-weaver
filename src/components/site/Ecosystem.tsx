import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ECOSYSTEM } from "@/lib/site-data";

const PILLARS = ["Building", "Growth", "Communities", "Ecosystems"];

export function Ecosystem() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.7, 1]);
  const letterSpacing = useTransform(scrollYProgress, [0, 0.6], ["-0.06em", "0.06em"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-background py-[18vh]"
      aria-label="Section 06 — Web3 ecosystem"
    >
      <div className="px-5 md:px-10">
        <span className="type-label text-muted-foreground">06 / Ecosystem</span>
      </div>

      <motion.h2
        style={{ scale, letterSpacing }}
        className="type-display mt-10 text-center text-[16vw] leading-none md:text-[10vw]"
      >
        Web3
      </motion.h2>

      <div className="mt-16 grid gap-16 px-5 md:grid-cols-2 md:px-10">
        <ul>
          {ECOSYSTEM.map((e, i) => (
            <motion.li
              key={e}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-baseline gap-4 border-b border-border py-6 text-3xl tracking-tight md:text-4xl"
            >
              <span className="type-label text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              {e}
            </motion.li>
          ))}
        </ul>

        <div className="relative">
          <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden>
            {PILLARS.map((_, i) => {
              const angle = (i / PILLARS.length) * Math.PI * 2;
              const cx = 200 + Math.cos(angle) * 110;
              const cy = 150 + Math.sin(angle) * 90;
              return (
                <g key={i}>
                  <motion.line
                    x1={200}
                    y1={150}
                    x2={cx}
                    y2={cy}
                    stroke="var(--accent)"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.15 }}
                  />
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="currentColor"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.15 }}
                  />
                  <text
                    x={cx}
                    y={cy - 14}
                    textAnchor="middle"
                    className="fill-current font-mono text-[9px] uppercase tracking-[0.2em]"
                  >
                    {PILLARS[i]}
                  </text>
                </g>
              );
            })}
            <circle cx="200" cy="150" r="6" className="fill-accent" />
          </svg>
        </div>
      </div>
    </section>
  );
}
