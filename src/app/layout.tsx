import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CookieConsentBanner } from "@/components/legal/cookie-consent-banner";
import { DriverSafetyAcknowledgment } from "@/components/legal/driver-safety-acknowledgment";
import { SystemHealthBanner } from "@/components/system/system-health-banner";
import { BRAND } from "@/config/brand";
import { LOADIQ_URLS } from "@/config/loadiq";
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
  title: `${BRAND.companyName} | ${BRAND.shortName}`,
  description:
    "Transportation software, freight profitability intelligence, and operational SaaS systems from Karpilo Endeavor Technologies LLC.",
  metadataBase: new URL(LOADIQ_URLS.website),
  icons: {
    icon: [{ url: BRAND.appIcon, type: "image/png" }],
    apple: [{ url: BRAND.appIcon, type: "image/png" }],
    shortcut: [{ url: BRAND.appIcon, type: "image/png" }],
  },
  openGraph: {
    title: BRAND.productName,
    description:
      "Freight profitability intelligence, pilot onboarding, launch countdowns, and support for Karpilo LoadIQ.",
    url: LOADIQ_URLS.website,
    siteName: BRAND.productName,
    images: [
      {
        url: BRAND.cardImage,
        width: 1536,
        height: 1024,
        alt: BRAND.productName,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.productName,
    description:
      "Freight profitability intelligence and launch readiness for working operators.",
    images: [BRAND.cardImage],
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SystemHealthBanner />
        {children}
        <DriverSafetyAcknowledgment />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
