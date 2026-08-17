import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { PROJECTS } from "@/lib/site-data";
import { ProjectSection } from "./ProjectSection";

export function Work() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <div id="work">
      <div ref={ref} className="overflow-hidden bg-background py-[16vh]">
        <div className="px-5 md:px-10">
          <span className="type-label text-muted-foreground">03 / Selected work</span>
        </div>
        <motion.h2
          style={{ x }}
          className="type-display mt-8 whitespace-nowrap px-5 text-[15vw] md:px-10"
        >
          Things I&apos;ve built
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-10 max-w-lg px-5 text-lg text-muted-foreground md:ml-auto md:px-10"
        >
          A selection of products, experiments and Web3 projects.
        </motion.p>
      </div>

      {PROJECTS.map((p, i) => (
        <ProjectSection key={p.id} project={p} dark={i % 2 === 1} />
      ))}
    </div>
  );
}
