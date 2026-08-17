import { motion } from "motion/react";
import { METRICS } from "@/lib/site-data";

export function Metrics() {
  return (
    <section className="relative px-4 py-20 md:px-6 md:py-28" aria-label="Numbers">
      <div className="mx-auto max-w-5xl">
        <span className="type-label opacity-50">07 / Numbers</span>
      </div>
      <dl className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="panel px-6 py-10"
          >
            <dt className="type-label opacity-50">{m.label}</dt>
            <dd
              className={`type-display mt-4 text-5xl leading-none md:text-6xl ${
                m.pending ? "opacity-25" : "text-accent"
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
