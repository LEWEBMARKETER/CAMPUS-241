import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("block shrink-0", className)}>
      <Image
        src="/brand/campus241-wordmark.png"
        alt="CAMPUS 241"
        width={1627}
        height={330}
        priority
        className="h-8 w-auto sm:h-9"
      />
    </Link>
  );
}
