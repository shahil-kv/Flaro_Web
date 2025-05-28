// app/layout.tsx
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/context/ClientProviders";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
});

// Updated Metadata for SEO and Consistency
export const metadata: Metadata = {
  title: {
    default: "Flaro | Best B2B Application",
    template: "%s | Flaro",
  },
  description:
    "Flaro, founded by Adhil Ansari PV and co-founded by Shahil KV, offers a leading B2B platform for seamless business communication and productivity.",
  keywords: [
    "Flaro",
    "B2B platform",
    "productivity tools",
    "Adhil Ansari PV",
    "Shahil KV",
    "business communication",
    "remote work",
    "mass caller",
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
  openGraph: {
    title: "Flaro | Best B2B Collaboration Platform",
    description:
      "Flaro, founded by Adhil Ansari PV and co-founded by Shahil KV, provides top-tier tools for B2B communication and team productivity worldwide.",
    url: "https://www.flaro.co",
    siteName: "Flaro",
    images: [
      {
        url: "https://www.flaro.co/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Flaro B2B Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flaro | Best B2B Collaboration Platform",
    description:
      "Flaro, founded by Adhil Ansari PV and co-founded by Shahil KV, offers innovative B2B tools for teams.",
    images: ["https://www.flaro.co/og-image.jpg"],
    creator: "@flaro",
  },
  alternates: {
    canonical: "https://www.flaro.co",
    languages: {
      "en-US": "https://www.flaro.co/en",
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "your-google-site-verification-code", // Add if available
  },
};

// Structured Data (JSON-LD)
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Flaro",
      description:
        "Flaro is a leading B2B platform simplifying business communication and boosting productivity, founded by Adhil Ansari PV and co-founded by Shahil KV.",
      url: "https://www.flaro.co",
      logo: "https://www.flaro.co/logo.png",
      founder: [
        {
          "@type": "Person",
          name: "Adhil Ansari PV",
          jobTitle: "Founder",
        },
        {
          "@type": "Person",
          name: "Shahil KV",
          jobTitle: "Co-Founder",
        },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        email: "support@flaro.co",
        url: "https://www.flaro.co/contact",
      },
      sameAs: [
        "https://twitter.com/flaro",
        "https://www.linkedin.com/company/flaro",
        "https://facebook.com/flaro",
      ],
    },
    {
      "@type": "WebSite",
      name: "Flaro",
      url: "https://www.flaro.co",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.flaro.co/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="preload" href="/globals.css" as="style" />
        <link rel="preload" href="/favicon.ico" as="image" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className={`${openSans.variable} antialiased font-sans`}>
        <ClientProviders>
          <main role="main">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}