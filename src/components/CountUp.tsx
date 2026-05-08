"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Props {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export default function CountUp({ to, duration = 1.8, suffix = "", prefix = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = (now - startTime) / (duration * 1000);
      const eased = 1 - Math.pow(1 - Math.min(elapsed, 1), 3);
      const current = Math.round(eased * to);
      setCount(current);
      if (elapsed < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, to, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}
