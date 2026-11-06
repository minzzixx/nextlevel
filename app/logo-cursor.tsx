"use client";

import { useEffect } from "react";

export function LogoCursor() {
  useEffect(() => {
    const motionAllowed = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const sparks = new Map<HTMLElement, number>();

    function sparkle(event: MouseEvent) {
      if (!motionAllowed.matches || event.detail === 0) return;

      const spark = document.createElement("span");
      spark.className = "cursor-spark";
      spark.setAttribute("aria-hidden", "true");
      spark.textContent = "✦";
      spark.style.left = `${event.clientX}px`;
      spark.style.top = `${event.clientY}px`;

      const dialog = event.target instanceof Element ? event.target.closest("dialog[open]") : null;
      (dialog ?? document.body).append(spark);
      const timer = window.setTimeout(() => {
        sparks.delete(spark);
        spark.remove();
      }, 500);
      sparks.set(spark, timer);
    }

    window.addEventListener("click", sparkle, true);
    return () => {
      window.removeEventListener("click", sparkle, true);
      sparks.forEach((timer, spark) => {
        window.clearTimeout(timer);
        spark.remove();
      });
    };
  }, []);

  return null;
}
