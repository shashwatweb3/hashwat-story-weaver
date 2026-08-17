import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/site-data";
import { ProjectVisual } from "./ProjectVisual";
import { MagneticButton } from "./MagneticButton";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProjectSection({ project, dark }: { project: Project; dark?: boolean }) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const titleX = useTransform(scrollYProgress, [0, 1], ["8%", "-14%"]);
  const visualY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const visualScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.96]);

  return (
    <section
      id={project.id}
      ref={ref}
      aria-label={project.name}
      className={`relative overflow-hidden py-[14vh] ${
        dark ? "bg-void text-void-foreground" : "bg-background text-foreground"
      }`}
    >
      <div className="px-5 md:px-10">
        <div className="flex items-baseline gap-4">
          <span className="type-label opacity-50">
            {project.index} / {project.category}
          </span>
          <span className="h-px flex-1 bg-current opacity-15" />
          {project.status ? (
            <span className="type-label text-accent">{project.status}</span>
          ) : null}
        </div>

        <motion.h3
          style={{ x: titleX }}
          className="type-display mt-8 whitespace-nowrap text-[17vw] leading-[0.8]"
        >
          {project.name}
        </motion.h3>

        {(project.tagline || project.secondaryTagline) && (
          <div className="mt-10 max-w-3xl">
            {[project.tagline, project.secondaryTagline].filter(Boolean).map((t, i) => (
              <motion.p
                key={t}
                initial={{ y: 28, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.8, delay: i * 0.2, ease }}
                className={`text-3xl tracking-tight md:text-5xl ${i === 1 ? "text-accent" : ""}`}
              >
                {t}
              </motion.p>
            ))}
          </div>
        )}
      </div>

      <motion.div
        style={{ y: visualY, scale: visualScale }}
        className="mt-14 px-5 md:px-10"
        data-cursor="View"
      >
        <a href={project.href} target="_blank" rel="noreferrer noopener" className="block">
          <ProjectVisual project={project} />
        </a>
      </motion.div>

      {project.steps ? (
        <ol className="mt-14 grid grid-cols-1 gap-px border-y border-current/15 bg-current/10 md:grid-cols-5">
          {project.steps.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className={`group px-5 py-10 md:px-6 ${dark ? "bg-void" : "bg-background"}`}
            >
              <span className="type-label opacity-40">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-4 type-display text-3xl transition-colors group-hover:text-accent md:text-4xl">
                {s.label}
              </p>
              {s.note ? (
                <p className="mt-3 font-mono text-[11px] leading-relaxed opacity-55">{s.note}</p>
              ) : null}
            </motion.li>
          ))}
        </ol>
      ) : null}

      <div className="mt-16 grid gap-10 px-5 md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          {project.concepts ? (
            <ul className="flex flex-wrap gap-2">
              {project.concepts.map((c) => (
                <li key={c} className="type-label border border-current/25 px-3 py-2 opacity-70">
                  {c}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="md:col-span-6">
          {project.description ? (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease }}
              className="text-lg leading-relaxed opacity-80 md:text-xl"
            >
              {project.description}
            </motion.p>
          ) : (
            <p className="type-label opacity-50">
              Description pending — this slot is ready for real copy.
            </p>
          )}
        </div>

        <div className="flex items-start md:col-span-2 md:justify-end">
          <MagneticButton href={project.href} cursor="Open ↗">
            Visit project
            <ArrowUpRight className="h-3.5 w-3.5" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
