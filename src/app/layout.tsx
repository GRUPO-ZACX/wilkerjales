import type { Metadata } from "next";
import {
  Libre_Baskerville,
  Montserrat,
  Rosarivo,
  Ubuntu,
} from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const editorialSerif = Libre_Baskerville({
  variable: "--font-editorial-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const siteSans = Ubuntu({
  variable: "--font-site-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const siteSerif = Rosarivo({
  variable: "--font-site-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Jales & Jales Advogados Associados",
    template: "%s",
  },
  description:
    "Soluções jurídicas eficientes, éticas e personalizadas em Brasília.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${editorialSerif.variable} ${siteSans.variable} ${siteSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
