import { Counter } from "./Counter";
import { ArrowUpRight, Sparkles, TrendingUp } from "lucide-react";

export function HeroMockup() {
  return (
    <div className="relative animate-float-soft">
      <div className="glass rounded-3xl p-5 shadow-elegant">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">SHRP Balance</p>
            <p className="font-display text-3xl font-bold text-foreground">
              <Counter value={12480} /> <span className="text-shrp">SHRP</span>
            </p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow animate-pulse-ring">
            <Sparkles className="size-5" />
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card/60 p-4">
            <p className="text-xs text-muted-foreground">Rewards earned</p>
            <p className="mt-1 flex items-center gap-1 font-display text-xl font-bold text-reward">
              +<Counter value={2340} />
              <TrendingUp className="size-4" />
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card/60 p-4">
            <p className="text-xs text-muted-foreground">Merchant activity</p>
            <p className="mt-1 font-display text-xl font-bold text-balance">
              <Counter value={86} suffix="%" />
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-border bg-card/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Analytics</p>
            <span className="text-xs text-reward">▲ 24.6%</span>
          </div>
          <div className="flex h-20 items-end gap-1.5">
            {[40, 55, 48, 70, 62, 85, 78, 96, 88, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-gradient-primary opacity-80"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-border bg-card/60 p-3 text-sm">
          <span className="flex items-center gap-2 text-foreground">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-shrp/15 text-shrp">👗</span>
            StyleStore
          </span>
          <span className="flex items-center gap-1 font-medium text-reward">
            +125 SHRP <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>

      {/* floating token chips */}
      <div className="absolute -left-6 top-10 hidden animate-float-soft rounded-2xl glass px-3 py-2 text-sm font-semibold shadow-elegant md:flex" style={{ animationDelay: "0.6s" }}>
        <span className="text-shrp">◈</span>&nbsp;+50 SHRP
      </div>
      <div className="absolute -right-4 bottom-16 hidden animate-float-soft rounded-2xl glass px-3 py-2 text-sm font-semibold shadow-elegant md:flex" style={{ animationDelay: "1.2s" }}>
        <span className="text-reward">●</span>&nbsp;Reward unlocked
      </div>
    </div>
  );
}