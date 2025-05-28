import type { Metadata } from "next";
import { Open_Sans, } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"], // Include weights you need
  style: ["normal", "italic"], // Include styles if needed
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
    <html
      lang="en"
      className="light"
      style={{ colorScheme: "light" }}
      suppressHydrationWarning
    >
      <body className={`${openSans.variable} antialiased font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
