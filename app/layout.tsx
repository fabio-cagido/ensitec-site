import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EnsiTec BI",
  description: "Business Intelligence para Escolas - Transforme dados em decisões estratégicas",
  icons: {
    icon: [
      { url: "/favicon.jpg" },
      { url: "/favicon.ico" },
      { url: "/icon.png" }
    ],
    apple: "/favicon.jpg",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* AQUI é onde o Header precisa estar */}
        <Header />
        {children}
      </body>
    </html>
  );
}
