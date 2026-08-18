import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

type GalleryItem = {
  id: string;
  src?: string;
  alt?: string;
  label: string;
  objectPosition?: string;
};

/**
 * Community gallery.
 *
 * Drop real photos into `src/assets/community/` (names may include
 * `meetup`, `workshop`, or `event` to help with automatic mapping).
 * If no images are present, the original placeholder behaviour is used.
 */

// attempt to eagerly load any images placed under src/assets/community
// use `query: '?url'` for Vite compatibility and to get URL strings
const importedImages = import.meta.glob("/src/assets/community/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function mapFilesToList() {
  const files = Object.entries(importedImages).map(([p, url]) => {
    const raw = p.split("/").pop() || p;
    const name = raw.replace(/\?url$/, "");
    return { path: p, src: url as string, name };
  });

  if (files.length === 0) return null;

  // helper to prefer certain keywords
  const pickPriority = (file: { name: string }) => {
    const n = file.name.toLowerCase();
    if (n.includes("meetup")) return 0;
    if (n.includes("workshop")) return 1;
    if (n.includes("event")) return 2;
    if (n.includes("collab") || n.includes("collaboration")) return 3;
    return 4;
  };

  files.sort((a, b) => {
    const pa = pickPriority(a);
    const pb = pickPriority(b);
    if (pa !== pb) return pa - pb;
    return a.name.localeCompare(b.name);
  });

  return files.map((f, i): GalleryItem => {
    // label inference from filename
    const ln = f.name.toLowerCase();
    let label = "Community";
    if (ln.includes("meetup")) label = "Meetup";
    else if (ln.includes("workshop")) label = "Workshop";
    else if (ln.includes("event")) label = "Event";
    else if (ln.includes("collab") || ln.includes("collaboration")) label = "Collaboration";
    else if (ln.includes("ecosystem")) label = "Ecosystem";

    // sensible default object-position per filename hints
    let objectPosition = "center";
    if (f.name.toLowerCase().includes("meetup")) objectPosition = "center 40%";
    else if (f.name.toLowerCase().includes("workshop")) objectPosition = "center 45%";
    else if (f.name.toLowerCase().includes("event")) objectPosition = "center 60%";

    return { id: `img-${i}`, src: f.src, alt: f.name, label, objectPosition };
  });
}

const FALLBACK_GALLERY: GalleryItem[] = [
  { id: "g1", alt: "Community photo slot", label: "Meetup" },
  { id: "g2", alt: "Community photo slot", label: "Workshop" },
  { id: "g3", alt: "Community photo slot", label: "Event" },
];

export function Community() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.25, 1], ["2%", "-62%"]);

  const files = mapFilesToList() as GalleryItem[] | null;
  const gallery: GalleryItem[] = files && files.length > 0 ? files : FALLBACK_GALLERY;

  return (
    <section
      ref={ref}
      id="community"
      className="relative h-[180vh]"
      aria-label="Section 03 — Community"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
          <span className="type-label text-muted-foreground">03 / Community</span>
          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="type-display mt-4 max-w-3xl text-4xl leading-[1.02] md:text-6xl"
          >
            I didn&apos;t just want to participate.
            <span className="block text-accent">I wanted to build.</span>
          </motion.h2>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] opacity-60">
            Lucknow DAO
          </p>
        </div>

        <motion.ul style={{ x }} className="mt-12 flex gap-5 px-4 md:px-6">
          {gallery.map((g) => (
            <motion.li
              key={g.id}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="panel group relative aspect-[4/3] w-[70vw] shrink-0 overflow-hidden rounded-2xl border border-foreground/6 md:w-[30vw]"
            >
              <div className="absolute inset-0 rule-grid opacity-10" />

              {/** offset shadow behind card */}
              <div className="absolute inset-0 -z-10 rounded-2xl transform translate-x-3 translate-y-3 bg-black/5" />

              {/** Image area */}
              {g.src ? (
                <motion.img
                  src={g.src}
                  alt={g.alt || g.name}
                  initial={{ scale: 1.06 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.035 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{ objectPosition: g.objectPosition ?? "center" }}
                  className="absolute inset-0 z-20 h-full w-full object-cover will-change-transform"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Photo slot
                </div>
              )}

              <div className="absolute inset-0 flex flex-col items-start justify-end gap-1 p-5">
                <span className="type-label text-accent">{g.label}</span>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
