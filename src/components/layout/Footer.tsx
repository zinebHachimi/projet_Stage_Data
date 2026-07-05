import React from "react";
import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <section className="footer-con position-relative float-left w-100 main-box">
      <div className="container">
        <div className="middle_portion">
          <div className="row">
            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
              <div className="logo-content">
                <Link href="/">
                  <figure className="footer-logo">
                    <Image
                      src="/assets/images/footer-logo.png"
                      alt="footer-logo"
                      width={145}
                      height={41}
                      className="img-fluid"
                    />
                  </figure>
                </Link>
                <p className="text-size-16 text">
                  We create intelligent, scalable AI solutions that help
                  businesses work smarter, move faster, and achieve more.
                </p>
                <ul className="list-unstyled mb-0 social-icons">
                  <li>
                    <a
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <i className="fa-brands fa-facebook-f social-networks"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <i className="fa-brands fa-instagram social-networks"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <i className="fa-brands fa-linkedin-in social-networks"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="col-xl-2 col-lg-2 col-md-3 col-sm-6 col-5">
              <div className="links">
                <h4 className="heading">Navigation</h4>
                <ul className="list-unstyled mb-0">
                  <li>
                    <i className="fa-solid fa-arrow-right"></i>
                    <Link href="/about" className="text-decoration-none">
                      About
                    </Link>
                  </li>
                  <li>
                    <i className="fa-solid fa-arrow-right"></i>
                    <Link href="#" className="text-decoration-none">
                      Services
                    </Link>
                  </li>
                  <li>
                    <i className="fa-solid fa-arrow-right"></i>
                    <Link href="#" className="text-decoration-none">
                      Faq
                    </Link>
                  </li>
                  <li>
                    <i className="fa-solid fa-arrow-right"></i>
                    <Link href="#" className="text-decoration-none">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-7">
              <div className="icon">
                <h4 className="heading">Contact Info</h4>
                <ul className="list-unstyled mb-0">
                  <li className="text">
                    <i className="fa-solid fa-phone-volume"></i>
                    <a href="tel:+61383766284" className="text-decoration-none">
                      +61 3 8376 6284
                    </a>
                  </li>
                  <li className="text">
                    <i className="fa-solid fa-envelope"></i>
                    <a href="mailto:info@chatnex.com" className="text-decoration-none">
                      info@chatnex.com
                    </a>
                  </li>
                  <li className="text">
                    <i className="fa-solid fa-location-dot"></i>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none address mb-0"
                    >
                      551 Swanston Street, Melbourne Victoria 3053 Australia
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-5 col-sm-12 col-12">
              <div className="email-form">
                <h4 className="heading">Newsletter Signup</h4>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group position-relative mb-0">
                    <input
                      type="text"
                      className="form_style"
                      placeholder="Enter Your Email Address"
                      name="email"
                    />
                    <button type="submit">
                      <i className="send fa-sharp fa-solid fa-paper-plane"></i>
                    </button>
                  </div>
                  <div className="form-group check-box mb-0">
                    <input type="checkbox" id="term" />
                    <label htmlFor="term">
                      I agree to the{" "}
                      <Link href="#">Privacy Policy</Link>.
                    </label>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p className="mb-0">Copyright © 2025 Aivio. All Rights Reserved.</p>
        </div>
      </div>
    </section>
  );
};
