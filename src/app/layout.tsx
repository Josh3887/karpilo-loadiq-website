import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CookieConsentBanner } from "@/components/legal/cookie-consent-banner";
import { DriverSafetyAcknowledgment } from "@/components/legal/driver-safety-acknowledgment";
import { SystemHealthBanner } from "@/components/system/system-health-banner";
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
  title: "Karpilo Endeavor Technologies | LoadIQ",
  description:
    "Transportation software, freight profitability intelligence, and operational SaaS systems from Karpilo Endeavor Technologies LLC.",
  metadataBase: new URL(LOADIQ_URLS.website),
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
