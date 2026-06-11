import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const groups = [
  {
    title: "Product",
    links: [
      { to: "/marketplace", label: "Marketplace" },
      { to: "/store", label: "Demo Store" },
      { to: "/dashboard", label: "Merchant Dashboard" },
    ],
  },
  {
    title: "Platform",
    links: [
      { to: "/", label: "SHRP Token" },
      { to: "/", label: "Rewards Engine" },
      { to: "/", label: "Wallet" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/", label: "About" },
      { to: "/", label: "Careers" },
      { to: "/", label: "Contact" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border">
      <div className="pointer-events-none absolute inset-0 bg-hero opacity-60" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground">
            Plug-and-play Web3 loyalty infrastructure. Issue, manage, and redeem
            SHRP rewards across a shared merchant network.
          </p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
            <ul className="mt-4 space-y-3">
              {group.links.map((link, i) => (
                <li key={`${group.title}-${i}`}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-border px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} SharpKit Labs. All rights reserved.</p>
        <p>Built for the Web3 loyalty economy.</p>
      </div>
    </footer>
  );
}