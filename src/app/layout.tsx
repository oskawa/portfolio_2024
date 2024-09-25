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
  title: "Portfolio Maxime Eloir",
  description: "Une sélection de projets prints et web réalisés pendant mes études et mon expérience professionnelle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bios.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
