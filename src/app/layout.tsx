import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Replix Captions — Your content studio",
  description: "Editable word-by-word captions, social copy, and thumbnails for every post.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${archivoBlack.variable}`}>{children}</body>
    </html>
  );
}
