import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X as XIcon } from "lucide-react";
import { SOCIALS } from "@/lib/site-data";

const LINKS = [
  { label: "Community", href: "#community" },
  { label: "Internet", href: "#internet" },
  { label: "Blog", href: "#blog" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-4 z-50 px-4 md:top-6 md:px-6"
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav
          aria-label="Primary"
          className="pill mx-auto flex max-w-5xl items-center justify-between gap-6 py-2.5 pl-6 pr-2.5"
        >
          <a
            href="#top"
            className="font-display text-2xl italic leading-none text-accent md:text-3xl"
          >
            Shashwat
          </a>

          <div className="hidden items-center gap-4 md:flex lg:gap-7">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="link-underline text-sm font-medium text-foreground/80 hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={SOCIALS[0]!.href}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="Say hi"
              className="hidden rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 md:inline-block"
            >
              Work with me
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-full border-2 border-foreground p-2.5 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-background md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-6">
              <span className="font-display text-2xl italic text-accent">Shashwat</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <ul className="mt-6 px-6">
              {[...LINKS, { label: "Contact", href: SOCIALS[0]!.href }].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.12 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-border py-5"
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    {...(l.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer noopener" }
                      : {})}
                    className="type-display text-5xl"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
