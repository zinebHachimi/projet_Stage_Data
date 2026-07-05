"use client";

import React, { useState, useEffect } from "react";

export const BackToTopButton = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <a
      id="button"
      className={show ? "show" : ""}
      onClick={scrollToTop}
      style={{ cursor: "pointer" }}
      aria-label="Back to Top"
    />
  );
};
