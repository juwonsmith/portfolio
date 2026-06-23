"use client";

import { useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*<>/";

type Props = {
  text: string;
  className?: string;
  /** ms to keep fully scrambling before the decode starts */
  delay?: number;
  /** characters revealed per frame — smaller = slower, more dramatic decode */
  revealSpeed?: number;
};

// Materializes the text out of random characters. Runs on every viewport
// (no pointer/hover gating), so it works on mobile too.
export default function Scramble({
  text,
  className,
  delay = 200,
  revealSpeed = 1 / 3,
}: Props) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let raf = 0;
    let frame = 0;
    let revealed = 0;
    let t0: number | null = null;

    const tick = (ts: number) => {
      if (t0 === null) t0 = ts;
      const elapsed = ts - t0;
      if (elapsed >= delay) revealed += revealSpeed;

      const out = text
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < Math.floor(revealed)) return text[i];
          return CHARS[(frame + i * 7) % CHARS.length];
        })
        .join("");
      setDisplay(out);
      frame++;

      if (Math.floor(revealed) < text.length) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, revealSpeed]);

  return <span className={className}>{display}</span>;
}
