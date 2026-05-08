"use client";

import { motion } from "framer-motion";

interface Props {
  items: string[];
  speed?: number;
  className?: string;
  reverse?: boolean;
}

export default function Marquee({ items, speed = 35, className = "", reverse = false }: Props) {
  const doubled = [...items, ...items];

  return (
    <div className={`overflow-hidden whitespace-nowrap select-none ${className}`}>
      <motion.div
        className="inline-flex items-center gap-0"
        animate={{ x: reverse ? ["−50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        style={{ willChange: "transform" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-8 px-8 text-sm font-bold uppercase tracking-widest">
            <span>{item}</span>
            <span className="text-accent opacity-60">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
