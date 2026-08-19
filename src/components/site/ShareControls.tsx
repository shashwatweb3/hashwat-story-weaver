import { useState } from "react";
import { X, Link2, Check, Share2 } from "lucide-react";
import { SITE_URL, AUTHOR_HANDLE } from "@/lib/site-config";

/**
 * Minimal editorial share controls. X and Copy link are always available;
 * on devices with the native Web Share API an extra "Share article" button
 * opens the system share sheet.
 */
export function ShareControls({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/articles/${slug}`;
  const xIntent = `https://x.com/intent/post?text=${encodeURIComponent(`"${title}" by ${AUTHOR_HANDLE}`)}&url=${encodeURIComponent(url)}`;

  const hasNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      // user dismissed the sheet — nothing to do
    }
  }

  return (
    <div className="type-label flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <Share2 className="h-3.5 w-3.5" />
        Share
      </span>
      {hasNativeShare ? (
        <button
          type="button"
          onClick={nativeShare}
          className="link-underline cursor-pointer hover:text-accent"
        >
          Share article
        </button>
      ) : null}
      <a
        href={xIntent}
        target="_blank"
        rel="nofollow noopener noreferrer"
        data-cursor="Share on X"
        className="link-underline inline-flex items-center gap-1.5 hover:text-accent"
      >
        <X className="h-3.5 w-3.5" />X
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="link-underline inline-flex cursor-pointer items-center gap-1.5 hover:text-accent"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-accent" />
            <span className="text-accent">Copied</span>
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" />
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
