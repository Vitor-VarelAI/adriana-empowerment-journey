import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Adriana Empowerment Journey",
  description: "Booking and empowerment journey platform",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-offwhite text-darkgray antialiased font-inter">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
