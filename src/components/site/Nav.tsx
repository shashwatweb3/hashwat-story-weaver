import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X as XIcon } from "lucide-react";
import { PERSON } from "@/lib/site-data";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setCondensed(v > 80));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 mix-blend-difference"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav
          aria-label="Primary"
          className="flex items-center justify-between px-5 py-5 text-[oklch(0.98_0_0)] md:px-10"
        >
          <a href="#top" className="type-label font-mono">
            <motion.span animate={{ opacity: condensed ? 0.75 : 1 }}>
              {PERSON.name}
            </motion.span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="type-label link-underline">
                {l.label}
              </a>
            ))}
            <a
              href="https://x.com/Shashwat_web3"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Shashwat on X"
              data-cursor="Open ↗"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
                <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.96 6.82H1.68l7.73-8.83L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z" />
              </svg>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="type-label md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-void text-void-foreground md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center justify-between px-5 py-5">
              <span className="type-label">Menu</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <ul className="mt-8 px-5">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-white/10 py-5"
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="type-display text-[13vw]"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-10 flex gap-6 px-5 type-label">
              <a href="https://x.com/Shashwat_web3" target="_blank" rel="noreferrer noopener">
                X ↗
              </a>
              <a
                href="https://www.linkedin.com/in/shshwt/"
                target="_blank"
                rel="noreferrer noopener"
              >
                LinkedIn ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
