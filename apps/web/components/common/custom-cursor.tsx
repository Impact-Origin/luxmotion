"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      const node = ref.current;
      if (node) {
        node.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 120ms ease-out", willChange: "transform" }}
    >
      {/* Standard arrow pointer — white fill, thin black outline (the default Windows cursor look).
          Tip sits at the SVG origin (0,0) so it lines up with the real pointer hotspot. */}
      <svg
        width="20"
        height="26"
        viewBox="0 0 20 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", overflow: "visible", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.3))" }}
      >
        <path
          d="M0 0 L0 20 L5 15.2 L8.1 22.2 L11.1 20.9 L8.2 14.1 L14.9 14.1 Z"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
