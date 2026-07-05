"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleNavbar = () => {
    setNavbarCollapsed(!navbarCollapsed);
  };

  const toggleDropdown = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // Helper to determine if link is active
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="w-100 float-left header-con position-relative main-box">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link className="navbar-brand" href="/">
            <figure className="mb-0">
              <Image
                src="/assets/images/logo.png"
                alt="logo-icon"
                width={290}
                height={82}
                priority
              />
            </figure>
          </Link>
          <button
            className={`navbar-toggler ${navbarCollapsed ? "collapsed" : ""}`}
            type="button"
            aria-controls="navbarSupportedContent"
            aria-expanded={!navbarCollapsed}
            aria-label="Toggle navigation"
            onClick={toggleNavbar}
          >
            <span className="navbar-toggler-icon"></span>
            <span className="navbar-toggler-icon"></span>
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div
            className={`collapse navbar-collapse ${!navbarCollapsed ? "show" : ""}`}
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link
                  className={`nav-link p-0 ${isActive("/") ? "active" : ""}`}
                  href="/"
                >
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link p-0 ${isActive("/about") ? "active" : ""}`}
                  href="/about"
                >
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link p-0" href="#">
                  Services
                </Link>
              </li>

              <li className={`nav-item dropdown ${activeDropdown === "blog" ? "show" : ""}`}>
                <a
                  className="nav-link dropdown-toggle p-0"
                  href="#"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={activeDropdown === "blog"}
                  onClick={(e) => toggleDropdown("blog", e)}
                >
                  Blog
                </a>
                <div className={`dropdown-menu ${activeDropdown === "blog" ? "show" : ""}`}>
                  <Link className="dropdown-item" href="#">Blog</Link>
                  <Link className="dropdown-item" href="#">Load More</Link>
                  <Link className="dropdown-item" href="#">Single Blog</Link>
                  <Link className="dropdown-item" href="#">One Column</Link>
                  <Link className="dropdown-item" href="#">Two Column</Link>
                  <Link className="dropdown-item" href="#">Three Column</Link>
                  <Link className="dropdown-item" href="#">Three Column Sidebar</Link>
                  <Link className="dropdown-item" href="#">Four Column</Link>
                  <Link className="dropdown-item" href="#">Six Column</Link>
                </div>
              </li>
              <li className={`nav-item dropdown ${activeDropdown === "pages" ? "show" : ""}`}>
                <a
                  className="nav-link dropdown-toggle p-0"
                  href="#"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={activeDropdown === "pages"}
                  onClick={(e) => toggleDropdown("pages", e)}
                >
                  Pages
                </a>
                <div className={`dropdown-menu ${activeDropdown === "pages" ? "show" : ""}`}>
                  <Link className="dropdown-item" href="/about">About</Link>
                  <Link className="dropdown-item" href="#">Contact</Link>
                  <Link className="dropdown-item" href="#">Services</Link>
                  <Link className="dropdown-item" href="#">Faq&apos;s</Link>
                  <Link className="dropdown-item" href="#">Pricing</Link>
                  <Link className="dropdown-item" href="#">Team</Link>
                  <Link className="dropdown-item" href="#">404</Link>
                  <Link className="dropdown-item" href="#">Coming Soon</Link>
                  <Link className="dropdown-item" href="#">Testimonial</Link>
                  <Link className="dropdown-item" href="#">Privacy Policy</Link>
                </div>
              </li>
              <li className="nav-item">
                <Link className="nav-link p-0" href="#">
                  Pricing
                </Link>
              </li>
              <li className="nav-item free-trial">
                <Link className="nav-link font-weight-700" href="#">
                  Try Free Trial
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="header-contact">
            <ul className="list-unstyled mb-0 d-flex align-items-center">
              <li className="d-inline-block" style={{ marginRight: "22px" }}>
                <Link 
                  href="/login" 
                  className="nav-link p-0 font-weight-700 text-decoration-none"
                  style={{
                    color: "var(--e-global-color-primary)",
                    fontSize: "16px",
                    transition: "all 0.3s ease-in-out"
                  }}
                >
                  Login
                </Link>
              </li>
              <li className="d-inline-block">
                <Link href="#" className="contact-btn d-inline-block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};
