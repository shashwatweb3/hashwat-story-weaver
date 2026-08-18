import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Heart, Play } from "lucide-react";
import { X_POSTS, PERSON } from "@/lib/site-data";
import type { XPost } from "@/lib/site-data";

const ease = [0.22, 1, 0.36, 1] as const;
const PROFILE_URL = "https://x.com/Shashwat_web3";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function PostMeta({ post, small }: { post: XPost; small?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <img
        src="https://pbs.twimg.com/profile_images/2085726750634553344/H7PseFOA_200x200.jpg"
        alt=""
        loading="lazy"
        decoding="async"
        className={`shrink-0 rounded-full border border-border ${small ? "h-4 w-4" : "h-5 w-5"}`}
      />
      <span className="type-label truncate text-muted-foreground">{PERSON.handle}</span>
      <XIcon
        className={`ml-auto hidden shrink-0 text-foreground/70 sm:block ${small ? "h-3 w-3" : "h-4 w-4"}`}
      />
    </div>
  );
}

function PostFooter({ post, small }: { post: XPost; small?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <span className={`type-label ${small ? "text-[0.6rem]" : ""}`}>{post.date}</span>
        <span aria-hidden className="opacity-40">
          ·
        </span>
        <span className={`flex items-center gap-1 ${small ? "text-[0.6rem]" : "text-xs"}`}>
          <Heart aria-hidden className={`${small ? "h-2.5 w-2.5" : "h-3 w-3"} text-accent`} />
          <span className="type-label">{post.favorites.toLocaleString()}</span>
        </span>
      </span>
      <span className="type-label hidden items-center gap-1 text-accent opacity-0 transition-opacity duration-500 pointer-fine:group-hover/x:opacity-100 lg:flex">
        Open on X
        <ArrowUpRight
          aria-hidden
          className="h-3 w-3 transition-transform duration-500 pointer-fine:group-hover/x:-translate-y-0.5 pointer-fine:group-hover/x:translate-x-0.5"
        />
      </span>
    </div>
  );
}

export function Internet() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Very subtle scroll parallax — barely noticeable, just enough for depth.
  const gridY = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  const [featured, ...rest] = X_POSTS;
  const posts = [featured, ...rest];

  return (
    <section
      id="internet"
      ref={ref}
      className="relative bg-background pb-16 pt-24 md:pb-20 md:pt-24 lg:pb-24 lg:pt-28"
      aria-label="Section 04 — Internet"
    >
      <div className="px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease }}
          className="flex items-center gap-4"
        >
          <span className="type-label text-muted-foreground">04 / Internet</span>
          <span className="h-px flex-1 bg-border" />
        </motion.div>

        {/* Clip reveal — the headline slides up from behind an overflow mask */}
        <div className="overflow-hidden pb-[0.12em]">
          <motion.h2
            initial={{ y: "115%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, delay: 0.08, ease }}
            className="type-display mt-6 max-w-4xl text-[9vw] leading-[0.9] md:text-6xl lg:text-6xl xl:text-7xl"
          >
            I also post on the internet.
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, delay: 0.18, ease }}
          className="mt-7 flex flex-wrap items-center gap-8"
        >
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="Open ↗"
            className="link-underline flex items-center gap-2 text-xl tracking-tight md:text-2xl"
          >
            {PERSON.handle}
            <ArrowUpRight aria-hidden className="h-4 w-4 text-accent md:h-5 md:w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/shshwt/"
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="Open ↗"
            className="type-label flex items-center gap-2 text-muted-foreground"
          >
            LinkedIn <ArrowUpRight className="h-3 w-3" />
          </a>
        </motion.div>
      </div>

      <motion.div
        style={{ y: gridY }}
        className="mt-8 grid gap-4 px-5 md:px-10 lg:mt-12 lg:grid-cols-4 lg:gap-5 md:grid-cols-2"
      >
        {posts.map((post, i) => {
          const featuredCard = i === 0;
          return (
            <motion.a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="Open post ↗"
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.75, delay: 0.24 + i * 0.1, ease }}
              className={`group/x flex min-w-0 items-stretch gap-4 rounded-2xl bg-card transition-[border-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:flex-col md:gap-0 pointer-fine:hover:-translate-y-1 pointer-fine:hover:scale-[1.015] ${
                featuredCard
                  ? "border-2 border-foreground p-3 shadow-[4px_4px_0_var(--ink)] pointer-fine:hover:border-accent/70 md:p-0 md:shadow-[5px_5px_0_var(--ink)]"
                  : "border border-foreground/15 p-3 pointer-fine:hover:border-accent/50 md:p-0"
              }`}
            >
              {/* Media — square thumb on mobile, controlled 16/9 on md+ */}
              <div
                className={`relative shrink-0 overflow-hidden ${
                  featuredCard
                    ? "h-24 w-24 rounded-xl border border-border md:h-auto md:w-full md:rounded-b-none md:rounded-t-[calc(1rem-2px)] md:aspect-video"
                    : "h-20 w-20 rounded-xl border border-border md:h-auto md:w-full md:rounded-b-none md:rounded-t-[calc(1rem-2px)] md:aspect-video"
                }`}
              >
                {post.media && (
                  <img
                    src={post.media.thumb}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-fine:group-hover/x:scale-[1.05]"
                  />
                )}
                <span className="absolute inset-0 grid place-items-center">
                  <Play
                    aria-hidden
                    className="h-4 w-4 text-background opacity-80"
                    fill="currentColor"
                  />
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-2.5 md:gap-3 md:p-4">
                {featuredCard ? (
                  <span className="type-label hidden text-accent lg:block">Featured</span>
                ) : null}
                <PostMeta post={post} small={!featuredCard} />
                <p className="line-clamp-3 whitespace-pre-line text-[0.8rem] leading-relaxed text-foreground/90 md:line-clamp-3 lg:line-clamp-3 md:text-sm">
                  {post.text}
                  {post.link ? <span className="ml-2 text-accent">{post.link.label}</span> : null}
                </p>
                <div className="mt-auto pt-1">
                  <PostFooter post={post} small={!featuredCard} />
                </div>
              </div>
            </motion.a>
          );
        })}
      </motion.div>
    </section>
  );
}
