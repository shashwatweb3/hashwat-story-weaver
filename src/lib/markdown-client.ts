import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({ gfm: true, breaks: false });

/** Render markdown to HTML for live preview inside the admin editor (client-side only). */
export function renderMarkdownClient(md: string): string {
  if (typeof window === "undefined") return "";
  const raw = marked.parse(md, { async: false }) as string;
  return DOMPurify.sanitize(raw);
}
