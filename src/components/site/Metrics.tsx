import { motion } from "motion/react";
import { METRICS } from "@/lib/site-data";

export function Metrics() {
  return (
    <section className="relative bg-void py-[16vh] text-void-foreground" aria-label="Numbers">
      <div className="px-5 md:px-10">
        <span className="type-label opacity-50">07 / Numbers</span>
      </div>
      <dl className="mt-14 grid grid-cols-1 gap-px border-y border-white/10 bg-white/10 md:grid-cols-4">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-void px-5 py-14 md:px-8"
          >
            <dt className="type-label opacity-50">{m.label}</dt>
            <dd
              className={`type-display mt-6 text-[16vw] leading-none md:text-[6vw] ${
                m.pending ? "opacity-20" : "text-accent"
              }`}
            >
              {m.value}
            </dd>
            {m.pending ? (
              <p className="mt-4 type-label opacity-35">Slot reserved</p>
            ) : null}
          </motion.div>
        ))}
      </dl>
    </section>
  );
}
