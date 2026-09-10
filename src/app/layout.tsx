import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/features/auth/store/auth-store";
import { AuthModal } from "@/features/auth/components/auth-modal";
import { CookieBanner } from "@/shared/components/cookie-banner";

const inter = localFont({
  src: "../../public/fonts/Inter-Variable.ttf",
  variable: "--font-inter",
  display: "swap",
  preload: true,
  weight: "400 600",
});

const archivoBlack = localFont({
  src: "../../public/fonts/ArchivoBlack-Regular.ttf",
  variable: "--font-archivo-black",
  display: "swap",
  preload: true,
  weight: "400",
});

export const metadata: Metadata = {
  title: "EveryKaptions — Captions for every creator",
  description: "Editable multilingual captions and clean subtitle exports for every post.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${archivoBlack.variable}`}>
        <AuthProvider>
          {children}
          <AuthModal />
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
