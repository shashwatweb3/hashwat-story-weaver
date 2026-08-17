import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  className?: string;
  strength?: number;
  cursor?: string;
  onClick?: () => void;
};

export function MagneticButton({
  children,
  href,
  className,
  strength = 0.35,
  cursor,
  onClick,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  const handleMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const classes = cn(
    "inline-flex items-center gap-3 whitespace-nowrap type-label border border-current px-6 py-4 transition-colors hover:bg-foreground hover:text-background",
    className,
  );

  const props = {
    ref: ref as never,
    className: classes,
    style: { x: sx, y: sy },
    onPointerMove: handleMove,
    onPointerLeave: reset,
    "data-cursor": cursor,
  };

  if (href) {
    const external = href.startsWith("http");
    return (
      <motion.a
        {...props}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button {...props} type="button" onClick={onClick}>
      {children}
    </motion.button>
  );
}
