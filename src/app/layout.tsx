import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "bootstrap/dist/css/bootstrap-grid.css";

const bios = localFont({
  src: "./fonts/bios.woff",
  variable: "--bios",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Portfolio Maxime Eloir - Designer & Développeur Web",
  description:
    "Une sélection de projets prints et web réalisés pendant mes études et mon expérience professionnelle.",
  keywords: ["portfolio", "design", "développement web", "Maxime Eloir"],
  authors: [{ name: "Maxime Eloir" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Portfolio Maxime Eloir",
    description:
      "Une sélection de projets prints et web réalisés pendant mes études et mon expérience professionnelle.",
    type: "website",
    locale: "fr_FR",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
          rel="stylesheet"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className={`${bios.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
