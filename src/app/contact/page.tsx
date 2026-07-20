import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySession } from "@/features/auth/session";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/ui/ContactForm";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

export default async function ContactPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("agentic_session")?.value;
  const session = sessionToken ? await verifySession(sessionToken) : null;
  const user = session ? { name: session.name, email: session.email, role: session.role } : null;

  const contactInfos = [
    {
      icon: "fa-solid fa-phone-volume",
      title: "Téléphone",
      value: "+61 3 8376 6284",
      link: "tel:+61383766284"
    },
    {
      icon: "fa-solid fa-envelope",
      title: "Adresse E-mail",
      value: "contact@algojob.ai",
      link: "mailto:contact@algojob.ai"
    },
    {
      icon: "fa-solid fa-location-dot",
      title: "Adresse physique",
      value: "551 Swanston Street, Melbourne Victoria 3053 Australia",
      link: "https://maps.google.com"
    },
    {
      icon: "fa-solid fa-clock",
      title: "Heures d'ouverture",
      value: "Lundi - Vendredi: 9h00 - 18h00",
      link: null
    }
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
                <h1>Contactez-Nous</h1>
                <p>
                  Une question, une demande de démonstration ou besoin d&apos;assistance ? <br />
                  Remplissez notre formulaire ou utilisez nos coordonnées directes.
                </p>
                <div className="breadcrumb-con d-inline-block">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link href="/">Accueil</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Contact
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
                    alt="robot contact"
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

      {/* CONTACT INFOS SECTION */}
      <section className="float-left w-100 position-relative padding-top padding-bottom main-box" style={{ background: "#fafbfe" }}>
        <div className="container">
          <div className="row">
            {contactInfos.map((info, idx) => (
              <div key={idx} className="col-lg-3 col-md-6 mb-4 d-flex">
                <div 
                  className="p-4 bg-white rounded-4 shadow-sm border border-slate-100 w-100 d-flex flex-column align-items-center text-center hover-shadow transition"
                  style={{
                    borderRadius: "20px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div 
                    className="d-flex align-items-center justify-content-center text-primary rounded-circle mb-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#ecf2ff",
                      fontSize: "20px"
                    }}
                  >
                    <i className={info.icon}></i>
                  </div>
                  <h5 className="font-weight-bold text-slate-800 mb-2" style={{ fontSize: "16px" }}>{info.title}</h5>
                  {info.link ? (
                    <a 
                      href={info.link} 
                      target={info.link.startsWith("http") ? "_blank" : undefined}
                      rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-muted text-decoration-none hover:text-primary transition"
                      style={{ fontSize: "13px", lineHeight: "1.4" }}
                    >
                      {info.value}
                    </a>
                  ) : (
                    <span className="text-muted" style={{ fontSize: "13px", lineHeight: "1.4" }}>{info.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM AND MAP SECTION */}
      <section className="float-left w-100 position-relative padding-top padding-bottom main-box">
        <div className="container">
          <div className="row justify-content-between align-items-stretch">
            {/* Left side: Interactive form */}
            <div className="col-lg-6 mb-4 mb-lg-0">
              <ContactForm />
            </div>

            {/* Right side: Map and details */}
            <div className="col-lg-5 d-flex flex-column justify-content-between">
              <div className="p-4 p-md-5 bg-white rounded-4 shadow-sm border border-slate-100 h-100 d-flex flex-column justify-content-between" style={{ borderRadius: "24px" }}>
                <div className="text-left">
                  <h3 className="font-weight-bold text-slate-800 mb-3" style={{ fontSize: "22px" }}>Notre Siège Social</h3>
                  <p className="text-muted text-size-15 mb-4" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                    Retrouvez-nous à Melbourne au cœur du pôle technologique. Nos locaux sont ouverts au public uniquement sur rendez-vous préalable.
                  </p>
                </div>
                
                {/* Embed Google Map iframe */}
                <div className="overflow-hidden rounded-3 border border-slate-100" style={{ borderRadius: "16px", height: "300px" }}>
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.0163353457585!2d144.96092797686737!3d-37.80137197197825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642cca16f8ef1%3A0xd6491763ef8dc19c!2s551%20Swanston%20St%2C%20Carlton%20VIC%203053%2C%20Australia!5e0!3m2!1sen!2sfr!4v1700000000000!5m2!1sen!2sfr" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="float-left w-100 position-relative padding-top padding-bottom main-box" style={{ background: "#fafbfe" }}>
        <div className="container">
          <div className="heading-title-con text-center mb-5">
            <span className="special-text color-blue d-block mb-2">Foire Aux Questions</span>
            <h2>Vous avez des questions ? Nous avons des réponses</h2>
          </div>
          
          <FaqAccordion />
        </div>
      </section>

      <Footer />
    </>
  );
}
