import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { PERSON } from "@/lib/site-data";

const ROLES = ["Software Engineer", "Web3 Builder", "Community Builder"];

export function About() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  return (
    <section id="about" ref={ref} className="relative bg-background py-24" aria-label="About">
      <div className="px-5 md:px-10">
        <span className="type-label text-muted-foreground">06 / About</span>

        <motion.ul style={{ y }} className="mt-12">
          {ROLES.map((r, i) => (
            <motion.li
              key={r}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="type-display text-[9vw] leading-[0.9]"
              style={{ marginLeft: `${i * 6}%` }}
            >
              {r}
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-20 grid gap-8 md:grid-cols-12">
          <p className="type-label text-muted-foreground md:col-span-3">{PERSON.name}</p>
          <div className="space-y-6 md:col-span-7">
            <p className="text-xl leading-relaxed md:text-2xl">
              I&apos;m a software engineer and Web3 builder who enjoys taking ideas from a rough
              concept to something people can actually use.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              My work spans software development, Web3 products, ecosystem growth, developer
              advocacy and community building.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
