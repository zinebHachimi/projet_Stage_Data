"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface HeaderProps {
  user?: {
    name: string;
    email: string;
  } | null;
}

export const Header = ({ user = null }: HeaderProps) => {
  const pathname = usePathname();
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAvatarDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const toggleNavbar = () => {
    setNavbarCollapsed(!navbarCollapsed);
  };

  // Helper to determine if link is active
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const getInitials = (name: string) => {
    if (!name) return "C";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
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
            className={`navbar-collapse custom-navbar-collapse ${!navbarCollapsed ? "show" : ""}`}
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link
                  className={`nav-link p-0 ${isActive("/") ? "active" : ""}`}
                  href="/"
                >
                  Accueil
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link p-0 ${isActive("/services") ? "active" : ""}`}
                  href="/services"
                >
                  Services
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link p-0 ${isActive("/about") ? "active" : ""}`}
                  href="/about"
                >
                  À Propos
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link p-0 ${isActive("/contact") ? "active" : ""}`}
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="header-contact">
            <ul className="list-unstyled mb-0 d-flex align-items-center">
              {user ? (
                <li className="d-inline-block position-relative" ref={dropdownRef}>
                  <button
                    onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
                    className="border-0 bg-transparent p-0 d-flex align-items-center justify-content-center cursor-pointer"
                    style={{ outline: "none" }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center text-white font-weight-700 rounded-circle"
                      style={{
                        width: "45px",
                        height: "45px",
                        background: "linear-gradient(135deg, #155e75 0%, #007bff 100%)",
                        boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
                        border: "2px solid #ffffff",
                        fontSize: "14px",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {getInitials(user.name)}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {avatarDropdownOpen && (
                    <div
                      className="position-absolute dropdown-menu show"
                      style={{
                        right: 0,
                        top: "55px",
                        minWidth: "220px",
                        backgroundColor: "#ffffff",
                        borderRadius: "16px",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                        padding: "15px",
                        zIndex: 1000,
                        textAlign: "left"
                      }}
                    >
                      <div className="mb-2 pb-2 border-bottom">
                        <h6 className="font-weight-bold text-dark mb-1" style={{ fontSize: "14px" }}>
                          {user.name || "Candidat"}
                        </h6>
                        <span className="text-muted d-block text-truncate" style={{ fontSize: "12px" }}>
                          {user.email}
                        </span>
                      </div>
                      <Link
                        href="/"
                        className="dropdown-item py-2 px-1 text-dark text-decoration-none d-block rounded-2"
                        style={{ fontSize: "13px" }}
                        onClick={() => setAvatarDropdownOpen(false)}
                      >
                        <i className="fa-solid fa-house mr-2 text-primary"></i> Mon Espace
                      </Link>
                      <Link
                        href="/about"
                        className="dropdown-item py-2 px-1 text-dark text-decoration-none d-block rounded-2"
                        style={{ fontSize: "13px" }}
                        onClick={() => setAvatarDropdownOpen(false)}
                      >
                        <i className="fa-solid fa-circle-info mr-2 text-primary"></i> À Propos
                      </Link>
                      <div className="dropdown-divider my-2"></div>
                      <button
                        onClick={() => {
                          setAvatarDropdownOpen(false);
                          handleLogout();
                        }}
                        className="dropdown-item py-2 px-1 text-danger border-0 bg-transparent text-left w-100 rounded-2 cursor-pointer"
                        style={{ fontSize: "13px", outline: "none" }}
                      >
                        <i className="fa-solid fa-right-from-bracket mr-2"></i> Déconnexion
                      </button>
                    </div>
                  )}
                </li>
              ) : (
                <li className="d-inline-block">
                  <Link href="/login" className="contact-btn d-inline-block text-decoration-none font-weight-700">
                    Se Connecter
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

