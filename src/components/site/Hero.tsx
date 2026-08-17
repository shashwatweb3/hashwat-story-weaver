import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue } from "motion/react";
import { PERSON } from "@/lib/site-data";

export function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const firstX = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const lastX = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.72]);
  const blur = useTransform(scrollYProgress, [0.4, 1], [0, 8]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const fade = useTransform(scrollYProgress, [0.55, 1], [1, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const tiltX = useTransform(smx, [-1, 1], [-18, 18]);
  const tiltY = useTransform(smy, [-1, 1], [-10, 10]);

  const onMove = (e: React.PointerEvent) => {
    mx.set((e.clientX / window.innerWidth) * 2 - 1);
    my.set((e.clientY / window.innerHeight) * 2 - 1);
  };

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onMove}
      className="relative h-[190vh]"
      aria-label="Introduction"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden bg-void text-void-foreground">
        <div className="pointer-events-none absolute inset-0 rule-grid opacity-[0.08]" />

        <motion.div style={{ opacity: fade, y: lift }} className="relative flex-1">
          <div className="flex h-full flex-col justify-center">
            <motion.h1
              className="type-display px-5 md:px-10"
              style={{ scale, filter }}
            >
              <motion.span
                className="block text-[19vw] leading-[0.8]"
                style={{ x: firstX, translateX: tiltX }}
                initial={{ y: "22%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {PERSON.first}
              </motion.span>
              <motion.span
                className="block text-right text-[19vw] leading-[0.8] text-accent"
                style={{ x: lastX, translateY: tiltY }}
                initial={{ y: "22%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {PERSON.last}
              </motion.span>
            </motion.h1>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: fade }}
          className="relative grid gap-8 border-t border-white/10 px-5 py-6 md:grid-cols-3 md:px-10"
        >
          <motion.p
            className="type-label text-void-foreground/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {PERSON.role}
          </motion.p>
          <motion.p
            className="max-w-md text-sm leading-relaxed text-void-foreground/75 md:col-span-1"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.8 }}
          >
            {PERSON.statement}
          </motion.p>
          <div className="flex items-end justify-start md:justify-end">
            <motion.span
              className="type-label flex items-center gap-3 text-void-foreground/60"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              Scroll
              <span className="block h-8 w-px bg-current" />
            </motion.span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
