import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, ShoppingBag, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";
import { products, SHRP_RATE, type Product } from "@/lib/sharpkit-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "StyleStore — Earn SHRP on Every Purchase" },
      {
        name: "description",
        content:
          "Shop the StyleStore demo and earn SHRP rewards instantly. A live example of a SharpKit-powered Web3 loyalty storefront.",
      },
      { property: "og:title", content: "StyleStore — Powered by SharpKit" },
      { property: "og:description", content: "Earn SHRP rewards on every purchase." },
    ],
  }),
  component: Store,
});

type Burst = { id: number; x: number; y: number };

function Store() {
  const [balance, setBalance] = useState(840);
  const [cart, setCart] = useState(0);
  const [bursts, setBursts] = useState<Burst[]>([]);

  const addToCart = (product: Product, e: React.MouseEvent) => {
    const earned = Math.round(product.price * SHRP_RATE);
    setBalance((b) => b + earned);
    setCart((c) => c + 1);

    const id = Date.now() + Math.random();
    setBursts((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 1200);

    toast.custom(() => (
      <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-glow">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </span>
        <div>
          <p className="font-display text-sm font-bold text-reward">+{earned} SHRP Earned</p>
          <p className="text-xs text-muted-foreground">Added {product.name} to cart</p>
        </div>
      </div>
    ));
  };

  return (
    <div className="overflow-clip">
      {/* flying particles */}
      {bursts.map((b) => (
        <ParticleBurst key={b.id} x={b.x} y={b.y} />
      ))}

      {/* HERO */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 bg-hero" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-10 pt-32 md:pt-40 lg:grid-cols-2">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium text-foreground">
              <span className="text-lg">👗</span> StyleStore · Powered by SharpKit
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">
              Designer style, <span className="text-gradient">on-chain rewards</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Every purchase earns {SHRP_RATE} SHRP per dollar — redeemable across the
              entire SharpKit network. Try adding items to see rewards in action.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <RewardsDashboard balance={balance} cart={cart} />
          </Reveal>
        </div>
      </section>

      {/* SHRP benefits */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Sparkles, t: `${SHRP_RATE}% back in SHRP`, d: "On every order, automatically." },
            { icon: Star, t: "Early access drops", d: "Members shop limited releases first." },
            { icon: ShoppingBag, t: "Network redemption", d: "Spend rewards at any merchant." },
          ].map((b, i) => (
            <Reveal key={b.t} delay={i * 80} className="card-lift rounded-3xl border border-border bg-card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-shrp/12 text-shrp">
                <b.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-foreground">{b.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Featured collection</h2>
            <p className="mt-2 text-muted-foreground">Trending pieces this season.</p>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 80}>
              <ProductCard product={p} onAdd={addToCart} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

function RewardsDashboard({ balance, cart }: { balance: number; cart: number }) {
  return (
    <div className="glass animate-float-soft rounded-3xl p-6 shadow-elegant">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Your SHRP balance</p>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
          <Sparkles className="size-5" />
        </span>
      </div>
      <p className="mt-2 font-display text-4xl font-extrabold text-foreground">
        <Counter value={balance} key={balance} duration={700} /> <span className="text-shrp">SHRP</span>
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card/60 p-4">
          <p className="text-xs text-muted-foreground">In cart</p>
          <p className="font-display text-2xl font-bold text-balance">{cart}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-4">
          <p className="text-xs text-muted-foreground">Reward rate</p>
          <p className="font-display text-2xl font-bold text-reward">{SHRP_RATE}%</p>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product: p,
  onAdd,
}: {
  product: Product;
  onAdd: (p: Product, e: React.MouseEvent) => void;
}) {
  const earned = Math.round(p.price * SHRP_RATE);
  return (
    <article className="card-lift group overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-gradient-to-br from-secondary to-muted">
        <span className="text-7xl transition-transform duration-500 group-hover:scale-110">{p.emoji}</span>
        {p.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-card/80 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
            {p.badge}
          </span>
        )}
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-shrp px-2.5 py-1 text-xs font-semibold text-shrp-foreground shadow-glow">
          <Sparkles className="size-3" /> +{earned}
        </span>
      </div>
      <div className="p-5">
        <p className="text-xs text-muted-foreground">{p.category}</p>
        <h3 className="mt-1 font-display text-lg font-bold text-foreground">{p.name}</h3>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-xl font-bold text-foreground">${p.price}</span>
          <Button
            variant="hero"
            className="btn-shine"
            onClick={(e) => onAdd(p, e)}
            aria-label={`Add ${p.name} to cart`}
          >
            <Plus className="size-4" /> Add
          </Button>
        </div>
      </div>
    </article>
  );
}

function ParticleBurst({ x, y }: { x: number; y: number }) {
  const particles = Array.from({ length: 10 });
  return (
    <div className="pointer-events-none fixed z-[100]" style={{ left: x, top: y }} aria-hidden="true">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const dist = 60 + Math.random() * 60;
        return (
          <span
            key={i}
            className={cn(
              "absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xs font-bold",
              i % 2 === 0 ? "bg-shrp text-shrp-foreground" : "bg-reward text-reward-foreground",
            )}
            style={
              {
                ["--dx" as string]: `${Math.cos(angle) * dist}px`,
                ["--dy" as string]: `${Math.sin(angle) * dist - 80}px`,
                animation: "shrp-fly 1.1s cubic-bezier(0.2,0.7,0.3,1) forwards",
              } as React.CSSProperties
            }
          >
            ◈
          </span>
        );
      })}
    </div>
  );
}