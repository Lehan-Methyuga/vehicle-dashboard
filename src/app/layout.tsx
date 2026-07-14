// =============================================================================
// Root Layout
// =============================================================================
//
// WHAT THIS FILE DOES:
//   This is the outermost wrapper for EVERY page in the app.
//   It sets up:
//   1. The <html> and <body> tags.
//   2. Fonts (Geist Sans + Geist Mono from Google Fonts via next/font).
//   3. SEO metadata (title, description).
//   4. The global CSS import.
//
// WHY next/font?
//   - Fonts are downloaded at BUILD time and served from our own domain.
//   - No external requests to Google Fonts at runtime = faster loads + privacy.
//   - The font files are automatically optimized and cached.
//
// WHY metadata EXPORT?
//   - Next.js reads this static object and generates <title>, <meta> tags etc.
//   - It's the recommended way to handle SEO in the App Router.
// =============================================================================

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vehicle Dashboard | NHTSA Vehicle Explorer",
  description:
    "Search and explore vehicle models from the U.S. National Highway Traffic Safety Administration database. Find vehicles by make and model year.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
