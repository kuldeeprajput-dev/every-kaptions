import type { Metadata } from "next";
import { Inter, Archivo_Black } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth/store/auth-store";
import { AuthModal } from "@/features/auth/components/auth-modal";
import { CookieBanner } from "@/shared/components/cookie-banner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EveryKaptions — Captions for every creator",
  description: "Editable multilingual captions and clean subtitle exports for every post.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${archivoBlack.variable}`}>
      <body>
        <AuthProvider>
          {children}
          <AuthModal />
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
