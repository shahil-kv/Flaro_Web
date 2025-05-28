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
  title: "Flaro | AI-Powered Bulk Calling for Marketing & Events",
  description:
    "Flaro is a powerful bulk calling system designed for marketing teams and event organizers. Call thousands of contacts with one click, track results with advanced reports and analytics, and stay tuned for our upcoming AI call assistant.",
  keywords: [
    "bulk calling software",
    "mass calling system",
    "event marketing tools",
    "AI calling assistant",
    "contact group calling",
    "call analytics dashboard",
    "marketing automation",
    "Flaro SaaS",
    "call center automation",
    "voice broadcast software"
  ],
  openGraph: {
    title: "Flaro | AI-Powered Bulk Calling for Marketing & Events",
    description:
      "Reach 300+ contacts with a single click. Flaro helps marketing teams and event organizers run efficient calling campaigns with real-time analytics and smart automation.",
    url: "https://flaro.co", // replace with your actual domain
    type: "website",
    images: [
      {
        url: "https://flaro.co/images/preview.png", // replace with your image
        alt: "Flaro Bulk Calling Dashboard",
      },
    ],
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
        {children}
      </body>
    </html>
  );
}
