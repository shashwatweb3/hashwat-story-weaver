export type ArticleStatus = "DRAFT" | "PUBLISHED";

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
