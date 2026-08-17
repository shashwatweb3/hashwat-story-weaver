import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EXPERIENCE } from "@/lib/site-data";

export function ExperienceList() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="experience" className="relative bg-background py-[16vh]" aria-label="Experience">
      <div className="px-5 md:px-10">
        <span className="type-label text-muted-foreground">04 / Experience</span>
        <h2 className="type-display mt-8 text-[13vw] leading-[0.82]">Where I&apos;ve built</h2>
      </div>

      <ul className="mt-16 border-t border-border">
        {EXPERIENCE.map((e, i) => (
          <li
            key={e.role + e.org}
            className="border-b border-border"
            onMouseEnter={() => setOpen(i)}
            onMouseLeave={() => setOpen(null)}
          >
            <button
              type="button"
              onFocus={() => setOpen(i)}
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="group flex w-full items-baseline gap-6 px-5 py-8 text-left md:px-10"
            >
              <span className="type-label w-10 shrink-0 text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <motion.span
                animate={{ x: open === i ? 18 : 0 }}
                transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
                className={`type-display flex-1 text-[7vw] leading-[0.9] transition-colors md:text-[4.4vw] ${
                  open === i ? "text-accent" : ""
                }`}
              >
                {e.role}
              </motion.span>
              <span className="hidden font-mono text-xs text-muted-foreground md:block">
                {e.org}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-4 px-5 pb-8 md:grid-cols-12 md:px-10">
                    <p className="type-label text-muted-foreground md:col-span-4 md:col-start-2">
                      {e.org}
                    </p>
                    <p className="text-sm text-muted-foreground md:col-span-6">
                      {e.note ?? "Description slot — ready for real detail."}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </section>
  );
}
