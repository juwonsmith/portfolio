"use client";

import { useEffect, useRef, useState } from "react";
import { scrollState } from "@/lib/scrollStore";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*<>/";

type Props = {
  text: string;
  className?: string;
  /** ms of full scramble before the decode starts */
  delay?: number;
  /** characters revealed per frame — smaller = slower, more dramatic */
  revealSpeed?: number;
  /** re-run the decode on hover (a small Easter egg) */
  hoverReplay?: boolean;
};

export default function Scramble({
  text,
  className,
  delay = 200,
  revealSpeed = 1 / 3,
  hoverReplay = false,
}: Props) {
  const [display, setDisplay] = useState(text);
  const spanRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    // reduced motion: no character churn, show the final text
    if (scrollState.reducedMotion) {
      setDisplay(text);
      return;
    }

    const run = () => {
      cancelAnimationFrame(rafRef.current);
      let frame = 0;
      let revealed = 0;
      let t0: number | null = null;
      const tick = (ts: number) => {
        if (t0 === null) t0 = ts;
        if (ts - t0 >= delay) revealed += revealSpeed;
        setDisplay(
          text
            .split("")
            .map((ch, i) => {
              if (ch === " ") return " ";
              if (i < Math.floor(revealed)) return text[i];
              return CHARS[(frame + i * 7) % CHARS.length];
            })
            .join("")
        );
        frame++;
        if (Math.floor(revealed) < text.length) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplay(text);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    run();

    let el: HTMLSpanElement | null = null;
    const onEnter = () => run();
    if (hoverReplay && spanRef.current) {
      el = spanRef.current;
      el.addEventListener("mouseenter", onEnter);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (el) el.removeEventListener("mouseenter", onEnter);
    };
  }, [text, delay, revealSpeed, hoverReplay]);

  return (
    <span ref={spanRef} className={className}>
      {display}
    </span>
  );
}
