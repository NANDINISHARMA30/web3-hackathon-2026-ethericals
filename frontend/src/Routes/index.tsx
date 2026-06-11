import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Coins,
  Gift,
  LayoutDashboard,
  Network,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";
import { HeroMockup } from "@/components/site/HeroMockup";
import { heroStats } from "@/lib/sharpkit-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SharpKit — Turn Every Customer Into a Loyal Community" },
      {
        name: "description",
        content:
          "SharpKit enables merchants to launch blockchain-powered loyalty programs in minutes. Issue, redeem, and track SHRP rewards across a shared merchant network.",
      },
      { property: "og:title", content: "SharpKit — Web3 Loyalty Infrastructure" },
      {
        property: "og:description",
        content: "Launch blockchain-powered loyalty programs in minutes with SHRP tokens.",
      },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Coins, title: "Earn", desc: "Customers earn SHRP automatically on every qualifying purchase.", accent: "shrp", span: "md:col-span-2" },
  { icon: Gift, title: "Redeem", desc: "Spend rewards anywhere across the network.", accent: "reward", span: "" },
  { icon: Network, title: "Cross-Merchant Network", desc: "One token, one ecosystem — shared across every participating merchant.", accent: "primary", span: "md:row-span-2" },
  { icon: BarChart3, title: "Analytics", desc: "Track loyalty performance in real time.", accent: "balance", span: "" },
  { icon: Wallet, title: "Wallet Integration", desc: "Blockchain-powered ownership your customers actually keep.", accent: "shrp", span: "" },
  { icon: LayoutDashboard, title: "Merchant Portal", desc: "Issue rewards, launch campaigns, and manage programs instantly.", accent: "primary", span: "md:col-span-2" },
] as const;

const accentClass: Record<string, string> = {
  shrp: "bg-shrp/12 text-shrp",
  reward: "bg-reward/12 text-reward",
  primary: "bg-primary/12 text-primary",
  balance: "bg-balance/12 text-balance",
};

const steps = [
  { n: "01", title: "Merchant joins SharpKit", desc: "Connect your store and configure a reward program — no blockchain expertise required." },
  { n: "02", title: "Launch a loyalty program", desc: "Set reward rates, perks, and campaigns from the merchant portal in minutes." },
  { n: "03", title: "Customers earn SHRP", desc: "Shoppers automatically earn tokens on every purchase, with delightful reward moments." },
  { n: "04", title: "Redeem across merchants", desc: "Members spend SHRP anywhere in the network, driving cross-merchant discovery." },
  { n: "05", title: "Merchants grow retention", desc: "Recurring engagement and loyalty loops compound into recurring revenue." },
] as const;

const trustLogos = ["Fashion", "Gaming", "Education", "Electronics", "Travel", "Wellness"];

function Index() {
  return (
    <div className="overflow-clip">
      {/* HERO */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 bg-hero" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-primary/25 blur-3xl animate-float-orb" aria-hidden="true" />
        <div className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-accent/25 blur-3xl animate-float-orb" style={{ animationDelay: "3s" }} aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-32 md:pt-40 lg:grid-cols-2">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium text-foreground">
              <span className="h-2 w-2 rounded-full bg-reward" /> Web3 loyalty infrastructure
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
              Turn Every Customer Into a{" "}
              <span className="text-gradient">Loyal Community</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              SharpKit enables merchants to launch blockchain-powered loyalty
              programs in minutes — issue, redeem, and track SHRP rewards across a
              shared merchant network.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl" className="btn-shine">
                <Link to="/dashboard">
                  Start Building <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button asChild variant="glass" size="xl">
                <Link to="/marketplace">Explore Marketplace</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              No setup fees · Live in minutes · Shopify + Stripe for Web3 loyalty
            </p>
          </Reveal>

          <Reveal delay={150}>
            <HeroMockup />
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="glass grid grid-cols-2 gap-6 rounded-3xl p-8 shadow-elegant lg:grid-cols-4">
          {heroStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80} className="text-center">
              <p className={`font-display text-4xl font-extrabold text-${stat.accent}`}>
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.value % 1 !== 0 ? 1 : 0}
                />
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-7xl px-4 py-12 text-center">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Trusted by growing digital businesses
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {trustLogos.map((logo) => (
              <span
                key={logo}
                className="font-display text-xl font-bold text-muted-foreground/70 transition-colors hover:text-foreground"
              >
                {logo}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* FEATURES BENTO */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need to run loyalty on-chain
          </h2>
          <p className="mt-4 text-muted-foreground">
            A complete toolkit for issuing, redeeming, and analyzing rewards — without
            asking customers to understand blockchain.
          </p>
        </Reveal>

        <div className="mt-12 grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-5 md:grid-cols-3">
          {features.map((f, i) => (
            <Reveal
              key={f.title}
              delay={i * 70}
              as="article"
              className={`group card-lift relative overflow-hidden rounded-3xl border border-border bg-card p-6 ${f.span}`}
            >
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${accentClass[f.accent]}`}>
                <f.icon className="size-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-primary opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative mx-auto max-w-7xl px-4 py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            How the SharpKit loyalty loop works
          </h2>
          <p className="mt-4 text-muted-foreground">
            One ecosystem that turns first-time buyers into repeat members.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-5">
          {steps.map((s, i) => (
            <Reveal
              key={s.n}
              delay={i * 80}
              className="card-lift rounded-3xl border border-border bg-card p-6"
            >
              <span className="font-display text-3xl font-extrabold text-gradient">{s.n}</span>
              <h3 className="mt-3 font-display text-base font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-vivid p-10 text-center shadow-glow sm:p-16">
          <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
          <h2 className="relative font-display text-3xl font-extrabold text-primary-foreground sm:text-4xl">
            Launch your Web3 loyalty program today
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-primary-foreground/85">
            Join 1,200+ merchants building retention loops with SHRP. Live in minutes,
            no blockchain expertise required.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="xl" variant="glass" className="btn-shine">
              <Link to="/dashboard">
                Start Building <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="glass">
              <Link to="/store">Try the Demo Store</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
