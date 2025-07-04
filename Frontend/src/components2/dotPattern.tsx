"use client";

import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";

export function DotPatternDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-[#161616]">
      <div
        className="absolute top-0 left-0 w-full h-[2px] z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, #232325 40%, #232325 60%, transparent 100%)",
          opacity: 0.7,
        }}
      />
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent_90%)]"
        )}
      />
    </div>
  );
}
