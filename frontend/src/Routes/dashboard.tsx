import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Gift,
  Megaphone,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";
import { liveTransactions, rewardGrowth } from "@/lib/sharpkit-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Merchant Dashboard — SharpKit" },
      {
        name: "description",
        content:
          "Track SHRP balances, rewards issued, active users, and live transactions. Issue rewards and launch campaigns from the SharpKit merchant dashboard.",
      },
      { property: "og:title", content: "SharpKit Merchant Dashboard" },
      { property: "og:description", content: "Manage your Web3 loyalty program in real time." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Wallet Balance", value: 248320, suffix: " SHRP", icon: Wallet, accent: "primary", delta: "+12.4%" },
  { label: "Rewards Issued", value: 18640, suffix: "", icon: Gift, accent: "shrp", delta: "+8.1%" },
  { label: "Active Users", value: 9420, suffix: "", icon: Users, accent: "balance", delta: "+5.7%" },
  { label: "Transactions", value: 31280, suffix: "", icon: Activity, accent: "reward", delta: "+18.2%" },
] as const;

const accentBg: Record<string, string> = {
  primary: "bg-primary/12 text-primary",
  shrp: "bg-shrp/12 text-shrp",
  balance: "bg-balance/12 text-balance",
  reward: "bg-reward/12 text-reward",
};

const actions = [
  { label: "Issue Rewards", icon: Gift, msg: "Reward issuance flow opened." },
  { label: "Create Campaign", icon: Megaphone, msg: "New campaign draft created." },
  { label: "View Analytics", icon: BarChart3, msg: "Loading full analytics report…" },
] as const;

function Dashboard() {
  return (
    <div className="overflow-clip">
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 bg-hero" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-32 md:pt-40">
          <Reveal className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Welcome back</p>
              <h1 className="truncate font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                Merchant Dashboard
              </h1>
            </div>
            <Button variant="hero" className="btn-shine shrink-0" onClick={() => toast.success("Reward issuance flow opened.")}>
              <Gift className="size-4" /> Issue Rewards
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Stat cards */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 70} className="card-lift rounded-3xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className={cn("grid h-11 w-11 place-items-center rounded-2xl", accentBg[s.accent])}>
                  <s.icon className="size-5" />
                </span>
                <span className="rounded-full bg-reward/12 px-2 py-0.5 text-xs font-semibold text-reward">
                  {s.delta}
                </span>
              </div>
              <p className="mt-4 font-display text-3xl font-extrabold text-foreground">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Charts */}
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-8 lg:grid-cols-2">
        <Reveal className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold text-foreground">Reward growth</h2>
          <p className="mb-4 text-sm text-muted-foreground">SHRP issued vs redeemed</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rewardGrowth} margin={{ left: -16, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="issued" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="redeemed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--popover-foreground)",
                  }}
                />
                <Area type="monotone" dataKey="issued" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#issued)" />
                <Area type="monotone" dataKey="redeemed" stroke="var(--chart-4)" strokeWidth={2.5} fill="url(#redeemed)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        <Reveal delay={100} className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold text-foreground">Engagement trend</h2>
          <p className="mb-4 text-sm text-muted-foreground">Active members per month</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rewardGrowth} margin={{ left: -16, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--popover-foreground)",
                  }}
                />
                <Line type="monotone" dataKey="issued" stroke="var(--chart-2)" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="redeemed" stroke="var(--chart-3)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Reveal>
      </section>

      {/* Live feed + quick actions */}
      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-8 lg:grid-cols-3">
        <Reveal className="rounded-3xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-reward" />
            <h2 className="font-display text-lg font-bold text-foreground">Live transactions</h2>
          </div>
          <ul className="divide-y divide-border">
            {liveTransactions.map((t) => {
              const earned = t.action === "Earned";
              return (
                <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                        earned ? "bg-reward/12 text-reward" : "bg-balance/12 text-balance",
                      )}
                    >
                      {earned ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {t.action} at {t.merchant}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{t.user} · {t.time}</p>
                    </div>
                  </div>
                  <span className={cn("shrink-0 font-display font-bold", earned ? "text-reward" : "text-balance")}>
                    {earned ? "+" : "-"}{t.amount} SHRP
                  </span>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={100} className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold text-foreground">Quick actions</h2>
          <div className="mt-4 space-y-3">
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={() => toast.success(a.msg)}
                className="card-lift flex w-full items-center gap-3 rounded-2xl border border-border bg-secondary/40 p-4 text-left"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                  <a.icon className="size-5" />
                </span>
                <span className="font-medium text-foreground">{a.label}</span>
                <ArrowUpRight className="ml-auto size-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}