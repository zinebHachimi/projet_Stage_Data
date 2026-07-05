import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { RobotBannerAnimation } from "@/components/ui/RobotBannerAnimation";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

export default function Home() {
  return (
    <>
      {/* HEADER SECTION */}
      <Header />

      {/* BANNER SECTION */}
      <section className="float-left w-100 banner-con position-relative main-box">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-md-7">
              <div className="banner-content-con">
                <ul className="list-unstyled p-0">
                  <li className="position-relative d-inline-block">
                    <i className="fa-solid fa-circle-check"></i>Free 14-day trial
                  </li>
                  <li className="position-relative d-inline-block">
                    <i className="fa-solid fa-circle-check"></i>No credit card required
                  </li>
                </ul>
                <h1>
                  Boost Conversations <br />
                  with Our Intelligent <br />
                  <span className="d-inline-block font-weight-bold color-blue">
                    Chatbot
                  </span>{" "}
                  Platform
                </h1>
                <p>
                  Build human-like AI chatbots for websites, apps, and customer
                  service in minutes.
                </p>
                <Button href="/about" variant="primary" className="mr-2">
                  Get Started
                </Button>
                <Button href="#" variant="secondary">
                  Live Demo
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
              Trusted by <br />
              10,000+ Businesses Globally:
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
              Amazing Features
            </span>
            <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.4s">
              AI That Understands, Learns <br />& Engages
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
                <h4>Conversational AI</h4>
                <p className="mb-0">
                  Respond intelligently with GPT-powered natural language
                  understanding.
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
                <h4>Multi-Platform</h4>
                <p className="mb-0">
                  Integrate with websites, apps, Facebook, <br />
                  WhatsApp & more.
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
                <h4>Real-Time Analytics</h4>
                <p className="mb-0">
                  Monitor chatbot performance and <br />
                  user behavior in real time.
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
                    How it Works
                  </span>
                  <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.6s">
                    How Our Advanced <br />
                    AI Chatbot Works
                  </h2>
                </div>
                <ul className="list-unstyled p-0">
                  <li className="position-relative d-flex align-items-center">
                    <span className="d-block color-blue font-weight-700">01</span>
                    <div className="work-content-inner-con">
                      <h5>Build with Ease</h5>
                      <p className="mb-0">
                        Build your chatbot using our intuitive drag-and-drop <br />
                        interface — no coding needed.
                      </p>
                    </div>
                  </li>
                  <li className="position-relative d-flex align-items-center">
                    <span className="d-block color-blue font-weight-700">02</span>
                    <div className="work-content-inner-con">
                      <h5>Train with Your Content</h5>
                      <p className="mb-0">
                        Train your AI using documents, FAQs, or URLs to create <br />
                        accurate, personalized responses.
                      </p>
                    </div>
                  </li>
                  <li className="position-relative d-flex align-items-center">
                    <span className="d-block color-blue font-weight-700">03</span>
                    <div className="work-content-inner-con">
                      <h5>Deploy Anywhere</h5>
                      <p className="mb-0">
                        Launch on your website, mobile app, or messaging <br />
                        platforms in just a few clicks.
                      </p>
                    </div>
                  </li>
                </ul>
                <Button href="/about" variant="primary">
                  Get Started
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
              Why Choose Us
            </span>
            <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.4s">
              Unique Selling Points & Advantages <br />
              of Our Service
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
              <h6>Tailored Solutions</h6>
              <p className="mb-0">
                We offer customized services designed to meet the specific
                needs...
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
              <h6>Customer Support</h6>
              <p className="mb-0">
                Our dedicated support team is available 24/7, providing
                assistance...
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
              <h6>Affordable Pricing</h6>
              <p className="mb-0">
                Competitive rates with transparent pricing—no hidden fees...
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
              <h6>Scalable Solutions</h6>
              <p className="mb-0">
                Our services grow with your business, allowing you to scale
                up...
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
              <h6>Expert Team</h6>
              <p className="mb-0">
                Our experienced professionals bring deep industry knowledge...
              </p>
            </div>
          </div>
          <div className="float-left w-100 m-auto text-center wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.4s">
            <Button href="/about" variant="primary">
              Get Started
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
              Pricing Plans
            </span>
            <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.5s">
              Simple, Transparent Pricing for Every Business
            </h2>
          </div>
          <div className="row all_row wow fadeInDown" data-wow-duration="2s" data-wow-delay="0.5s">
            {/* Starter Plan */}
            <div className="col-lg-4 col-md-6 all_column">
              <div className="pricing-box w-100 all_boxes">
                <div className="plan-content">
                  <h3>Starter Plan</h3>
                  <p>
                    Get started with our essential <br />
                    chatbot features.
                  </p>
                  <div className="generic-price d-inline-block">
                    <span className="d-block starting-at">Starting at:</span>
                    <sup className="d-inline-block font-weight-normal">$</sup>
                    <span className="d-inline-block price-text font-weight-600">49</span>
                    <span className="d-inline-block per-month mb-0 position-relative font-weight-normal">
                      /mo
                    </span>
                  </div>
                </div>
                <div className="plan-listing">
                  <ul className="list-unstyled p-0">
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>Basic chatbot functionality
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>Limited to 1 website
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>Upto 100 conversation/month
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i> Email support
                    </li>
                  </ul>
                  <Button href="#" variant="primary" className="w-100 text-center">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="col-lg-4 col-md-6 all_column">
              <div className="pricing-box w-100 all_boxes">
                <div className="plan-content">
                  <h3>Pro Plan</h3>
                  <p>
                    Best for growing businesses needing <br />
                    advanced features and scale.
                  </p>
                  <div className="generic-price d-inline-block">
                    <span className="d-block starting-at">Starting at:</span>
                    <sup className="d-inline-block font-weight-normal">$</sup>
                    <span className="d-inline-block price-text font-weight-600">79</span>
                    <span className="d-inline-block per-month mb-0 position-relative font-weight-normal">
                      /mo
                    </span>
                  </div>
                </div>
                <div className="plan-listing">
                  <ul className="list-unstyled p-0">
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>Unlimited Conversations
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>Customer Branding
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>Multi-language support
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i> Analytics dashboard
                    </li>
                  </ul>
                  <Button href="#" variant="primary" className="w-100 text-center">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="col-lg-4 col-md-6 all_column">
              <div className="pricing-box w-100 all_boxes">
                <div className="plan-content">
                  <h3>Enterprise Plan</h3>
                  <p>
                    Designed for large-scale operations <br /> and custom AI solutions
                  </p>
                  <div className="generic-price d-inline-block">
                    <span className="d-block starting-at">Starting at:</span>
                    <sup className="d-inline-block font-weight-normal">$</sup>
                    <span className="d-inline-block price-text font-weight-600">199</span>
                    <span className="d-inline-block per-month mb-0 position-relative font-weight-normal">
                      /mo
                    </span>
                  </div>
                </div>
                <div className="plan-listing">
                  <ul className="list-unstyled p-0">
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>All Pro features
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>Dedicated account Manager
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i> API access & integrations
                    </li>
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i>SLA & priority support
                    </li>
                  </ul>
                  <Button href="#" variant="primary" className="w-100 text-center">
                    Get Started
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
              Testimonials
            </span>
            <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.4s">
              Build Trust With Reviews <br />
              Loved by Businesses Worldwide
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
                  Faq&apos;s
                </span>
                <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.4s">
                  Answers to Your Most Frequently Asked <span>Questions</span>
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
                Experience Boost
              </span>
              <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.4s">
                Ready to Supercharge <br />
                Your Customer Experience?
              </h2>
              <p className="wow fadeInDown" data-wow-duration="2s" data-wow-delay="0.5s">
                Start using our AI chatbot today to automate support, boost
                engagement, and save time.
              </p>
              <Button href="/about" variant="primary" className="mr-2">
                Get Started
              </Button>
              <Button href="#" variant="secondary">
                Live Demo
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
