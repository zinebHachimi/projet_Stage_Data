import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { BackToTopButton } from "@/components/ui/BackToTopButton";
import { WowInitializer } from "@/components/ui/WowInitializer";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "AlgoJob AI | Plateforme de Data Gathering & Chatbot d'Offres d'Emploi",
  description: "Mise en place d'une solution de Data Gathering pour la collecte et le traitement des données pour offres d'emploi basée sur l'IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={urbanist.variable}>
      <head>
        {/* Font Awesome */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body className="min-h-full flex flex-col">
        <WowInitializer />
        {children}
        <BackToTopButton />
      </body>
    </html>
  );
}

