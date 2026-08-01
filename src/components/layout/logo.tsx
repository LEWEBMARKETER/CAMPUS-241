import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "text-xl font-extrabold tracking-tight text-brand-blue-dark",
        className,
      )}
    >
      CAMPUS <span className="text-brand-green">241</span>
    </Link>
  );
}
