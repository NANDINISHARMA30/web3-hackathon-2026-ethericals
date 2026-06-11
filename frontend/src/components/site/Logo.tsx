import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5 font-display", className)}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 14L12 3l7 11-7 7-7-7z" fill="currentColor" opacity="0.95" />
          <path d="M12 3v18" stroke="white" strokeWidth="1.2" opacity="0.5" />
        </svg>
      </span>
      <span className="text-lg font-bold tracking-tight text-foreground">SharpKit</span>
    </span>
  );
}