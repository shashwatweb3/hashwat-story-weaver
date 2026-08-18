export type Article = {
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

export const ARTICLES_DIR_NAME = "content/articles";
