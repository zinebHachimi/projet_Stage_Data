"use client";

import React, { useState } from "react";

const faqs = [
  {
    id: "collapseOne",
    headingId: "headingOne",
    question: "Comment la solution d'IA collecte-t-elle les offres d'emploi ?",
    answer: "Notre solution de Data Gathering explore automatiquement et en temps réel de multiples plateformes d'emploi, réseaux professionnels et sites de recrutement partenaires pour en extraire les offres les plus pertinentes.",
  },
  {
    id: "collapseTwo",
    headingId: "headingTwo",
    question: "Comment les données d'emploi sont-elles traitées et structurées ?",
    answer: "Grâce à des modèles avancés d'IA et de NLP, notre solution extrait et normalise automatiquement les données clés : intitulés de poste, compétences requises, salaire proposé, type de contrat, localisation et niveau d'expérience.",
  },
  {
    id: "collapseThree",
    headingId: "headingThree",
    question: "Faut-il des compétences techniques pour configurer la collecte ?",
    answer: "Pas du tout ! L'outil propose une interface simple et intuitive pour cibler les offres. Vous pouvez interroger le chatbot directement en français standard pour lui demander des données précises.",
  },
  {
    id: "collapseFour",
    headingId: "headingFour",
    question: "La solution s'adapte-t-elle à des volumes de données importants ?",
    answer: "Oui, notre infrastructure de data gathering est scalable. Elle est conçue pour collecter et traiter des milliers d'offres chaque jour sans perte de performance, assurant une veille technologique et métier continue.",
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
