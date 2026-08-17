import { useEffect, type ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let destroy: (() => void) | undefined;

    (async () => {
      const Lenis = (await import("lenis")).default;
      const lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.09 });
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      const onClick = (e: MouseEvent) => {
        const target = (e.target as HTMLElement)?.closest?.("a[href^='#']");
        if (!target) return;
        const id = target.getAttribute("href")!.slice(1);
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -8 });
      };
      document.addEventListener("click", onClick);

      destroy = () => {
        document.removeEventListener("click", onClick);
        lenis.destroy();
      };
    })();

    return () => {
      cancelAnimationFrame(raf);
      destroy?.();
    };
  }, []);

  return <>{children}</>;
}
