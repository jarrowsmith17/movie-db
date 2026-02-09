import type { Metadata } from "next";
import SessionWrapper from '@/components/SessionWrapper';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import NextTopLoader from 'nextjs-toploader';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie-db app",
  description: "Personal project to run a letterboxd clone.",
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader 
          color="#EAB308" 
          initialPosition={0.08} 
          crawlSpeed={200} 
          height={3} 
          showSpinner={false} 
          easing="ease" 
          speed={200} 
        />
        <SessionWrapper>
          {children}
        </SessionWrapper>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
