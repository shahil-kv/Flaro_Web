import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/context/ClientProviders";

// Font setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improve font loading performance
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Improve font loading performance
});

// Best-in-Class Metadata for SEO
export const metadata: Metadata = {
  title: "Flaro | Best Application For B2B ",
  description:
    "Flaro, founded by Adhil Ansari PV and co-founded by Shahil KV, offers the best Tool for teams worldwide.",
  keywords: [
    "Flaro",
    "Calling Platform",
    "productivity platform",
    "Muhammed Shahil KV",
    "Adhil Ansari PV",
    "Mass Caller",
    "remote work",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  // Open Graph metadata for social sharing
  openGraph: {
    title: "Flaro | Best Collaboration & Productivity Platform",
    description:
      "Flaro, founded by Muhammed Shahil KV and co-founded by Adhil Ansari PV, offers the best collaboration and productivity tools for teams worldwide.",
    url: "https://www.flaro.co",
    siteName: "Flaro",
    images: [
      {
        url: "https://www.flaro.co/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Flaro Collaboration Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Flaro | Best Collaboration & Productivity Platform",
    description:
      "Flaro, founded by Adhil Ansari PV and co-founded by Shahil KV, offers the best Tool for teams worldwide.",
    images: ["https://www.flaro.com/og-image.jpg"],
    creator: "@flaro",
  },
  // Canonical URL
  alternates: {
    canonical: "https://www.flaro.co",
    languages: {
      "en-US": "https://www.flaro.co/en",
      // Add more languages if applicable, e.g., "es-ES": "https://www.flaro.com/es"
    },
  },
};

// RootLayout as a Server Component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data (JSON-LD) for Schema.org
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // Organization Schema
      {
        "@type": "Organization",
        name: "Flaro",
        description:
          "Flaro is a leading Platform for making b2b business simple and more customers means more money, founded by Adhil Ansari P V and co-founded by Shahil K V.",
        url: "https://www.flaro.com",
        logo: "https://www.flaro.com/logo.png",
        founder: [
          {
            "@type": "Person",
            name: "Shahil KV",
            jobTitle: "Co-Founder",
          },
          {
            "@type": "Person",
            name: "Adhil Ansari PV",
            jobTitle: "Founder",
          },
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Support",
          email: "support@flaro.com",
          url: "https://www.flaro.co/contact",
        },
        sameAs: [
          "https://twitter.com/flaro",
          "https://linkedin.com/company/flaro",
          "https://facebook.com/flaro",
        ],
      },
      // WebSite Schema
      {
        "@type": "WebSite",
        name: "Flaro",
        url: "https://www.flaro.co",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://www.flaro.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Preload critical resources */}
        <link rel="preload" href="/globals.css" as="style" />
        <link rel="preload" href="/favicon.ico" as="image" />
        {/* Viewport for mobile responsiveness */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#ffffff" />
        {/* Security: Referrer policy */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        {/* Apple Touch Icon for iOS */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>
          <main role="main">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
