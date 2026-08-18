import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import openMind from "@/assets/open-mind.png";

/**
 * "What makes me different?" — pinned, scroll-scrubbed 4-stage storytelling section.
 *
 * Mechanics (Framer Motion equivalent of GSAP ScrollTrigger pin + scrub):
 *  - Outer <section> is 400vh tall  → gives ~300% extra scroll distance.
 *  - Inner wrapper is `sticky top-0 h-screen` → the visual is pinned.
 *  - useScroll(offset: start start → end end) gives 0→1 progress across the pin.
 *  - Progress is bucketed into 4 stages; every layer animates off the active stage
 *    with a soft spring / power3-style ease (never linear, never bouncy).
 *
 * To edit the story: change STAGES below (semicircle colour, lobe tint, labels, copy).
 */

type Stage = {
  id: string;
  /** Soft semicircle behind the head */
  halo: string;
  /** Tint washed over the brain lobes for this stage */
  lobe: string;
  kicker: string;
  title: string;
  body: string;
  /** Floating labels orbiting the brain — [top%, left%] positions */
  labels: { text: string; top: string; left: string }[];
};

const STAGES: Stage[] = [
  {
    id: "first",
    halo: "oklch(0.86 0.09 15)",
    lobe: "oklch(0.72 0.16 15)",
    kicker: "First,",
    title: "It starts with context",
    body: "Before a line of code, I load the whole problem into memory — the users, the constraints, the thing nobody wrote down.",
    labels: [
      { text: "Discovery", top: "8%", left: "6%" },
      { text: "Constraints", top: "24%", left: "72%" },
      { text: "User intent", top: "62%", left: "2%" },
      { text: "Edge cases", top: "78%", left: "68%" },
    ],
  },
  {
    id: "second",
    halo: "oklch(0.9 0.11 95)",
    lobe: "oklch(0.78 0.15 85)",
    kicker: "Second,",
    title: "Then it gets built fast",
    body: "Small, sharp MVPs that survive first contact with real users — shipped in days, not quarters.",
    labels: [
      { text: "Prototype", top: "10%", left: "70%" },
      { text: "Ship daily", top: "30%", left: "2%" },
      { text: "Cut scope", top: "66%", left: "74%" },
      { text: "Measure", top: "82%", left: "8%" },
    ],
  },
  {
    id: "third",
    halo: "oklch(0.88 0.1 150)",
    lobe: "oklch(0.72 0.14 150)",
    kicker: "Third,",
    title: "It gets pushed on-chain",
    body: "Web3 rails where they actually help: verifiable settlement, programmable payouts, ownership you can prove.",
    labels: [
      { text: "Verifiable", top: "6%", left: "28%" },
      { text: "Programmable", top: "34%", left: "70%" },
      { text: "Wallet-native", top: "60%", left: "0%" },
      { text: "Proof", top: "84%", left: "58%" },
    ],
  },
  {
    id: "finally",
    halo: "oklch(0.86 0.1 300)",
    lobe: "oklch(0.7 0.16 300)",
    kicker: "And finally,",
    title: "It finds its people",
    body: "Products don't grow alone. Communities, events and developer advocacy turn a repo into an ecosystem.",
    labels: [
      { text: "Community", top: "12%", left: "4%" },
      { text: "Events", top: "28%", left: "74%" },
      { text: "Advocacy", top: "64%", left: "70%" },
      { text: "Ecosystem", top: "80%", left: "6%" },
    ],
  },
];

const spring = { type: "spring", stiffness: 120, damping: 20, mass: 0.8 } as const;
const power3 = { duration: 0.7, ease: [0.16, 1, 0.3, 1] } as const;

export function WhyDifferent() {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(STAGES.length - 1, Math.max(0, Math.floor(v * STAGES.length)));
    setActive(next);
  });

  const stage = STAGES[active];

  return (
    <section
      ref={ref}
      id="why"
      className="relative h-[400vh]"
      aria-label="What makes me different"
    >
      {/* PINNED VIEWPORT */}
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Section chrome */}
        <div className="flex items-center gap-4 px-5 pt-24 md:px-10">
          <span className="type-label text-muted-foreground">What makes me different?</span>
          <span className="h-px flex-1 bg-foreground/15" />
          <span className="type-label text-muted-foreground">
            {String(active + 1).padStart(2, "0")} — {String(STAGES.length).padStart(2, "0")}
          </span>
        </div>

        <div className="grid flex-1 items-center gap-6 px-5 pb-16 md:grid-cols-[1.15fr_0.85fr] md:gap-10 md:px-10">
          {/* ---------- LEFT: head + halo + orbiting labels ---------- */}
          <div className="relative mx-auto flex h-full w-full max-w-xl items-center justify-center">
            {/* Soft semicircle that changes colour per stage */}
            <motion.div
              aria-hidden
              className="absolute bottom-[8%] aspect-square w-[86%] rounded-t-full"
              animate={{ backgroundColor: stage.halo, scale: reduced ? 1 : [0.96, 1] }}
              transition={reduced ? { duration: 0 } : spring}
              style={{ borderTopLeftRadius: "999px", borderTopRightRadius: "999px" }}
            />

            {/* The illustration. A tinted duplicate is blended over the brain area
                so lobes shift colour in sync with the stage. */}
            <div className="relative w-[74%]">
              <img
                src={openMind}
                alt="Cartoon illustration of a head with the skull open, revealing the brain"
                width={1024}
                height={1024}
                loading="lazy"
                className="relative z-10 w-full drop-shadow-[6px_6px_0_var(--ink)]"
              />
              <motion.img
                aria-hidden
                src={openMind}
                width={1024}
                height={1024}
                className="pointer-events-none absolute inset-0 z-20 w-full mix-blend-color"
                animate={{ opacity: reduced ? 0 : 0.55, filter: `drop-shadow(0 0 0 ${stage.lobe})` }}
                style={{ backgroundColor: "transparent" }}
                transition={power3}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-[22%] top-[18%] z-20 h-[30%] w-[56%] rounded-full blur-2xl"
                animate={{ backgroundColor: stage.lobe, opacity: reduced ? 0.2 : 0.55 }}
                transition={power3}
              />
            </div>

            {/* Floating labels — fade + scale 0.7→1 with stagger */}
            <div className="pointer-events-none absolute inset-0 z-30">
              {stage.labels.map((label, i) => (
                <motion.span
                  key={`${stage.id}-${label.text}`}
                  className="type-label absolute whitespace-nowrap rounded-xl border border-foreground/70 bg-card px-3 py-2 text-foreground shadow-[3px_3px_0_var(--ink)]"
                  style={{ top: label.top, left: label.left }}
                  initial={{ opacity: 0, scale: reduced ? 1 : 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={
                    reduced ? { duration: 0 } : { ...spring, delay: i * 0.1 }
                  }
                >
                  {label.text}
                </motion.span>
              ))}
            </div>
          </div>

          {/* ---------- RIGHT: beige copy card, swaps per stage ---------- */}
          <div className="relative">
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: reduced ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : power3}
              className="rounded-3xl border-2 border-foreground bg-secondary p-6 shadow-[6px_6px_0_var(--ink)] md:p-8"
            >
              <span className="type-label text-accent">{stage.kicker}</span>
              <h2 className="type-display mt-4 text-4xl leading-[1.05] md:text-5xl">
                {stage.title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                {stage.body}
              </p>
            </motion.div>

            {/* Stage progress rails */}
            <div className="mt-6 flex gap-1">
              {STAGES.map((s, i) => (
                <span
                  key={s.id}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    i <= active ? "bg-accent" : "bg-foreground/15"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
