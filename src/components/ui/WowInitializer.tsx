"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const WowInitializer = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const animatedElements = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add("animated");

            const duration = el.getAttribute("data-wow-duration");
            const delay = el.getAttribute("data-wow-delay");

            if (duration) el.style.animationDuration = duration;
            if (delay) el.style.animationDelay = delay;

            observer.unobserve(el);
            animatedElements.add(el);
          }
        });
      },
      {
        threshold: 0.05, // trigger when 5% of the element is visible
        rootMargin: "0px 0px -20px 0px", // trigger slightly before it enters viewport
      }
    );

    const observeWowElements = () => {
      const wowElements = document.querySelectorAll(".wow");
      wowElements.forEach((el) => {
        if (!el.classList.contains("animated") && !animatedElements.has(el)) {
          observer.observe(el);
        }
      });
    };

    // Run initially
    observeWowElements();

    // Set up a MutationObserver to watch for dynamically added elements (like on client navigation or hydration)
    const mutationObserver = new MutationObserver(() => {
      observeWowElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Run small timeouts to catch deferred rendering
    const timer1 = setTimeout(observeWowElements, 100);
    const timer2 = setTimeout(observeWowElements, 500);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname]);

  return null;
};
