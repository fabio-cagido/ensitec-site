import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIChatWrapper from "@/components/AIChatWrapper";


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
    <ClerkProvider
      localization={ptBR}
      appearance={{
        variables: {
          colorPrimary: '#6366f1',
          borderRadius: '0.75rem',
        },
        elements: {
          formButtonPrimary:
            'bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold shadow-lg',
          card: 'shadow-xl',
          userButtonPopoverCard: 'shadow-xl border border-gray-200',
          userButtonPopoverActionButton: 'text-sm',
        },
      }}
    >
      <html lang="pt-BR">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <Header />
          {children}
          <Footer />
          <AIChatWrapper />


        </body>
      </html>
    </ClerkProvider>
  );
}
