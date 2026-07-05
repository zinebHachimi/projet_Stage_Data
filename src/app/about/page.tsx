import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySession } from "@/features/auth/session";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";

export default async function AboutPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("agentic_session")?.value;
  const session = sessionToken ? await verifySession(sessionToken) : null;
  const user = session ? { name: session.name, email: session.email } : null;

  return (
    <>
      {/* HEADER SECTION */}
      <Header user={user} />

      {/* SUB BANNER SECTION */}
      <section className="float-left w-100 sub-banner-con position-relative main-box">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-md-7">
              <div className="sub-banner-content-con">
                <h1>À Propos de Nous</h1>
                <p>
                  Solution intelligente de Data Gathering pour la collecte <br />
                  et le traitement des données pour offres d&apos;emploi basée sur l&apos;IA.
                </p>
                <div className="breadcrumb-con d-inline-block">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link href="/">Accueil</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      À Propos
                    </li>
                  </ol>
                </div>
              </div>
            </div>
            
            <div className="col-lg-5 col-md-5">
              <div className="sub-banner-img-con">
                <figure className="mb-0">
                  <Image
                    src="/assets/images/sub-banner-img.png"
                    alt="robot"
                    width={541}
                    height={472}
                    className="img-fluid"
                    priority
                  />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section className="float-left w-100 about-us-con position-relative padding-top padding-bottom main-box">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.2s">
              <div className="about-us-img-con d-flex">
                <figure className="mb-0">
                  <Image
                    src="/assets/images/about-img1.jpg"
                    alt="office team 1"
                    width={313}
                    height={531}
                    className="img-fluid"
                  />
                </figure>
                <figure className="abt-img2 mb-0">
                  <Image
                    src="/assets/images/about-img2.jpg"
                    alt="office team 2"
                    width={313}
                    height={531}
                    className="img-fluid"
                  />
                </figure>
              </div>
            </div>
            
            <div className="col-lg-6 col-md-6 wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.2s">
              <div className="about-us-content-con">
                <div className="heading-title-con mb-0">
                  <span
                    className="special-text color-blue d-block wow fadeInLeft"
                    data-wow-duration="2s"
                    data-wow-delay="0.2s"
                  >
                    À Propos
                  </span>
                  <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.2s">
                    Collecte & Traitement <br />
                    Intelligent d&apos;Offres d&apos;Emploi
                  </h2>
                  <p className="wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.4s">
                    AlgoJob AI est née de la volonté de simplifier la recherche d&apos;emploi et le data gathering de données professionnelles grâce à l&apos;intelligence artificielle.
                  </p>
                  <p className="wow fadeInLeft prgrph-2" data-wow-duration="2s" data-wow-delay="0.5s">
                    Notre chatbot intelligent agrège, nettoie et structure les offres d&apos;emploi provenant de multiples plateformes pour vous offrir les opportunités les plus adaptées en temps réel.
                  </p>
                  <ul className="list-unstyled p-0 wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.6s">
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i> Extraction et structuration automatique des données d&apos;offres d&apos;emploi.
                    </li>
                    <li className="position-relative mb-0">
                      <i className="fa-solid fa-check"></i> Chatbot conversationnel intelligent pour assister les candidats dans leurs requêtes.
                    </li>
                  </ul>
                  <Button href="#" variant="primary" className="wow fadeInDown" data-wow-duration="2s" data-wow-delay="0.7s">
                    Commencer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="float-left w-100 statistics-con position-relative padding-top padding-bottom main-box">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.2s">
              <div className="statistics-content-con">
                <div className="heading-title-con mb-0">
                  <span
                    className="special-text color-blue d-block wow fadeInLeft"
                    data-wow-duration="2s"
                    data-wow-delay="0.4s"
                  >
                    Statistiques
                  </span>
                  <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.5s">
                    Adopté par les recruteurs, <br />
                    taillé pour la performance
                  </h2>
                  <p className="wow fadeInLeft p-0" data-wow-duration="2s" data-wow-delay="0.6s">
                    De la startup en croissance aux grandes entreprises, notre solution de Data Gathering structure et qualifie des milliers d&apos;offres d&apos;emploi au quotidien pour accélérer vos analyses de marché. Conçue pour la rapidité et la fiabilité, notre plateforme assiste vos équipes RH et décisionnelles.
                  </p>
                  <Button href="#" variant="primary" className="wow fadeInDown" data-wow-duration="2s" data-wow-delay="0.6s">
                    Commencer
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 col-md-6 wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.2s">
              <div className="statistics-outer-con">
                <div className="row">
                  {/* Stat 1 */}
                  <div className="col-lg-6 col-md-6 d-flex">
                    <div className="statistics-box w-100">
                      <figure className="mb-3">
                        <Image
                          src="/assets/images/statistics-icon1.png"
                          alt="icon"
                          width={60}
                          height={45}
                          className="img-fluid"
                        />
                      </figure>
                      <span className="d-inline-block black-text counter">
                        <AnimatedCounter end={95} />
                      </span>
                      <sup className="d-inline-block black-text">%</sup>
                      <span className="span-text d-block">Temps de traitement réduit</span>
                    </div>
                  </div>
                  
                  {/* Stat 2 */}
                  <div className="col-lg-6 col-md-6 d-flex">
                    <div className="statistics-box w-100">
                      <figure className="mb-3">
                        <Image
                          src="/assets/images/statistics-icon2.png"
                          alt="icon"
                          width={45}
                          height={45}
                          className="img-fluid"
                        />
                      </figure>
                      <span className="d-inline-block black-text">24/7</span>
                      <span className="span-text d-block">Disponibilité de l&apos;IA 24h/24</span>
                    </div>
                  </div>
                  
                  {/* Stat 3 */}
                  <div className="col-lg-6 col-md-6 d-flex">
                    <div className="statistics-box w-100">
                      <figure className="mb-3">
                        <Image
                          src="/assets/images/statistics-icon3.png"
                          alt="icon"
                          width={46}
                          height={45}
                          className="img-fluid"
                        />
                      </figure>
                      <sup className="d-inline-block black-text">+</sup>
                      <span className="d-inline-block black-text counter">
                        <AnimatedCounter end={40} />
                      </span>
                      <sup className="d-inline-block black-text">%</sup>
                      <span className="span-text d-block">Pertinence accrue des offres</span>
                    </div>
                  </div>
                  
                  {/* Stat 4 */}
                  <div className="col-lg-6 col-md-6 d-flex">
                    <div className="statistics-box w-100">
                      <figure className="mb-3">
                        <Image
                          src="/assets/images/statistics-icon4.png"
                          alt="icon"
                          width={51}
                          height={45}
                          className="img-fluid"
                        />
                      </figure>
                      <span className="d-inline-block black-text counter">
                        <AnimatedCounter end={10000} />
                      </span>
                      <sup className="d-inline-block black-text">+</sup>
                      <span className="span-text d-block">Offres structurées par jour</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR TEAM SECTION */}
      <section className="float-left w-100 our-team-con position-relative padding-top main-box text-center">
        <div className="container wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.2s">
          <div className="heading-title-con text-center">
            <span
              className="special-text color-blue d-block wow fadeInLeft"
              data-wow-duration="2s"
              data-wow-delay="0.2s"
            >
              Notre Équipe
            </span>
            <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.4s">
              L&apos;équipe d&apos;experts derrière <br />
              notre projet de Data Gathering
            </h2>
          </div>
          
          <div className="row all_row wow fadeInDown" data-wow-duration="2s" data-wow-delay="0.2s">
            {/* Person 1 */}
            <div className="col-lg-3 col-md-6 all_column wow fadeInDown" data-wow-duration="2s" data-wow-delay="0.2s">
              <div className="team-box all_boxes">
                <figure className="mb-0">
                  <Image
                    src="/assets/images/team-person1.jpg"
                    alt="Emily Carter"
                    width={331}
                    height={323}
                    className="img-fluid"
                  />
                </figure>
                <h5>Emily Carter</h5>
                <span className="d-block">Co-fondatrice & CEO</span>
                <ul className="list-unstyled mb-0 social-icons">
                  <li>
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      <i className="fa-brands fa-facebook-f social-networks"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      <i className="fa-brands fa-instagram social-networks"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      <i className="fa-brands fa-linkedin-in social-networks"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Person 2 */}
            <div className="col-lg-3 col-md-6 all_column wow fadeInDown" data-wow-duration="2s" data-wow-delay="0.4s">
              <div className="team-box all_boxes">
                <figure className="mb-0">
                  <Image
                    src="/assets/images/team-person2.jpg"
                    alt="James Thompson"
                    width={331}
                    height={323}
                    className="img-fluid"
                  />
                </figure>
                <h5>James Thompson</h5>
                <span className="d-block">Directeur Produit</span>
                <ul className="list-unstyled mb-0 social-icons">
                  <li>
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      <i className="fa-brands fa-facebook-f social-networks"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      <i className="fa-brands fa-instagram social-networks"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      <i className="fa-brands fa-linkedin-in social-networks"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Person 3 */}
            <div className="col-lg-3 col-md-6 all_column wow fadeInDown" data-wow-duration="2s" data-wow-delay="0.5s">
              <div className="team-box all_boxes">
                <figure className="mb-0">
                  <Image
                    src="/assets/images/team-person3.jpg"
                    alt="Daniel Reed"
                    width={331}
                    height={323}
                    className="img-fluid"
                  />
                </figure>
                <h5>Daniel Reed</h5>
                <span className="d-block">Ingénieur IA Lead</span>
                <ul className="list-unstyled mb-0 social-icons">
                  <li>
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      <i className="fa-brands fa-facebook-f social-networks"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      <i className="fa-brands fa-instagram social-networks"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      <i className="fa-brands fa-linkedin-in social-networks"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Person 4 */}
            <div className="col-lg-3 col-md-6 all_column wow fadeInDown" data-wow-duration="2s" data-wow-delay="0.6s">
              <div className="team-box all_boxes">
                <figure className="mb-0">
                  <Image
                    src="/assets/images/team-person4.jpg"
                    alt="Olivia Brook"
                    width={331}
                    height={323}
                    className="img-fluid"
                  />
                </figure>
                <h5>Olivia Brook</h5>
                <span className="d-block">Directrice de Recherche</span>
                <ul className="list-unstyled mb-0 social-icons">
                  <li>
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      <i className="fa-brands fa-facebook-f social-networks"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      <i className="fa-brands fa-instagram social-networks"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      <i className="fa-brands fa-linkedin-in social-networks"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="float-left w-100 testimonials-con position-relative padding-top padding-bottom main-box">
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
              Faites confiance aux avis de nos partenaires <br />
              dans le monde entier
            </h2>
          </div>
          <div className="row position-relative wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.4s">
            <TestimonialCarousel />
          </div>
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
                Optimisez vos Données
              </span>
              <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.4s">
                Prêt à structurer votre collecte <br />
                d&apos;offres d&apos;emploi grâce à l&apos;IA ?
              </h2>
              <p className="wow fadeInDown" data-wow-duration="2s" data-wow-delay="0.5s">
                Tirez parti du machine learning pour structurer et classifier vos offres d&apos;emploi automatiquement et gagner un temps précieux.
              </p>
              <Button href="#" variant="primary" className="mr-2">
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
