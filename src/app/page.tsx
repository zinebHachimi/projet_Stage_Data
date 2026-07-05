import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySession } from "@/features/auth/session";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { RobotBannerAnimation } from "@/components/ui/RobotBannerAnimation";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

export default async function Home() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("agentic_session")?.value;
  const session = sessionToken ? await verifySession(sessionToken) : null;
  const user = session ? { name: session.name, email: session.email } : null;

  return (
    <>
      {/* HEADER SECTION */}
      <Header user={user} />

      {/* BANNER SECTION */}
      <section className="float-left w-100 banner-con position-relative main-box">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-md-7">
              <div className="banner-content-con">
                <ul className="list-unstyled p-0">
                  <li className="position-relative d-inline-block">
                    <i className="fa-solid fa-circle-check"></i>Collecte en temps réel
                  </li>
                  <li className="position-relative d-inline-block">
                    <i className="fa-solid fa-circle-check"></i>Traitement intelligent par IA
                  </li>
                </ul>
                <h1 style={{ fontSize: "38px", lineHeight: "1.3" }}>
                  Solution de <span className="d-inline-block font-weight-bold color-blue">Data Gathering</span> <br />
                  pour la collecte et le traitement des <br />
                  offres d&apos;emploi basée sur l&apos;IA
                </h1>
                <p>
                  AlgoJob AI est un chatbot intelligent conçu pour automatiser la collecte, l&apos;analyse et la structuration des données d&apos;offres d&apos;emploi provenant de multiples sources en temps réel.
                </p>
                <Button href="/about" variant="primary" className="mr-2">
                  Commencer
                </Button>
                <Button href="#" variant="secondary">
                  Démo en Direct
                </Button>
              </div>
            </div>
            
            <div className="col-lg-5 col-md-5">
              <RobotBannerAnimation />
            </div>
          </div>

          <div className="down_button text-center d-inline-block">
            <a href="#client" className="scroll text-decoration-none">
              <figure className="banner-dropdownimage mb-0 d-inline-block">
                <Image
                  src="/assets/images/banner-dropdownimage.png"
                  alt="dropdown-arrow"
                  width={31}
                  height={45}
                  className="img-fluid"
                />
              </figure>
            </a>
          </div>
        </div>
      </section>

      {/* CLIENT'S LOGO SECTION */}
      <div className="float-left w-100 client-logo-con position-relative main-box" id="client">
        <div className="container wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.2s">
          <div className="client-logo-inner d-flex align-items-center justify-content-between">
            <p className="wow fadeInLeft mb-0" data-wow-duration="2s" data-wow-delay="0.2s">
              Approuvé par <br />
              +10 000 Entreprises :
            </p>
            <div
              className="logos-con d-flex align-items-center justify-content-between wow fadeIn"
              data-wow-duration="2s"
              data-wow-delay="0.2s"
            >
              <figure className="mb-0">
                <Image
                  src="/assets/images/client-logo1.png"
                  alt="shopify"
                  width={120}
                  height={37}
                  className="img-fluid wow fadeInRight"
                  data-wow-duration="2s"
                  data-wow-delay="0.6s"
                />
              </figure>
              <figure className="mb-0">
                <Image
                  src="/assets/images/client-logo2.png"
                  alt="slack"
                  width={126}
                  height={37}
                  className="img-fluid wow fadeInRight"
                  data-wow-duration="2s"
                  data-wow-delay="1.0s"
                />
              </figure>
              <figure className="mb-0">
                <Image
                  src="/assets/images/client-logo3.png"
                  alt="zendesk"
                  width={148}
                  height={37}
                  className="img-fluid wow fadeInRight"
                  data-wow-duration="2s"
                  data-wow-delay="1.4s"
                />
              </figure>
              <figure className="mb-0">
                <Image
                  src="/assets/images/client-logo4.png"
                  alt="discord"
                  width={189}
                  height={37}
                  className="img-fluid wow fadeInRight"
                  data-wow-duration="2s"
                  data-wow-delay="1.8s"
                />
              </figure>
              <figure className="mb-0">
                <Image
                  src="/assets/images/client-logo5.png"
                  alt="telegram"
                  width={173}
                  height={37}
                  className="img-fluid wow fadeInRight"
                  data-wow-duration="2s"
                  data-wow-delay="2.2s"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>

      {/* AMAZING FEATURES SECTION */}
      <section className="float-left w-100 amazing-features-con position-relative padding-top padding-bottom main-box">
        <div className="container wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.2s">
          <div className="heading-title-con text-center">
            <span
              className="special-text color-blue d-block wow fadeInLeft"
              data-wow-duration="2s"
              data-wow-delay="0.2s"
            >
              Fonctionnalités Clés
            </span>
            <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.4s">
              Une IA qui collecte, structure <br />& qualifie les données d&apos;emploi
            </h2>
          </div>

          <div className="row all_row wow fadeIn" data-wow-duration="2s" data-wow-delay="0.4s">
            {/* Feature 1 */}
            <div
              className="col-lg-4 col-md-6 all_column wow fadeInLeft"
              data-wow-duration="2s"
              data-wow-delay="0.5s"
            >
              <div className="feature-box position-relative all_boxes">
                <h4>Chatbot IA Intuitif</h4>
                <p className="mb-0">
                  Interrogez les offres d&apos;emploi collectées en langage naturel grâce à notre agent conversationnel.
                </p>
                <div className="position-absolute feature-icon1 wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.6s">
                  <Image
                    src="/assets/images/feature-img1-icon1.png"
                    alt="feature icon"
                    width={62}
                    height={57}
                    className="img-fluid"
                  />
                </div>
                <figure className="mb-0">
                  <Image
                    src="/assets/images/feature-img1.png"
                    alt="feature diagram"
                    width={384}
                    height={193}
                    className="img-fluid wow fadeInDown"
                    data-wow-duration="2s"
                    data-wow-delay="0.7s"
                  />
                </figure>
                <Link href="#">
                  <Image
                    src="/assets/images/up-right-arrow.png"
                    alt="arrow"
                    width={16}
                    height={15}
                    className="img-fluid"
                  />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div
              className="col-lg-4 col-md-6 all_column wow fadeInUp"
              data-wow-duration="2s"
              data-wow-delay="0.5s"
            >
              <div className="feature-box position-relative all_boxes bg-green">
                <h4>Multi-Sources</h4>
                <p className="mb-0">
                  Collecte en continu depuis les sites d&apos;emploi, <br />
                  les réseaux professionnels et API.
                </p>
                <div className="position-absolute feature-icon2 wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.8s">
                  <Image
                    src="/assets/images/feature-img2-icon1.png"
                    alt="whatsapp"
                    width={68}
                    height={68}
                    className="img-fluid"
                  />
                </div>
                <div className="position-absolute feature-icon3 wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.9s">
                  <Image
                    src="/assets/images/feature-img2-icon2.png"
                    alt="facebook"
                    width={82}
                    height={82}
                    className="img-fluid"
                  />
                </div>
                <div className="position-absolute feature-icon4 wow fadeInLeft" data-wow-duration="2s" data-wow-delay="1.0s">
                  <Image
                    src="/assets/images/feature-img2-icon3.png"
                    alt="telegram"
                    width={68}
                    height={68}
                    className="img-fluid"
                  />
                </div>
                <div className="position-absolute feature-icon5 wow fadeInRight" data-wow-duration="2s" data-wow-delay="1.1s">
                  <Image
                    src="/assets/images/feature-img2-icon4.png"
                    alt="instagram"
                    width={82}
                    height={82}
                    className="img-fluid"
                  />
                </div>
                <figure className="mb-0">
                  <Image
                    src="/assets/images/feature-img2.png"
                    alt="feature diagram"
                    width={394}
                    height={195}
                    className="img-fluid wow fadeInDown"
                    data-wow-duration="2s"
                    data-wow-delay="1.2s"
                  />
                </figure>
                <Link href="#">
                  <Image
                    src="/assets/images/up-right-arrow.png"
                    alt="arrow"
                    width={16}
                    height={15}
                    className="img-fluid"
                  />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div
              className="col-lg-4 col-md-6 all_column wow fadeInRight"
              data-wow-duration="2s"
              data-wow-delay="0.5s"
            >
              <div className="feature-box position-relative all_boxes">
                <h4>Analyses Décisionnelles</h4>
                <p className="mb-0">
                  Suivez les tendances du marché et <br />
                  les compétences demandées en temps réel.
                </p>
                <div className="position-absolute feature-icon6 wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.6s">
                  <Image
                    src="/assets/images/feature-img3-icon1.png"
                    alt="graph icon"
                    width={91}
                    height={63}
                    className="img-fluid"
                  />
                </div>
                <div className="position-absolute blue-elipse wow fadeInDown" data-wow-duration="2s" data-wow-delay="0.7s">
                  <Image
                    src="/assets/images/elipse-blue.png"
                    alt="decor bubble"
                    width={84}
                    height={84}
                    className="img-fluid"
                  />
                </div>
                <figure className="mb-0">
                  <Image
                    src="/assets/images/feature-img3.png"
                    alt="feature diagram"
                    width={352}
                    height={200}
                    className="img-fluid feature-img3 wow fadeIn"
                    data-wow-duration="2s"
                    data-wow-delay="0.8s"
                  />
                </figure>
                <Link href="#">
                  <Image
                    src="/assets/images/up-right-arrow.png"
                    alt="arrow"
                    width={16}
                    height={15}
                    className="img-fluid"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="float-left w-100 position-relative main-box how-it-works-con padding-top padding-bottom">
        <figure className="mb-0 position-absolute vector3 animated-plane">
          <Image
            src="/assets/images/vector3.png"
            alt="vector plane"
            width={175}
            height={147}
            className="img-fluid"
          />
        </figure>
        <div className="container wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.2s">
          <div className="row all_row">
            <div className="col-lg-7 col-md-12 wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.4s">
              <div className="work-img-con position-relative">
                <figure className="mb-0">
                  <Image
                    src="/assets/images/work-img.png"
                    alt="work flow mockup"
                    width={692}
                    height={498}
                    className="img-fluid"
                  />
                </figure>
                <figure className="mb-0 position-absolute robot-img animated-robot">
                  <Image
                    src="/assets/images/robot.png"
                    alt="robot chatbot"
                    width={265}
                    height={477}
                    className="img-fluid"
                  />
                </figure>
              </div>
            </div>
            
            <div className="col-lg-5 col-md-12 wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.4s">
              <div className="work-content-con">
                <div className="heading-title-con">
                  <span
                    className="special-text color-blue d-block wow fadeInLeft"
                    data-wow-duration="2s"
                    data-wow-delay="0.5s"
                  >
                    Fonctionnement
                  </span>
                  <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.6s">
                    Notre Processus de <br />
                    Data Gathering par IA
                  </h2>
                </div>
                <ul className="list-unstyled p-0">
                  <li className="position-relative d-flex align-items-center">
                    <span className="d-block color-blue font-weight-700">01</span>
                    <div className="work-content-inner-con">
                      <h5>Collecte Ciblée</h5>
                      <p className="mb-0">
                        Notre robot parcourt le web pour collecter les offres d&apos;emploi <br />
                        selon vos filtres et technologies requises.
                      </p>
                    </div>
                  </li>
                  <li className="position-relative d-flex align-items-center">
                    <span className="d-block color-blue font-weight-700">02</span>
                    <div className="work-content-inner-con">
                      <h5>Structuration par IA</h5>
                      <p className="mb-0">
                        L&apos;algorithme IA nettoie et structure les données extraites <br />
                        (compétences, salaires, diplômes requis, expérience).
                      </p>
                    </div>
                  </li>
                  <li className="position-relative d-flex align-items-center">
                    <span className="d-block color-blue font-weight-700">03</span>
                    <div className="work-content-inner-con">
                      <h5>Consultation Interactive</h5>
                      <p className="mb-0">
                        Interrogez le chatbot pour filtrer, analyser et <br />
                        exporter les offres d&apos;emploi selon vos besoins.
                      </p>
                    </div>
                  </li>
                </ul>
                <Button href="/about" variant="primary">
                  Commencer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="float-left w-100 position-relative why-choose-us-con padding-top padding-bottom main-box">
        <div className="container wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.2s">
          <div className="heading-title-con text-center">
            <span
              className="special-text color-blue d-block wow fadeInLeft"
              data-wow-duration="2s"
              data-wow-delay="0.2s"
            >
              Pourquoi Nous Choisir
            </span>
            <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.4s">
              Les Avantages Clés de Notre Solution <br />
              de Recrutement & Data Gathering
            </h2>
          </div>
          <div className="choose-outer-con wow fadeInDown" data-wow-duration="2s" data-wow-delay="0.5s">
            <div className="choose-box">
              <figure className="mb-3">
                <Image
                  src="/assets/images/choose-icon1.png"
                  alt="icon"
                  width={41}
                  height={45}
                  className="img-fluid"
                />
              </figure>
              <h6>Filtres Sur-Mesure</h6>
              <p className="mb-0">
                Nous adaptons la collecte selon vos critères précis de compétences...
              </p>
            </div>
            <div className="choose-box">
              <figure className="mb-3">
                <Image
                  src="/assets/images/choose-icon2.png"
                  alt="icon"
                  width={40}
                  height={45}
                  className="img-fluid"
                />
              </figure>
              <h6>Support Technique</h6>
              <p className="mb-0">
                Une équipe d&apos;experts à votre écoute pour optimiser votre ciblage...
              </p>
            </div>
            <div className="choose-box">
              <figure className="mb-3">
                <Image
                  src="/assets/images/choose-icon3.png"
                  alt="icon"
                  width={41}
                  height={45}
                  className="img-fluid"
                />
              </figure>
              <h6>Tarifs Compétitifs</h6>
              <p className="mb-0">
                Des offres transparentes adaptées au volume de données collectées...
              </p>
            </div>
            <div className="choose-box">
              <figure className="mb-3">
                <Image
                  src="/assets/images/choose-icon4.png"
                  alt="icon"
                  width={38}
                  height={45}
                  className="img-fluid"
                />
              </figure>
              <h6>Solution Scalable</h6>
              <p className="mb-0">
                Notre infrastructure s&apos;adapte à l&apos;augmentation de vos volumes de données...
              </p>
            </div>
            <div className="choose-box">
              <figure className="mb-3">
                <Image
                  src="/assets/images/choose-icon5.png"
                  alt="icon"
                  width={48}
                  height={45}
                  className="img-fluid"
                />
              </figure>
              <h6>Équipe d&apos;Experts</h6>
              <p className="mb-0">
                Des ingénieurs spécialisés en IA pour garantir des données fiables...
              </p>
            </div>
          </div>
          <div className="float-left w-100 m-auto text-center wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.4s">
            <Button href="/about" variant="primary">
              Commencer
            </Button>
          </div>
        </div>
      </section>

      {/* PRICING PLAN SECTION */}
      <section className="float-left w-100 position-relative pricing-plan-con padding-top padding-bottom main-box">
        <div className="container wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.2s">
          <div className="heading-title-con text-center">
            <span
              className="special-text color-blue d-block wow fadeInLeft"
              data-wow-duration="2s"
              data-wow-delay="0.4s"
            >
              Plans Tarifaires
            </span>
            <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.5s">
              Des prix simples et transparents pour chaque entreprise
            </h2>
          </div>
          <div className="row all_row wow fadeInDown" data-wow-duration="2s" data-wow-delay="0.5s">
            {/* Starter Plan */}
            <div className="col-lg-4 col-md-6 all_column">
              <div className="pricing-box w-100 all_boxes">
                <div className="plan-content">
                  <h3>Plan Initial</h3>
                  <p>
                    Pour démarrer la collecte <br />
                    sur quelques sources cibles.
                  </p>
                  <div className="generic-price d-inline-block">
                    <span className="d-block starting-at">À partir de :</span>
                    <sup className="d-inline-block font-weight-normal">$</sup>
                    <span className="d-inline-block price-text font-weight-600">49</span>
                    <span className="d-inline-block per-month mb-0 position-relative font-weight-normal">
                      /mois
                    </span>
                  </div>
                </div>
                <div className="plan-listing">
                  <ul className="list-unstyled p-0">
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>Accès au chatbot conversationnel
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>Limité à 1 source d&apos;offres
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>Jusqu&apos;à 100 offres collectées/mois
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i> Support par email
                    </li>
                  </ul>
                  <Button href="#" variant="primary" className="w-100 text-center">
                    Commencer
                  </Button>
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="col-lg-4 col-md-6 all_column">
              <div className="pricing-box w-100 all_boxes">
                <div className="plan-content">
                  <h3>Plan Professionnel</h3>
                  <p>
                    Idéal pour les entreprises <br />
                    ayant besoin d&apos;analyses avancées.
                  </p>
                  <div className="generic-price d-inline-block">
                    <span className="d-block starting-at">À partir de :</span>
                    <sup className="d-inline-block font-weight-normal">$</sup>
                    <span className="d-inline-block price-text font-weight-600">79</span>
                    <span className="d-inline-block per-month mb-0 position-relative font-weight-normal">
                      /mois
                    </span>
                  </div>
                </div>
                <div className="plan-listing">
                  <ul className="list-unstyled p-0">
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>Collecte multi-sources illimitée
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>Filtres de compétences avancés
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>Exports structurés (JSON/CSV)
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i> Tableau de bord analytique complet
                    </li>
                  </ul>
                  <Button href="#" variant="primary" className="w-100 text-center">
                    Commencer
                  </Button>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="col-lg-4 col-md-6 all_column">
              <div className="pricing-box w-100 all_boxes">
                <div className="plan-content">
                  <h3>Plan Entreprise</h3>
                  <p>
                    Conçu pour la collecte à grande <br /> échelle et les solutions IA sur-mesure.
                  </p>
                  <div className="generic-price d-inline-block">
                    <span className="d-block starting-at">À partir de :</span>
                    <sup className="d-inline-block font-weight-normal">$</sup>
                    <span className="d-inline-block price-text font-weight-600">199</span>
                    <span className="d-inline-block per-month mb-0 position-relative font-weight-normal">
                      /mois
                    </span>
                  </div>
                </div>
                <div className="plan-listing">
                  <ul className="list-unstyled p-0">
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>Toutes les fonctionnalités Pro
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>Accès complet à l&apos;API de données
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>Modèles de classification personnalisés
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>SLA et support prioritaire
                    </li>
                  </ul>
                  <Button href="#" variant="primary" className="w-100 text-center">
                    Commencer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="float-left w-100 testimonials-con position-relative padding-top main-box">
        <div className="container-fluid">
          <div className="heading-title-con text-center">
            <span
              className="special-text color-blue d-block wow fadeInLeft"
              data-wow-duration="2s"
              data-wow-delay="0.2s"
            >
              Témoignages
            </span>
            <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.4s">
              Découvrez les retours de nos partenaires <br />
              et recruteurs satisfaits
            </h2>
          </div>
          <div className="row position-relative wow fadeIn" data-wow-duration="2s" data-wow-delay="0.4s">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      {/* FAQ'S SECTION */}
      <section className="faq-con position-relative float-left w-100 main-box padding-top padding-bottom">
        <figure className="mb-0 position-absolute vector1 animated-plane">
          <Image
            src="/assets/images/vector1.png"
            alt="vector"
            width={249}
            height={210}
            className="img-fluid"
          />
        </figure>
        <figure className="mb-0 position-absolute vector2">
          <Image
            src="/assets/images/vector2.png"
            alt="vector"
            width={206}
            height={161}
            className="img-fluid"
          />
        </figure>
        <div className="container wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.2s">
          <div className="row">
            <div className="col-xl-7 col-lg-10 col-12 mx-auto">
              <div className="faq_content text-center">
                <span
                  className="special-text color-blue d-block wow fadeInLeft"
                  data-wow-duration="2s"
                  data-wow-delay="0.2s"
                >
                  Questions Fréquentes
                </span>
                <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.4s">
                  Réponses à vos questions sur notre solution de <span>Data Gathering IA</span>
                </h2>
              </div>
            </div>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="float-left w-100 position-relative call-to-action-con main-box padding-bottom">
        <div className="container wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.2s">
          <div className="cta-inner-con padding-top100 padding-bottom100 position-relative">
            <figure className="mb-0 position-absolute robot1 animated-robot">
              <Image
                src="/assets/images/robot1.png"
                alt="vector"
                width={180}
                height={344}
                className="img-fluid"
              />
            </figure>
            <figure className="mb-0 position-absolute robot2 animated-robot">
              <Image
                src="/assets/images/robot2.png"
                alt="vector"
                width={268}
                height={419}
                className="img-fluid"
              />
            </figure>
            <div className="heading-title-con text-center mb-0">
              <span
                className="special-text color-blue d-block wow fadeInLeft"
                data-wow-duration="2s"
                data-wow-delay="0.2s"
              >
                Automatisez vos Processus
              </span>
              <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.4s">
                Prêt à structurer votre collecte <br />
                d&apos;offres d&apos;emploi grâce à l&apos;IA ?
              </h2>
              <p className="wow fadeInDown" data-wow-duration="2s" data-wow-delay="0.5s">
                Commencez à utiliser notre solution de Data Gathering dès aujourd&apos;hui pour collecter, traiter et filtrer vos données d&apos;emploi à l&apos;aide de l&apos;intelligence artificielle.
              </p>
              <Button href="/about" variant="primary" className="mr-2">
                Commencer
              </Button>
              <Button href="#" variant="secondary">
                Démo en Direct
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <Footer />
    </>
  );
}
