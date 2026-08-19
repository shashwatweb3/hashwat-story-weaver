export type ArticleStatus = "DRAFT" | "PUBLISHED";

export type NewsletterStatus = "NOT_SENT" | "SENDING" | "SENT" | "FAILED";

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage?: string;
  /** ISO date "YYYY-MM-DD". Empty for drafts. */
  publishedAt: string;
  published: boolean;
  /** Markdown body. */
  content: string;
  createdAt: string;
  updatedAt: string;
  newsletterStatus: NewsletterStatus;
  /** ISO timestamp of the successful newsletter send, or null. */
  newsletterSentAt: string | null;
};

export type ArticleInput = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage?: string;
  publishedAt: string;
  published: boolean;
  content: string;
};

export type StoredArticle = Omit<Article, "published"> & {
  status: ArticleStatus;
};
