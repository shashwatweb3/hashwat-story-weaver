import { motion } from "motion/react";
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
    <div className="flex items-center gap-2">
      <img
        src="https://pbs.twimg.com/profile_images/2085726750634553344/H7PseFOA_200x200.jpg"
        alt=""
        loading="lazy"
        decoding="async"
        className={`rounded-full border border-border ${small ? "h-4 w-4" : "h-5 w-5"}`}
      />
      <span className="type-label text-muted-foreground">{PERSON.handle}</span>
      <XIcon className={`ml-auto text-foreground/70 ${small ? "h-3 w-3" : "h-4 w-4"}`} />
    </div>
  );
}

function PostFooter({ post, small }: { post: XPost; small?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
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
      <span className="type-label flex items-center gap-1 text-accent opacity-0 transition-opacity duration-500 pointer-fine:group-hover/x:opacity-100">
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
  const [featured, ...rest] = X_POSTS;

  return (
    <section className="relative bg-background py-24" aria-label="Section 08 — Internet">
      <div className="px-5 md:px-10">
        <span className="type-label text-muted-foreground">08 / Internet</span>
        <motion.h2
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease }}
          className="type-display mt-8 max-w-4xl text-[10vw] leading-[0.84]"
        >
          I also post on the internet.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="mt-10 flex flex-wrap items-center gap-8"
        >
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="Open ↗"
            className="link-underline flex items-center gap-2 text-2xl tracking-tight md:text-4xl"
          >
            {PERSON.handle}
            <ArrowUpRight aria-hidden className="h-5 w-5 text-accent md:h-6 md:w-6" />
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

      <div className="mt-16 grid gap-4 px-5 md:px-10 lg:grid-cols-12 lg:gap-5">
        {/* Featured post */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, delay: 0.18, ease }}
          className="lg:col-span-7"
        >
          <a
            href={featured.url}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="Open post ↗"
            className="group/x flex h-full flex-col rounded-2xl border-2 border-foreground bg-card shadow-[6px_6px_0_var(--ink)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-fine:hover:-translate-y-1"
          >
            <div
              className={`relative overflow-hidden rounded-t-[calc(1.5rem-2px)] ${featured.media?.aspect}`}
            >
              {featured.media && (
                <img
                  src={featured.media.thumb}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-fine:group-hover/x:scale-[1.04]"
                />
              )}
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-foreground bg-background/85 text-foreground transition-transform duration-500 pointer-fine:group-hover/x:scale-110"
              >
                <Play aria-hidden className="h-4 w-4 translate-x-[1px]" fill="currentColor" />
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
              <PostMeta post={featured} />
              <p className="whitespace-pre-line text-lg leading-relaxed tracking-tight md:text-[1.35rem] md:leading-[1.35]">
                {featured.text}
                {featured.link ? (
                  <span className="ml-2 text-accent">{featured.link.label}</span>
                ) : null}
              </p>
              <div className="mt-auto pt-2">
                <PostFooter post={featured} />
              </div>
            </div>
          </a>
        </motion.div>

        {/* Remaining posts */}
        <div className="grid gap-4 md:gap-5 lg:col-span-5 lg:grid-rows-3">
          {rest.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: 0.28 + i * 0.09, ease }}
              className="h-full"
            >
              <a
                href={post.url}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="Open post ↗"
                className="group/x flex h-full items-stretch gap-4 rounded-2xl border border-border bg-card p-4 transition-[border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-fine:hover:-translate-y-1 md:gap-5 md:p-5"
              >
                {post.media && (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border md:h-24 md:w-24">
                    <img
                      src={post.media.thumb}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-fine:group-hover/x:scale-105"
                    />
                    <span className="absolute inset-0 grid place-items-center">
                      <Play
                        aria-hidden
                        className="h-4 w-4 text-background opacity-80"
                        fill="currentColor"
                      />
                    </span>
                  </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <PostMeta post={post} small />
                  <p className="line-clamp-4 whitespace-pre-line text-[0.82rem] leading-relaxed text-foreground/90 md:text-sm">
                    {post.text}
                  </p>
                  <div className="mt-auto pt-1">
                    <PostFooter post={post} small />
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
