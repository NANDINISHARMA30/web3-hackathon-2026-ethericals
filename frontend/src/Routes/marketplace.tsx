import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/site/Reveal";
import { merchants, type Merchant } from "@/lib/sharpkit-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — Discover SharpKit Merchants" },
      {
        name: "description",
        content:
          "Browse merchants in the SharpKit network. Earn and redeem SHRP rewards across fashion, gaming, travel, electronics, and more.",
      },
      { property: "og:title", content: "SharpKit Marketplace" },
      { property: "og:description", content: "Discover merchants and earn SHRP rewards everywhere." },
    ],
  }),
  component: Marketplace,
});

const accentText: Record<Merchant["accent"], string> = {
  primary: "text-primary",
  shrp: "text-shrp",
  balance: "text-balance",
  reward: "text-reward",
};
const accentBg: Record<Merchant["accent"], string> = {
  primary: "bg-primary/12 text-primary",
  shrp: "bg-shrp/12 text-shrp",
  balance: "bg-balance/12 text-balance",
  reward: "bg-reward/12 text-reward",
};

function Marketplace() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(merchants.map((m) => m.category)))],
    [],
  );

  const filtered = useMemo(
    () =>
      merchants.filter((m) => {
        const matchesQuery =
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.tagline.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category === "All" || m.category === category;
        return matchesQuery && matchesCategory;
      }),
    [query, category],
  );

  const featured = merchants.filter((m) => m.featured);

  return (
    <div className="overflow-clip">
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 bg-hero" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-32 text-center md:pt-40">
          <Reveal>
            <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">
              The SharpKit <span className="text-gradient">Marketplace</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              One token, every store. Earn and redeem SHRP rewards across the entire
              merchant network.
            </p>
          </Reveal>

          <Reveal delay={120} className="mx-auto mt-8 flex max-w-xl items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search merchants…"
                className="h-12 rounded-xl pl-11"
                aria-label="Search merchants"
              />
            </div>
          </Reveal>

          <Reveal delay={180} className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border border-border px-4 py-2 text-sm font-medium transition-all",
                  category === c
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <Star className="size-5 text-shrp" /> Featured merchants
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((m, i) => (
            <Reveal key={m.id} delay={i * 80}>
              <FeaturedCard merchant={m} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* All merchants */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="mb-6 font-display text-xl font-bold text-foreground">
          All merchants <span className="text-muted-foreground">({filtered.length})</span>
        </h2>
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            No merchants match your search.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((m, i) => (
              <Reveal key={m.id} delay={(i % 4) * 70}>
                <MerchantCard merchant={m} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FeaturedCard({ merchant: m }: { merchant: Merchant }) {
  return (
    <article className="card-lift group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-6">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-1 bg-gradient-vivid opacity-70" />
      <div className="flex items-center justify-between">
        <span className={cn("grid h-14 w-14 place-items-center rounded-2xl text-2xl", accentBg[m.accent])}>
          {m.emoji}
        </span>
        <span className="rounded-full bg-shrp/12 px-3 py-1 text-xs font-semibold text-shrp">
          {m.rewardRate} SHRP / $1
        </span>
      </div>
      <h3 className="mt-4 font-display text-xl font-bold text-foreground">{m.name}</h3>
      <p className="text-sm text-muted-foreground">{m.category}</p>
      <p className="mt-2 text-sm text-muted-foreground">{m.tagline}</p>
      <ul className="mt-4 space-y-1.5 text-sm">
        {m.perks.map((p) => (
          <li key={p} className="flex items-center gap-2 text-foreground">
            <span className={cn("h-1.5 w-1.5 rounded-full", accentText[m.accent])} style={{ backgroundColor: "currentColor" }} />
            {p}
          </li>
        ))}
      </ul>
      <Button asChild variant="hero" className="mt-5 w-full btn-shine">
        <Link to="/store">Visit store <ArrowUpRight className="size-4" /></Link>
      </Button>
    </article>
  );
}

function MerchantCard({ merchant: m }: { merchant: Merchant }) {
  return (
    <article className="card-lift group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <span className={cn("grid h-12 w-12 place-items-center rounded-2xl text-xl", accentBg[m.accent])}>
          {m.emoji}
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-bold text-foreground">{m.name}</h3>
          <p className="text-xs text-muted-foreground">{m.category}</p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{m.tagline}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-full bg-reward/12 px-2.5 py-1 text-xs font-semibold text-reward">
          {m.rewardRate}% back
        </span>
        <Link
          to="/store"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:opacity-80"
        >
          Visit <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}