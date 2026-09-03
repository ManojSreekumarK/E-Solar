"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Masked word-by-word reveal. Words are individually clipped and slid up,
 * so the text still wraps naturally at any viewport width — no hardcoded
 * line breaks to hand-tune per breakpoint.
 */
export default function TextReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.025,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
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
      { rootMargin: "-80px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          {/* pb/-mb pair keeps descenders (g, y, p) from being clipped */}
          <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <span
              className="inline-block transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: inView ? "translateY(0%)" : "translateY(110%)",
                opacity: inView ? 1 : 0,
                transitionDelay: `${delay + i * stagger}s`,
              }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
