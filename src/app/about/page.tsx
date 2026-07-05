import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";

export default function AboutPage() {
  return (
    <>
      {/* HEADER SECTION */}
      <Header />

      {/* SUB BANNER SECTION */}
      <section className="float-left w-100 sub-banner-con position-relative main-box">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-md-7">
              <div className="sub-banner-content-con">
                <h1>About Us</h1>
                <p>
                  Create Realistic AI Chatbots in Minutes—Perfect for Websites, <br />
                  Apps, and Customer Support.
                </p>
                <div className="breadcrumb-con d-inline-block">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link href="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      About
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
                    About Us
                  </span>
                  <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.2s">
                    Real Conversations <br />
                    with Human-Like AI
                  </h2>
                  <p className="wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.4s">
                    We’re on a mission to revolutionize how businesses communicate.<br />
                    Our AI chatbots are designed to be fast, intuitive, and incredibly lifelike
                    —empowering teams to provide 24/7 support and scale effortlessly.
                  </p>
                  <p className="wow fadeInLeft prgrph-2" data-wow-duration="2s" data-wow-delay="0.5s">
                    Whether you&apos;re a startup or a global brand, we make AI accessible,
                    practical, and impactful.
                  </p>
                  <ul className="list-unstyled p-0 wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.6s">
                    <li className="position-relative">
                      <i className="fa-solid fa-check"></i> Launch your AI chatbot
                      in minutes—no coding or technical expertise required.
                    </li>
                    <li className="position-relative mb-0">
                      <i className="fa-solid fa-check"></i> Fully customizable to
                      match your brand voice, workflows, and customer needs.
                    </li>
                  </ul>
                  <Button href="#" variant="primary" className="wow fadeInDown" data-wow-duration="2s" data-wow-delay="0.7s">
                    Get Started
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
                    Statistics
                  </span>
                  <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.5s">
                    Trusted by Teams, <br />
                    Built for Scale
                  </h2>
                  <p className="wow fadeInLeft p-0" data-wow-duration="2s" data-wow-delay="0.6s">
                    From growing startups to enterprise-level organizations, our
                    AI chatbots are trusted to handle thousands of conversations
                    every day. Designed for speed, reliability, and flexibility,
                    our platform empowers teams to deliver seamless customer
                    experiences no matter the size or scale of their operations.
                  </p>
                  <Button href="#" variant="primary" className="wow fadeInDown" data-wow-duration="2s" data-wow-delay="0.6s">
                    Get Started
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
                      <span className="span-text d-block">Faster Response Time</span>
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
                      <span className="span-text d-block">Global Availability</span>
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
                      <span className="span-text d-block">Increase Engagement</span>
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
                      <span className="span-text d-block">Conversations Daily</span>
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
              Our Team
            </span>
            <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.4s">
              The Expert Team Behind <br />
              Our Success
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
                <span className="d-block">Chief Executive Officer</span>
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
                <span className="d-block">Head of Product</span>
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
                <span className="d-block">Lead Software Engineer</span>
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
                <span className="d-block">Director</span>
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
              Testimonials
            </span>
            <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.4s">
              Build Trust With Reviews <br />
              Loved by Businesses Worldwide
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
              <Button href="#" variant="primary" className="mr-2">
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
