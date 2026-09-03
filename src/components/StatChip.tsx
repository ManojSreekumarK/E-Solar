"use client";

import { useEffect, useRef, useState } from "react";

function DotCluster() {
  const dots = [
    [0, -6],
    [-6, -2],
    [6, -2],
    [-4, 4],
    [4, 4],
    [0, 0],
  ];
  return (
    <svg viewBox="-10 -10 20 20" className="h-6 w-6">
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.6" fill="#0b2a10" />
      ))}
    </svg>
  );
}

const TONE = {
  // label colour for a light background
  onLight: "text-black/60",
  // label colour for a dark/video background
  onDark: "text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]",
};

export default function StatChip({
  lines,
  className = "",
  delay = 0,
  tone = "onLight",
}: {
  lines: string[];
  className?: string;
  delay?: number;
  tone?: keyof typeof TONE;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-60px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex items-center gap-4 transition-all duration-500 ease-out ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? "translateY(0) scale(1)"
          : "translateY(14px) scale(0.9)",
        transitionDelay: `${delay}s`,
      }}
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-lime-300">
        <DotCluster />
      </span>
      <div
        className={`font-mono text-sm leading-snug tracking-wide uppercase ${TONE[tone]}`}
      >
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}
