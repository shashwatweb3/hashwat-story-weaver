import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SOCIALS } from "@/lib/site-data";
import { MagneticButton } from "./MagneticButton";

export function FinalCta() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const clip = useTransform(scrollYProgress, [0, 0.45], ["inset(18% 6% 18% 6%)", "inset(0% 0% 0% 0%)"]);
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.92, 1]);

  return (
    <section id="contact" ref={ref} className="relative bg-background" aria-label="Contact">
      <motion.div
        style={{ clipPath: clip, scale }}
        className="flex min-h-screen flex-col justify-between bg-void px-5 py-24 text-void-foreground md:px-10"
      >
        <span className="type-label opacity-50">10 / Next</span>

        <h2 className="type-display max-w-6xl text-[11vw] leading-[0.84]">
          What are we
          <span className="block text-accent">building next?</span>
        </h2>

        <div className="flex flex-wrap items-end justify-between gap-10">
          <MagneticButton href={SOCIALS[0]!.href} cursor="Open ↗" className="text-lg">
            Let&apos;s talk
            <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>

          <ul className="flex gap-10">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="Open ↗"
                  className="link-underline type-label"
                >
                  {s.label} — {s.handle}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
