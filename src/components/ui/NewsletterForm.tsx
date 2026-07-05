"use client";

import React from "react";
import Link from "next/link";

export const NewsletterForm = () => {
  return (
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
          I agree to the <Link href="#">Privacy Policy</Link>.
        </label>
      </div>
    </form>
  );
};
