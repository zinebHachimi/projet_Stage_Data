"use client";

import React, { useState } from "react";

const faqs = [
  {
    id: "collapseOne",
    headingId: "headingOne",
    question: "What types of businesses can benefit from your AI solutions?",
    answer: "Very easy! Our solutions are built with flexibility in mind and offer seamless integration with most major platforms and CRMs. Our support team will guide you through the process to ensure a smooth setup.",
  },
  {
    id: "collapseTwo",
    headingId: "headingTwo",
    question: "How easy is it to integrate your AI into our existing systems?",
    answer: "Very easy! Our solutions are built with flexibility in mind and offer seamless integration with most major platforms and CRMs. Our support team will guide you through the process to ensure a smooth setup.",
  },
  {
    id: "collapseThree",
    headingId: "headingThree",
    question: "Do I need technical experience to use your platform?",
    answer: "Very easy! Our solutions are built with flexibility in mind and offer seamless integration with most major platforms and CRMs. Our support team will guide you through the process to ensure a smooth setup.",
  },
  {
    id: "collapseFour",
    headingId: "headingFour",
    question: "Is my data secure with your AI solutions?",
    answer: "Very easy! Our solutions are built with flexibility in mind and offer seamless integration with most major platforms and CRMs. Our support team will guide you through the process to ensure a smooth setup.",
  },
];

export const FaqAccordion = () => {
  // Second FAQ is active by default in original design
  const [activeIndex, setActiveIndex] = useState<number | null>(1);

  const toggleFaq = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq wow fadeInDown" data-wow-duration="2s" data-wow-delay="0.2s">
      <div className="accordian-section-inner position-relative">
        <div className="accordian-inner">
          <div id="faq_accordion1">
            <div className="row">
              <div className="col-xl-8 col-lg-10 col-md-12 col-sm-12 col-12 mx-auto">
                {faqs.map((faq, idx) => {
                  const isOpen = activeIndex === idx;
                  return (
                    <div className="accordion-card" key={faq.id}>
                      <div className="card-header" id={faq.headingId}>
                        <a
                          href="#"
                          className={`btn btn-link ${isOpen ? "" : "collapsed"}`}
                          aria-expanded={isOpen}
                          aria-controls={faq.id}
                          onClick={(e) => toggleFaq(idx, e)}
                        >
                          <h6>{faq.question}</h6>
                        </a>
                      </div>
                      <div
                        id={faq.id}
                        className={`collapse ${isOpen ? "show" : ""}`}
                        aria-labelledby={faq.headingId}
                      >
                        <div className="card-body">
                          <p className="text-size-16 text-left mb-0">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
