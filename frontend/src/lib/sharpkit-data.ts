export type Merchant = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  rewardRate: number; // SHRP per $1
  perks: string[];
  accent: "primary" | "shrp" | "balance" | "reward";
  featured?: boolean;
  emoji: string;
};

export const merchants: Merchant[] = [
  {
    id: "stylestore",
    name: "StyleStore",
    category: "Fashion",
    tagline: "Designer apparel & limited drops",
    rewardRate: 5,
    perks: ["5% back in SHRP", "Early access drops", "Free shipping"],
    accent: "shrp",
    featured: true,
    emoji: "👗",
  },
  {
    id: "pixelforge",
    name: "PixelForge",
    category: "Gaming",
    tagline: "Indie titles & in-game assets",
    rewardRate: 8,
    perks: ["8% back in SHRP", "Exclusive skins", "Beta invites"],
    accent: "primary",
    featured: true,
    emoji: "🎮",
  },
  {
    id: "lumina",
    name: "Lumina Electronics",
    category: "Electronics",
    tagline: "Premium audio & smart devices",
    rewardRate: 3,
    perks: ["3% back in SHRP", "Extended warranty", "Trade-in bonus"],
    accent: "balance",
    featured: true,
    emoji: "🎧",
  },
  {
    id: "skola",
    name: "Skola Academy",
    category: "Education",
    tagline: "Courses, certificates & bootcamps",
    rewardRate: 6,
    perks: ["6% back in SHRP", "Scholarship credits", "Mentor access"],
    accent: "reward",
    emoji: "📚",
  },
  {
    id: "wanderlux",
    name: "WanderLux Travel",
    category: "Travel",
    tagline: "Curated stays & experiences",
    rewardRate: 4,
    perks: ["4% back in SHRP", "Lounge access", "Late checkout"],
    accent: "balance",
    emoji: "✈️",
  },
  {
    id: "verdebean",
    name: "Verde Bean Co.",
    category: "Food & Drink",
    tagline: "Specialty coffee & roasters",
    rewardRate: 10,
    perks: ["10% back in SHRP", "Free refills", "Members menu"],
    accent: "reward",
    emoji: "☕",
  },
  {
    id: "auronaut",
    name: "Auronaut Fitness",
    category: "Wellness",
    tagline: "Smart gear & studio passes",
    rewardRate: 7,
    perks: ["7% back in SHRP", "Class credits", "Recovery perks"],
    accent: "primary",
    emoji: "🏋️",
  },
  {
    id: "novadecor",
    name: "Nova Decor",
    category: "Home",
    tagline: "Modern furniture & lighting",
    rewardRate: 5,
    perks: ["5% back in SHRP", "Design consult", "White-glove delivery"],
    accent: "shrp",
    emoji: "🛋️",
  },
];

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
  badge?: string;
};

export const products: Product[] = [
  { id: "p1", name: "Aurora Wool Coat", price: 248, category: "Outerwear", emoji: "🧥", badge: "New" },
  { id: "p2", name: "Cloudstep Sneakers", price: 129, category: "Footwear", emoji: "👟", badge: "Trending" },
  { id: "p3", name: "Linen Weekend Shirt", price: 78, category: "Tops", emoji: "👔" },
  { id: "p4", name: "Heritage Leather Bag", price: 312, category: "Accessories", emoji: "👜", badge: "Limited" },
  { id: "p5", name: "Solar Knit Sweater", price: 96, category: "Knitwear", emoji: "🧶" },
  { id: "p6", name: "Midnight Tailored Suit", price: 489, category: "Formal", emoji: "🕴️", badge: "Featured" },
];

export const SHRP_RATE = 5; // StyleStore: 5 SHRP per $1

export const heroStats = [
  { label: "Active Merchants", value: 1240, suffix: "+", accent: "primary" as const },
  { label: "SHRP Distributed", value: 18.4, suffix: "M", accent: "shrp" as const },
  { label: "Transactions", value: 6.2, suffix: "M", accent: "balance" as const },
  { label: "Active Members", value: 320, suffix: "K", accent: "reward" as const },
];

export const rewardGrowth = [
  { month: "Jan", issued: 820, redeemed: 410 },
  { month: "Feb", issued: 1120, redeemed: 560 },
  { month: "Mar", issued: 1480, redeemed: 760 },
  { month: "Apr", issued: 1390, redeemed: 880 },
  { month: "May", issued: 1980, redeemed: 1120 },
  { month: "Jun", issued: 2540, redeemed: 1490 },
  { month: "Jul", issued: 3120, redeemed: 1880 },
];

export const liveTransactions = [
  { id: "t1", user: "0x7a…3f2", action: "Earned", amount: 125, merchant: "StyleStore", time: "just now" },
  { id: "t2", user: "0x4c…9b1", action: "Redeemed", amount: 80, merchant: "PixelForge", time: "1m ago" },
  { id: "t3", user: "0x2e…7d4", action: "Earned", amount: 240, merchant: "Lumina", time: "3m ago" },
  { id: "t4", user: "0x9f…1a8", action: "Earned", amount: 60, merchant: "Verde Bean", time: "5m ago" },
  { id: "t5", user: "0x1b…6c3", action: "Redeemed", amount: 150, merchant: "WanderLux", time: "8m ago" },
];