"use client";

import { useEffect } from "react";

export const WowInitializer = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Get all elements with class 'wow'
    const wowElements = document.querySelectorAll(".wow");

    // Initially hide elements to prevent flash before animation
    wowElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (!htmlEl.classList.contains("animated")) {
        htmlEl.style.visibility = "hidden";
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            
            // Set element visible and add animated class
            el.style.visibility = "visible";
            el.classList.add("animated");

            // Apply optional data-wow attributes
            const duration = el.getAttribute("data-wow-duration");
            const delay = el.getAttribute("data-wow-delay");

            if (duration) {
              el.style.animationDuration = duration;
            }
            if (delay) {
              el.style.animationDelay = delay;
            }

            // Stop observing this element once animated
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.15, // trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px", // trigger slightly before it enters viewport center
      }
    );

    wowElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
};
