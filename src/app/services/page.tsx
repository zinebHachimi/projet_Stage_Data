import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySession } from "@/features/auth/session";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default async function ServicesPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("agentic_session")?.value;
  const session = sessionToken ? await verifySession(sessionToken) : null;
  const user = session ? { name: session.name, email: session.email } : null;

  const services = [
    {
      icon: "fa-solid fa-database",
      title: "Data Scraping & Extraction",
      desc: "Extraction automatique et structuration en temps réel de milliers d'offres d'emploi depuis les jobboards et plateformes professionnelles."
    },
    {
      icon: "fa-solid fa-comments",
      title: "Chatbot IA Intelligent",
      desc: "Un assistant virtuel conversationnel basé sur le NLP pour guider les candidats et répondre précisément à leurs requêtes de recrutement."
    },
    {
      icon: "fa-solid fa-chart-line",
      title: "Analyse Prédictive des Salaires",
      desc: "Modèles d'intelligence artificielle pour estimer et normaliser les salaires, compétences requises et tendances d'embauche."
    },
    {
      icon: "fa-solid fa-share-nodes",
      title: "Intégration API & Exports",
      desc: "Connecteurs robustes pour exporter vos données d'emploi nettoyées au format JSON, CSV ou les intégrer directement via notre API."
    },
    {
      icon: "fa-solid fa-bell",
      title: "Alertes Intelligentes",
      desc: "Système de notification en temps réel pour être alerté instantanément dès qu'une offre correspondant à vos critères est publiée."
    },
    {
      icon: "fa-solid fa-chart-pie",
      title: "Tableaux de Bord RH",
      desc: "Analyses visuelles détaillées et métriques géographiques (offres par ville, par technologie) pour guider vos décisions."
    }
  ];

  const workflowSteps = [
    { num: "01", name: "Planning", desc: "Définition des sources de données et ciblage des profils recherchés." },
    { num: "02", name: "Design", desc: "Modélisation des critères d'IA et architecture du chatbot." },
    { num: "03", name: "Développement", desc: "Mise en place des scripts d'extraction et de l'entraînement du modèle." },
    { num: "04", name: "Tests & Validation", desc: "Vérification de la conformité des données et de la fluidité conversationnelle." },
    { num: "05", name: "Livraison", desc: "Déploiement en production avec synchronisation continue 24/7." }
  ];

  const features = [
    { icon: "fa-solid fa-users", title: "Équipe Professionnelle", desc: "Des ingénieurs IA et experts en scraping à votre service." },
    { icon: "fa-solid fa-bolt", title: "Livraison Rapide", desc: "Mise en place de vos pipelines de données en un temps record." },
    { icon: "fa-solid fa-award", title: "Haute Qualité", desc: "Des données d'offres nettoyées, qualifiées et sans doublons." },
    { icon: "fa-solid fa-shield-halved", title: "Solutions Sécurisées", desc: "Respect total du RGPD et protection stricte de vos données." },
    { icon: "fa-solid fa-microchip", title: "Technologies Modernes", desc: "Modèles de NLP avancés et architectures Cloud hautement scalables." },
    { icon: "fa-solid fa-headset", title: "Support Client 24/7", desc: "Une assistance technique réactive pour répondre à toutes vos questions." }
  ];

  return (
    <>
      <Header user={user} />

      {/* HERO SECTION */}
      <section className="float-left w-100 sub-banner-con position-relative main-box">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-md-7">
              <div className="sub-banner-content-con">
                <h1>Nos Services</h1>
                <p>
                  Découvrez nos solutions de Data Gathering et d&apos;intelligence artificielle <br />
                  conçues pour optimiser la collecte et l&apos;analyse de vos données d&apos;emploi.
                </p>
                <div className="breadcrumb-con d-inline-block">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link href="/">Accueil</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Services
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
                    alt="robot services"
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

      {/* SERVICES DISPLAY SECTION */}
      <section className="float-left w-100 position-relative padding-top padding-bottom main-box" style={{ background: "#fafbfe" }}>
        <div className="container">
          <div className="heading-title-con text-center mb-5">
            <span className="special-text color-blue d-block mb-2">Nos Solutions</span>
            <h2>Des services taillés pour la performance de vos données</h2>
          </div>
          
          <div className="row">
            {services.map((srv, idx) => (
              <div key={idx} className="col-lg-4 col-md-6 mb-4 d-flex">
                <div 
                  className="p-4 bg-white rounded-4 shadow-sm border border-slate-100 hover-shadow transition w-100 d-flex flex-column text-left"
                  style={{
                    borderRadius: "20px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div 
                    className="d-flex align-items-center justify-content-center text-white rounded-3 mb-4"
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "linear-gradient(135deg, #5d87ff 0%, #007bff 100%)",
                      borderRadius: "12px",
                      fontSize: "20px"
                    }}
                  >
                    <i className={srv.icon}></i>
                  </div>
                  <h4 className="font-weight-bold text-slate-800 mb-2" style={{ fontSize: "18px" }}>{srv.title}</h4>
                  <p className="text-muted text-size-15 mb-0" style={{ fontSize: "14px", lineHeight: "1.6" }}>{srv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS / WORKFLOW SECTION */}
      <section className="float-left w-100 position-relative padding-top padding-bottom main-box">
        <div className="container">
          <div className="heading-title-con text-center mb-5">
            <span className="special-text color-blue d-block mb-2">Notre Processus</span>
            <h2>Comment nous réalisons vos projets</h2>
          </div>
          
          <div className="row justify-content-center mt-4">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="col-lg-2.4 col-md-4 col-sm-6 mb-4 position-relative px-3 text-center">
                <div className="d-flex flex-column align-items-center">
                  <div 
                    className="d-flex align-items-center justify-content-center text-primary font-weight-bold mb-3 position-relative"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor: "#ecf2ff",
                      fontSize: "18px",
                      border: "2px solid #5d87ff"
                    }}
                  >
                    {step.num}
                  </div>
                  <h5 className="font-weight-bold text-slate-800 mb-2" style={{ fontSize: "16px" }}>{step.name}</h5>
                  <p className="text-muted text-size-14" style={{ fontSize: "13px", lineHeight: "1.5" }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="float-left w-100 position-relative padding-top padding-bottom main-box" style={{ background: "#fafbfe" }}>
        <div className="container">
          <div className="heading-title-con text-center mb-5">
            <span className="special-text color-blue d-block mb-2">Pourquoi Nous Choisir</span>
            <h2>L&apos;excellence technique au service de vos recrutements</h2>
          </div>

          <div className="row">
            {features.map((feat, idx) => (
              <div key={idx} className="col-lg-4 col-md-6 mb-4 d-flex">
                <div 
                  className="p-4 bg-white rounded-4 shadow-sm border border-slate-100 w-100 d-flex gap-3 align-items-start"
                  style={{ borderRadius: "20px" }}
                >
                  <div 
                    className="d-flex align-items-center justify-content-center text-primary shrink-0"
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      backgroundColor: "#ecf2ff",
                      fontSize: "18px"
                    }}
                  >
                    <i className={feat.icon}></i>
                  </div>
                  <div>
                    <h5 className="font-weight-bold text-slate-800 mb-2" style={{ fontSize: "16px" }}>{feat.title}</h5>
                    <p className="text-muted mb-0" style={{ fontSize: "13px", lineHeight: "1.5" }}>{feat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="float-left w-100 position-relative call-to-action-con main-box padding-bottom padding-top">
        <div className="container">
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
              <span className="special-text color-blue d-block mb-2">Démarrer Votre Projet</span>
              <h2>Besoin d&apos;une solution sur mesure ?</h2>
              <p className="mx-auto mb-4" style={{ maxWidth: "600px" }}>
                Contactez notre équipe dès aujourd&apos;hui pour discuter de vos besoins en collecte de données, structuration d&apos;offres d&apos;emploi ou mise en place de chatbots IA personnalisés.
              </p>
              <Button href="/contact" variant="primary" className="mr-2">
                Nous Contacter
              </Button>
              <Button href="/about" variant="secondary">
                En Savoir Plus
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
