"use client";

import { useEffect, useRef, useState } from "react";

type Kind = "arrow" | "pointer" | "text";

const GOLD = "#C9A96E";
const SHADOW = "drop-shadow(0 1px 1.5px rgba(0,0,0,0.35))";

// Text-entry fields → I-beam. Everything clickable → hand. Else → arrow.
const TEXT_SELECTOR =
  'input:not([type=button]):not([type=submit]):not([type=reset]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]):not([type=file]):not([disabled]), textarea:not([disabled]), [contenteditable="true"], [contenteditable=""]';
const POINTER_SELECTOR =
  'a[href], button:not([disabled]), [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="option"], select:not([disabled]), summary, label[for], [data-cursor-hover], input[type=checkbox]:not([disabled]), input[type=radio]:not([disabled]), input[type=submit]:not([disabled]), input[type=button]:not([disabled]), input[type=file]:not([disabled])';

function CursorShape({ kind }: { kind: Kind }) {
  if (kind === "pointer") {
    // Hand pointer — hotspot at the fingertip.
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 28 28"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", overflow: "visible", transform: "translate(-9px, -1.5px)", filter: SHADOW }}
      >
        <path
          d="M9 3a1.5 1.5 0 0 1 3 0V11l1-.4V7.7a1.45 1.45 0 0 1 2.9 0v3.4l1-.3V9.3a1.45 1.45 0 0 1 2.9 0v1.5l1-.15a1.4 1.4 0 0 1 1.6 1.4v4.8a7 7 0 0 1-7 7h-1.7a5 5 0 0 1-4-2L6.6 17.4a1.6 1.6 0 0 1 2.5-1.95L9 15.8z"
          fill={GOLD}
          stroke="#000"
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (kind === "text") {
    // I-beam — hotspot at the centre.
    return (
      <svg
        width="12"
        height="24"
        viewBox="0 0 12 24"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", overflow: "visible", transform: "translate(-6px, -12px)", filter: SHADOW }}
      >
        <path
          d="M3.5 2.5 H8.5 V4 H6.75 V20 H8.5 V21.5 H3.5 V20 H5.25 V4 H3.5 Z"
          fill={GOLD}
          stroke="#000"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  // Arrow — hotspot at the tip (SVG origin).
  return (
    <svg
      width="20"
      height="26"
      viewBox="0 0 20 26"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", overflow: "visible", filter: SHADOW }}
    >
      <path
        d="M0 0 L0 20 L5 15.2 L8.1 22.2 L11.1 20.9 L8.2 14.1 L14.9 14.1 Z"
        fill={GOLD}
        stroke="#000"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [kind, setKind] = useState<Kind>("arrow");

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

      const el = e.target as HTMLElement | null;
      let next: Kind = "arrow";
      if (el?.closest(TEXT_SELECTOR)) next = "text";
      else if (el?.closest(POINTER_SELECTOR)) next = "pointer";
      setKind(next);
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
      <CursorShape kind={kind} />
    </div>
  );
}
