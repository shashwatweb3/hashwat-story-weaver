export const PERSON = {
  name: "Shashwat Chauhan",
  first: "Shashwat",
  last: "Chauhan",
  role: "Software Engineer · Web3 Builder · Community Builder",
  statement:
    "I build software, products, communities and experiments at the intersection of technology and Web3.",
  handle: "@Shashwat_web3",
};

export const SOCIALS = [
  { label: "X", handle: "@Shashwat_web3", href: "https://x.com/Shashwat_web3" },
  { label: "LinkedIn", handle: "in/shshwt", href: "https://www.linkedin.com/in/shshwt/" },
];

export type ProjectStep = { label: string; note?: string };

export type Project = {
  id: string;
  index: string;
  name: string;
  tagline?: string;
  secondaryTagline?: string;
  category: string;
  status?: string;
  description?: string;
  /** Placeholder slot: fill in when copy is confirmed. */
  descriptionPending?: boolean;
  steps?: ProjectStep[];
  concepts?: string[];
  href: string;
  visual: "flekvar" | "shepherd" | "safar" | "tradevault" | "varasplit";
};

export const PROJECTS: Project[] = [
  {
    id: "flekvar",
    index: "01",
    name: "Flekvar",
    category: "Product",
    status: "Coming Soon",
    descriptionPending: true,
    href: "https://flekvar.xyz/",
    visual: "flekvar",
  },
  {
    id: "shepherd",
    index: "02",
    name: "Shepherd",
    tagline: "You vibe-coded it.",
    secondaryTagline: "Shepherd keeps it alive.",
    category: "Autonomous Agent",
    description:
      "Shepherd is an autonomous maintenance agent for AI-built (\u201cvibe-coded\u201d) apps. It scans public GitHub repositories for security issues, gives them a Survival Score (0\u2013100), and produces a plain-English report that founders can act on.",
    steps: [
      { label: "Scan", note: "Public GitHub repositories" },
      { label: "Detect", note: "Security issues surfaced" },
      { label: "Score", note: "Survival Score 0\u2013100" },
      { label: "Explain", note: "Plain-English report" },
      { label: "Survive", note: "Founders can act on it" },
    ],
    href: "https://shepherd-ivory.vercel.app/",
    visual: "shepherd",
  },
  {
    id: "safar-e-up",
    index: "03",
    name: "Safar-e-UP",
    category: "Web",
    descriptionPending: true,
    href: "https://safar-e-up.vercel.app/",
    visual: "safar",
  },
  {
    id: "tradevault-arena",
    index: "04",
    name: "TradeVault Arena",
    tagline: "Synthetic trading tournaments.",
    category: "Vara dApp · MVP",
    description:
      "TradeVault Arena is an MVP Vara dApp for synthetic trading tournaments. An admin creates a time-bound BTC/USD tournament. Players pay the same entry fee, receive the same virtual starting balance, trade one mock pair, take long or short positions, and finish ranked by percentage return.",
    steps: [
      { label: "Enter", note: "Same entry fee for everyone" },
      { label: "Trade", note: "One mock pair, long or short" },
      { label: "Compete", note: "Identical virtual balances" },
      { label: "Rank", note: "Ranked by percentage return" },
      { label: "Win", note: "1st 60% · 2nd 30% · 3rd 10%" },
    ],
    concepts: ["1st — 60%", "2nd — 30%", "3rd — 10%"],
    href: "https://tradevault-arena-7ddv-nt4z08h0r-shashwatweb3s-projects.vercel.app/",
    visual: "tradevault",
  },
  {
    id: "varasplit",
    index: "05",
    name: "VaraSplit",
    tagline: "Not just payments.",
    secondaryTagline: "Proof.",
    category: "On-chain Coordination",
    description:
      "VaraSplit is an on-chain coordination system that turns group settlements and payouts into verifiable, programmable financial workflows.",
    steps: [
      { label: "Group", note: "An informal, shared cost" },
      { label: "Settlement", note: "Who owes what, agreed" },
      { label: "Wallet", note: "Identity without paperwork" },
      { label: "On-chain", note: "Programmable execution" },
      { label: "Proof", note: "Verifiable by anyone" },
    ],
    concepts: ["Transparent", "Wallet-based", "On-chain", "Verifiable"],
    href: "https://varasplit-y8xv-six.vercel.app/",
    visual: "varasplit",
  },
];

export type Experience = {
  role: string;
  org: string;
  /** Optional — easy to fill in later. */
  note?: string;
};

export const EXPERIENCE: Experience[] = [
  { role: "Software Engineer", org: "Learnqoch — Mumbai" },
  { role: "Software Engineer", org: "Laxkal Technologies" },
  { role: "Freelance Software Engineer", org: "20+ projects completed" },
  { role: "Growth", org: "Monaris" },
  { role: "Developer Advocate", org: "Vara Network" },
  { role: "Community", org: "Lucknow DAO" },
];

export const DISCIPLINES = [
  {
    word: "Build",
    body: "Software, Web3 products, experiments and developer-focused tools.",
  },
  {
    word: "Grow",
    body: "Helping products and ecosystems reach users and communities.",
  },
  {
    word: "Experiment",
    body: "Building MVPs, prototypes and unconventional ideas.",
  },
  {
    word: "Connect",
    body: "Community building, developer advocacy, events and ecosystem work.",
  },
];

export const METRICS: { value: string; label: string; pending?: boolean }[] = [
  { value: "20+", label: "Projects completed" },
  { value: "—", label: "Events", pending: true },
  { value: "—", label: "Communities", pending: true },
  { value: "—", label: "Products shipped", pending: true },
];

export const ECOSYSTEM = ["Vara Network", "Monaris", "Lucknow DAO"];

/** X posts — add real posts / embeds here later. */
export const POSTS: { id: string; text?: string; href?: string }[] = [
  { id: "post-1" },
  { id: "post-2" },
  { id: "post-3" },
];

export type BlogPost = {
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  href?: string;
};

/** Replace with real posts / links any time. */
export const POSTS_BLOG: BlogPost[] = [
  {
    title: "Why on-chain settlement beats a spreadsheet",
    excerpt:
      "What building VaraSplit taught me about turning informal group money into programmable, verifiable workflows.",
    date: "2026",
    tag: "Web3",
  },
  {
    title: "Shipping MVPs that survive first contact",
    excerpt:
      "A working method for going from idea to a usable product in days, not quarters — and knowing what to cut.",
    date: "2026",
    tag: "Building",
  },
  {
    title: "Building Lucknow DAO from zero",
    excerpt:
      "Notes on starting a local Web3 community: the first ten people matter more than the first thousand.",
    date: "2025",
    tag: "Community",
  },
  {
    title: "Developer advocacy is a product role",
    excerpt:
      "Lessons from the Vara ecosystem on treating docs, demos and developer experience as the actual product.",
    date: "2025",
    tag: "Ecosystem",
  },
];
