import { motion, useReducedMotion } from "motion/react";
import type { Project } from "@/lib/site-data";

/**
 * Abstract, code-drawn project visuals. Swap any of these for a real
 * screenshot by rendering an <img> in place of the matching case.
 */
export function ProjectVisual({ project }: { project: Project }) {
  const reduced = useReducedMotion();
  const loop = reduced ? {} : undefined;

  const frame =
    "relative aspect-[4/3] w-full overflow-hidden border border-current/15 bg-card md:aspect-[16/10]";

  switch (project.visual) {
    case "flekvar":
      return (
        <div className={`${frame} bg-void text-void-foreground`}>
          <div className="absolute inset-0 rule-grid opacity-10" />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={loop ?? { opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="type-label tracking-[0.5em]">Coming soon</span>
          </motion.div>
          <motion.span
            className="absolute left-1/2 top-0 h-full w-px bg-accent"
            animate={loop ?? { x: ["-40%", "40%"] }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          />
        </div>
      );

    case "shepherd":
      return (
        <div className={`${frame} bg-void text-void-foreground`}>
          <div className="absolute inset-0 grid grid-cols-12 opacity-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="border-r border-white/10" />
            ))}
          </div>
          <motion.div
            className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-accent/25 to-transparent"
            animate={loop ?? { y: ["-10%", "100%"] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
            <div className="space-y-2 font-mono text-[10px] opacity-70">
              {["repo/scan --public", "findings: 7", "severity: mixed", "report: plain-english"].map(
                (l, i) => (
                  <motion.p
                    key={l}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 0.8, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                  >
                    {l}
                  </motion.p>
                ),
              )}
            </div>
            <div className="flex items-end justify-between">
              <span className="type-label opacity-60">Survival Score</span>
              <motion.span
                className="type-display text-[18vw] leading-none text-accent md:text-[9vw]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                0–100
              </motion.span>
            </div>
          </div>
        </div>
      );

    case "safar":
      return (
        <div className={`${frame}`}>
          <div className="absolute inset-0 rule-grid opacity-40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="type-label text-muted-foreground">Visual placeholder</span>
            <span className="type-display text-[9vw] leading-none opacity-10">Safar</span>
            <span className="type-label text-muted-foreground">
              Screenshot slot — swap in later
            </span>
          </div>
          <motion.span
            className="absolute bottom-0 left-0 h-px bg-accent"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      );

    case "tradevault":
      return (
        <div className={`${frame} bg-void text-void-foreground`}>
          <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full" aria-hidden>
            <motion.path
              d="M0 180 L40 160 L80 172 L120 120 L160 140 L200 96 L240 118 L280 70 L320 88 L360 42 L400 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.45"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M0 60 L40 92 L80 78 L120 130 L160 112 L200 156 L240 132 L280 172 L320 150 L360 190 L400 168"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.2, ease: "easeInOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
            <span className="type-label opacity-60">BTC/USD · Mock pair · No real money</span>
            <div className="flex gap-6 font-mono text-xs opacity-80">
              <span>1st 60%</span>
              <span>2nd 30%</span>
              <span>3rd 10%</span>
            </div>
          </div>
        </div>
      );

    case "varasplit":
    default:
      return (
        <div className={`${frame}`}>
          <div className="absolute inset-0 rule-grid opacity-30" />
          <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full" aria-hidden>
            {[
              [80, 60],
              [80, 180],
              [200, 120],
              [320, 70],
              [320, 170],
            ].map(([cx, cy], i) => (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r="6"
                fill="currentColor"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              />
            ))}
            {[
              "M80 60 L200 120",
              "M80 180 L200 120",
              "M200 120 L320 70",
              "M200 120 L320 170",
            ].map((d, i) => (
              <motion.path
                key={d}
                d={d}
                stroke="var(--accent)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 + i * 0.12 }}
              />
            ))}
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex justify-between p-6 type-label text-muted-foreground md:p-10">
            <span>Group</span>
            <span>Wallet</span>
            <span className="text-accent">Proof</span>
          </div>
        </div>
      );
  }
}
