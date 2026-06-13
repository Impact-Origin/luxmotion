"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, summary, label, [data-cursor-hover]';

export function CustomCursor() {
  const arrowRef = useRef<HTMLDivElement>(null);
  const arrowInnerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);

    const target = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let arrowScale = 1;
    let ringScale = 0;
    let hovering = false;
    let pressed = false;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const node = arrowRef.current;
      if (node) {
        node.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        if (!visible) {
          visible = true;
          node.style.opacity = "1";
        }
      }
      const el = e.target as HTMLElement | null;
      hovering = !!el?.closest(INTERACTIVE_SELECTOR);
    };
    const onLeave = () => {
      visible = false;
      if (arrowRef.current) arrowRef.current.style.opacity = "0";
    };
    const onEnter = () => {
      visible = true;
      if (arrowRef.current) arrowRef.current.style.opacity = "1";
    };
    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    let raf = 0;
    const tick = () => {
      // ring trails the pointer with easing
      ring.x += (target.x - ring.x) * 0.2;
      ring.y += (target.y - ring.y) * 0.2;
      // ring blooms in over interactive elements, the arrow grows; both shrink on press
      ringScale += ((hovering && visible ? 1 : 0) - ringScale) * 0.22;
      arrowScale += ((pressed ? 0.85 : hovering ? 1.18 : 1) - arrowScale) * 0.25;

      const ringNode = ringRef.current;
      if (ringNode) {
        ringNode.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
        ringNode.style.opacity = `${ringScale * (pressed ? 0.45 : 0.85)}`;
      }
      if (arrowInnerRef.current) {
        arrowInnerRef.current.style.transform = `scale(${arrowScale})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Hover ring — eases in around the pointer over interactive elements. */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
        style={{
          width: 46,
          height: 46,
          borderRadius: "9999px",
          border: "1.5px solid #C9A96E",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />
      {/* Classic Windows-style arrow pointer: gold fill, black outline.
          The tip sits at the SVG origin (0,0) so it lines up with the real pointer hotspot. */}
      <div
        ref={arrowRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ opacity: 0, willChange: "transform" }}
      >
        <div ref={arrowInnerRef} style={{ transformOrigin: "0 0" }}>
          <svg
            width="20"
            height="26"
            viewBox="0 0 20 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              display: "block",
              overflow: "visible",
              filter: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.35))",
            }}
          >
            <path
              d="M0 0 L0 20 L5 15.2 L8.1 22.2 L11.1 20.9 L8.2 14.1 L14.9 14.1 Z"
              fill="#C9A96E"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
