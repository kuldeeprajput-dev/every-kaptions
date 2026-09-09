import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Replix Captions — Your content studio",
  description: "Editable word-by-word captions, social copy, and thumbnails for every post.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
