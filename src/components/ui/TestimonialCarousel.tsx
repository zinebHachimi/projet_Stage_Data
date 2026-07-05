"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const testimonials = [
  {
    text: "Since adding the chatbot, our customer support times have dropped by over 50%. It's like having a support!",
    customer: "Rolex Trought",
    designation: "Happy Client",
  },
  {
    text: "We were amazed at how easy it was to set up. Within days, the chatbot was handling real conversations and doing it well.",
    customer: "Alina Jame",
    designation: "Happy Client",
  },
  {
    text: "Our website engagement shot up after installing the chatbot. Visitors now stay longer and actually get the answers they need instantly.",
    customer: "Kevin Andrew",
    designation: "Happy Client",
  },
  {
    text: "We serve customers in three time zones, and this chatbot handles it all. No more missed messages or delayed replies.",
    customer: "Nazish Ehtaon",
    designation: "Happy Client",
  },
  {
    text: "What impressed me most was how natural the chatbot sounds—and we were able to fully match it to our brand voice.",
    customer: "John Clark",
    designation: "Happy Client",
  },
  {
    text: "It’s not just for support. Our AI chatbot has become a key sales tool, helping qualify leads and guide users through purchases.",
    customer: "Zampa Devo",
    designation: "Happy Client",
  },
];

export const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle responsiveness (items per view) matching Owl Carousel settings:
  // 0: 1, 576: 2, 768: 3, 992: 4, 1500: 6
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1500) {
        setVisibleItems(6);
      } else if (width >= 992) {
        setVisibleItems(4);
      } else if (width >= 768) {
        setVisibleItems(3);
      } else if (width >= 576) {
        setVisibleItems(2);
      } else {
        setVisibleItems(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = testimonials.length;
  // The maximum index we can slide to, ensuring we don't show empty spaces at the end
  const maxIndex = Math.max(0, totalSlides - visibleItems);

  // Autoplay
  useEffect(() => {
    if (maxIndex === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= maxIndex) {
          return 0; // Loop back to start
        }
        return prevIndex + 1;
      });
    }, 8000); // 8 seconds autoplay timeout matching template settings

    return () => clearInterval(interval);
  }, [maxIndex]);

  // Handle dot navigation
  // To avoid too many dots on desktop, let's render dots corresponding to each slide, or each group

  const goToSlide = (slideIndex: number) => {
    // Bound the index to ensure it is valid
    const targetIndex = Math.min(slideIndex, maxIndex);
    setCurrentIndex(targetIndex);
  };

  return (
    <div className="w-100 position-relative">
      <div 
        ref={containerRef}
        className="w-100 overflow-hidden"
        style={{ padding: "20px 0" }}
      >
        <div
          className="d-flex transition"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
            transitionDuration: "600ms",
            transitionTimingFunction: "ease-in-out",
          }}
        >
          {testimonials.map((item, i) => {
            const itemWidth = `${100 / visibleItems}%`;
            return (
              <div
                key={i}
                className="px-3 flex-shrink-0"
                style={{ width: itemWidth, boxSizing: "border-box" }}
              >
                <div className="testimonial-box h-100 d-flex flex-column justify-content-between">
                  <div>
                    <figure className="mb-3">
                      <Image
                        src="/assets/images/star-icon.png"
                        alt="stars"
                        width={91}
                        height={14}
                        className="img-fluid"
                      />
                    </figure>
                    <p>{item.text}</p>
                  </div>
                  <div>
                    <span className="d-block customer font-weight-600">
                      {item.customer}
                    </span>
                    <span className="d-block designation font-weight-500">
                      {item.designation}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Dots */}
      {maxIndex > 0 && (
        <div className="text-center mt-4">
          <div className="owl-dots" style={{ display: "inline-block" }}>
            {Array.from({ length: totalSlides }).map((_, dotIdx) => {
              // Determine active dot: since multiple cards are shown, active dot is closest to current index
              const isActive = 
                dotIdx === currentIndex || 
                (currentIndex >= maxIndex && dotIdx >= maxIndex);
              return (
                <button
                  key={dotIdx}
                  role="button"
                  className={`owl-dot ${isActive ? "active" : ""}`}
                  style={{
                    outline: "none",
                    border: "none",
                    background: "none",
                    padding: "0 4px",
                  }}
                  onClick={() => goToSlide(dotIdx)}
                >
                  <span style={{ margin: "5px 7px" }} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
