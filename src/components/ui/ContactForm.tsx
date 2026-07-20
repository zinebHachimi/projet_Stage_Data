"use client";

import React, { useState } from "react";

export const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setError("");
    setSubmitted(true);
    // Clear inputs after submit
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="contact-form-wrapper p-4 p-md-5 bg-white rounded-4 shadow-sm border border-slate-100" style={{ borderRadius: "24px" }}>
      {submitted ? (
        <div className="text-center py-5">
          <div 
            className="d-inline-flex align-items-center justify-content-center text-white rounded-circle mb-4 animate-bounce"
            style={{
              width: "70px",
              height: "70px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              fontSize: "30px",
              boxShadow: "0 10px 20px rgba(16, 185, 129, 0.2)"
            }}
          >
            <i className="fa-solid fa-check"></i>
          </div>
          <h3 className="font-weight-bold text-slate-800 mb-2">Message Envoyé !</h3>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: "400px" }}>
            Merci de nous avoir contactés. Notre équipe commerciale ou technique vous répondra dans les plus brefs délais (généralement sous 24h).
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="btn btn-primary px-4 py-2 text-xs font-semibold rounded-pill transition"
            style={{ borderRadius: "30px", fontSize: "13px" }}
          >
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="row g-3">
          <h3 className="font-weight-bold text-slate-800 mb-4 text-left" style={{ fontSize: "22px" }}>Écrivez-nous</h3>
          
          {error && (
            <div className="col-12 mb-3">
              <div className="alert alert-danger text-xs font-semibold py-2 px-3 rounded-3" role="alert">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                {error}
              </div>
            </div>
          )}

          <div className="col-md-6 mb-3 text-left">
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 d-block">Nom Complet *</label>
            <input
              type="text"
              required
              placeholder="Ex: Alice Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control px-4 py-2.5 text-sm bg-light border-0 focus:bg-white transition"
              style={{
                borderRadius: "12px",
                fontSize: "14px",
                border: "1px solid #dfe5ef",
                outline: "none",
                transition: "all 0.3s ease"
              }}
            />
          </div>

          <div className="col-md-6 mb-3 text-left">
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 d-block">Adresse E-mail *</label>
            <input
              type="email"
              required
              placeholder="Ex: alice@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control px-4 py-2.5 text-sm bg-light border-0 focus:bg-white transition"
              style={{
                borderRadius: "12px",
                fontSize: "14px",
                border: "1px solid #dfe5ef",
                outline: "none",
                transition: "all 0.3s ease"
              }}
            />
          </div>

          <div className="col-12 mb-3 text-left">
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 d-block">Sujet du Message *</label>
            <input
              type="text"
              required
              placeholder="Ex: Demande de démonstration / Partenariat"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="form-control px-4 py-2.5 text-sm bg-light border-0 focus:bg-white transition"
              style={{
                borderRadius: "12px",
                fontSize: "14px",
                border: "1px solid #dfe5ef",
                outline: "none",
                transition: "all 0.3s ease"
              }}
            />
          </div>

          <div className="col-12 mb-4 text-left">
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 d-block">Votre Message *</label>
            <textarea
              required
              rows={5}
              placeholder="Comment pouvons-nous vous aider ?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-control px-4 py-3 text-sm bg-light border-0 focus:bg-white transition"
              style={{
                borderRadius: "16px",
                fontSize: "14px",
                border: "1px solid #dfe5ef",
                outline: "none",
                resize: "none",
                transition: "all 0.3s ease"
              }}
            />
          </div>

          <div className="col-12 text-left">
            <button
              type="submit"
              className="btn btn-primary px-5 py-3 text-sm font-bold text-white transition"
              style={{
                borderRadius: "30px",
                background: "linear-gradient(135deg, #5d87ff 0%, #007bff 100%)",
                border: "none",
                boxShadow: "0 4px 15px rgba(93, 135, 255, 0.2)",
                fontSize: "14px"
              }}
            >
              Envoyer le Message
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
