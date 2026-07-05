/* eslint-disable @next/next/no-css-tags */
import type { Metadata } from "next";
import "./globals.css";
import { BackToTopButton } from "@/components/ui/BackToTopButton";
import { WowInitializer } from "@/components/ui/WowInitializer";

export const metadata: Metadata = {
  title: "ChatNex | Intelligent Chatbot Platform",
  description: "Boost Conversations with Our Intelligent Chatbot Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Bootstrap CSS */}
        <link rel="stylesheet" href="/assets/bootstrap/bootstrap.min.css" />
        {/* Font Awesome */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        {/* Owl Carousel */}
        <link rel="stylesheet" href="/assets/css/owl.carousel.min.css" />
        <link rel="stylesheet" href="/assets/css/owl.theme.default.min.css" />
        {/* Animate.css */}
        <link rel="stylesheet" href="/assets/css/animate.css" />
        {/* Magnific Popup */}
        <link rel="stylesheet" href="/assets/css/magnific-popup.css" />
        {/* Custom Stylesheets */}
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/responsive.css" />
      </head>
      <body className="min-h-full flex flex-col">
        <WowInitializer />
        {children}
        <BackToTopButton />
      </body>
    </html>
  );
}
