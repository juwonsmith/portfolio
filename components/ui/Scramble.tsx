"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*<>/";

type Props = {
  text: string;
  className?: string;
};

// Decodes the text from random characters on mount. Lightweight, no plugin.
export default function Scramble({ text, className }: Props) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);

  useEffect(() => {
    let raf = 0;
    let iteration = 0;
    const step = () => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iteration) return text[i];
            return CHARS[Math.floor((frame.current + i * 7) % CHARS.length)];
          })
          .join("")
      );
      frame.current += 1;
      iteration += 1 / 3;
      if (iteration < text.length) {
        raf = requestAnimationFrame(step);
      } else {
        setDisplay(text);
      }
    };
    // small delay so it plays after the preloader
    const timer = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, 200);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [text]);

  return <span className={className}>{display}</span>;
}
