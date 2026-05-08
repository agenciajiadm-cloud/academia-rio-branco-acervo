"use client";

import { motion } from "framer-motion";

const EASE = [0.65, 0.05, 0, 1] as const;

interface Props {
  children: string;
  className?: string;
  delay?: number;
  by?: "word" | "line";
}

export default function RevealText({ children, className = "", delay = 0, by = "word" }: Props) {
  const words = children.split(" ");

  return (
    <motion.span
      className={`inline ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden" style={{ marginRight: "0.28em" }}>
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "105%", opacity: 0 },
              visible: { y: "0%", opacity: 1, transition: { duration: 0.75, ease: EASE } },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
