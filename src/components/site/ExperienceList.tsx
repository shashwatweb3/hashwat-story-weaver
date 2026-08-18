import { motion } from "motion/react";
import { EXPERIENCE } from "@/lib/site-data";

const ease = [0.22, 1, 0.36, 1] as const;

function Description({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight) return <>{text}</>;
  const idx = text.indexOf(highlight);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-accent">{highlight}</span>
      {text.slice(idx + highlight.length)}
    </>
  );
}

export function ExperienceList() {
  return (
    <section
      id="experience"
      className="relative bg-background py-20 md:py-24"
      aria-label="Experience"
    >
      <div className="px-5 md:px-10">
        <span className="type-label text-muted-foreground">05 / Experience</span>
        <h2 className="type-display mt-8 text-[13vw] leading-[0.82]">Where I&apos;ve built</h2>
      </div>

      <ul className="group/list mt-12 border-t border-border md:mt-16">
        {EXPERIENCE.map((e, i) => (
          <li
            key={e.role + e.org}
            className="group/row relative border-b border-border transition-opacity duration-500 pointer-fine:group-hover/list:opacity-40 pointer-fine:hover:opacity-100!"
          >
            <span
              aria-hidden
              className="absolute bottom-0 left-0 top-0 w-[2px] origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-fine:group-hover/row:scale-y-100"
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.07, ease }}
              className="px-5 py-6 md:px-10 md:py-9"
            >
              <div className="grid grid-cols-2 items-baseline gap-x-4 gap-y-2 md:grid-cols-12 md:gap-x-6">
                <span className="type-label order-1 col-span-1 text-muted-foreground transition-colors duration-300 pointer-fine:group-hover/row:text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="type-label order-2 col-span-1 flex items-baseline justify-end gap-2 text-right text-muted-foreground md:order-4 md:col-span-2 md:justify-self-end">
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 translate-y-[-0.05em] rounded-full border border-current opacity-60 transition-all duration-300 pointer-fine:group-hover/row:scale-125 pointer-fine:group-hover/row:border-accent pointer-fine:group-hover/row:bg-accent pointer-fine:group-hover/row:opacity-100"
                  />
                  {e.status}
                </span>

                <div className="order-3 col-span-2 md:order-2 md:col-span-4">
                  <h3 className="type-display text-[7vw] leading-[0.95] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:text-[clamp(1.8rem,3vw,3.4rem)] pointer-fine:group-hover/row:translate-x-2">
                    {e.role}
                  </h3>
                  <p className="type-label mt-2 text-muted-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-fine:group-hover/row:translate-x-1">
                    {e.org}
                  </p>
                </div>

                <p className="order-4 col-span-2 text-sm leading-relaxed text-muted-foreground transition-colors duration-500 md:order-3 md:col-span-5 md:text-[0.95rem] pointer-fine:group-hover/row:text-foreground">
                  <Description text={e.description} highlight={e.highlight} />
                </p>
              </div>
            </motion.div>
          </li>
        ))}
      </ul>
    </section>
  );
}
