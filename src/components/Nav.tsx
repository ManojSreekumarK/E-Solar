"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "calculator", label: "Calculator" },
  { id: "process", label: "Process" },
];

export default function Nav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  function handleClick(id: string) {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  // The pill is ~470px of labels, wider than any phone, so it was being
  // clipped at both ends. Cap it to the viewport and let it scroll.
  return (
    <nav className="fixed top-5 left-1/2 z-50 max-w-[calc(100vw-1rem)] -translate-x-1/2 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ul className="flex w-max items-center gap-0.5 rounded-full bg-black/95 p-1.5 text-[11px] font-medium shadow-lg shadow-black/20 backdrop-blur sm:gap-1 sm:text-[13px]">
        {LINKS.map((link) => (
          <li key={link.id} className="relative">
            <button
              onClick={() => handleClick(link.id)}
              className={`relative z-10 block rounded-full px-2 py-2 whitespace-nowrap transition-colors sm:px-4 ${
                active === link.id
                  ? "text-black"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </button>
            {active === link.id && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 rounded-full bg-white"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
