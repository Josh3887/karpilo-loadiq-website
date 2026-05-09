"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "Information We Collect",
    body: `
Karpilo LoadIQ may collect information you provide directly, including your name, email address, company or fleet information, contact requests, launch inquiries, and waitlist submissions.

As the platform develops, LoadIQ may also collect operational inputs you enter into the application, including mileage, deadhead mileage, fuel cost, rate data, overhead assumptions, accessorials, operating cost, and profitability calculation data.
    `,
  },
  {
    title: "Operational Calculation Data",
    body: `
LoadIQ is designed to evaluate freight profitability and operational cost inputs. Calculation data may be used to generate estimates, improve platform functionality, troubleshoot errors, refine product features, and support user-requested services.

Users are responsible for the accuracy of information entered into the platform.
    `,
  },
  {
    title: "Device, Browser, and Usage Data",
    body: `
We may collect basic technical information such as browser type, device type, operating system, referring pages, pages viewed, session activity, approximate region, error logs, and general usage patterns.

This information helps us improve reliability, performance, security, and product experience.
    `,
  },
  {
    title: "Location Data",
    body: `
LoadIQ may support location-based or route-based features in the future. If location-related functionality is introduced, location data will be collected only as needed to provide those services and subject to applicable platform permissions and user controls.
    `,
  },
  {
    title: "Payments and Subscriptions",
    body: `
If LoadIQ offers paid subscriptions, payments may be processed through third-party platforms such as Apple App Store, Google Play, Stripe, or similar providers.

Karpilo Endeavor Technologies LLC does not intend to directly store full payment card numbers. Payment processing will be governed by the applicable processor’s privacy and billing policies.
    `,
  },
  {
    title: "How We Use Information",
    body: `
Information may be used to:
- provide LoadIQ services
- respond to inquiries
- manage early-access or founding operator programs
- improve calculations and product functionality
- analyze platform performance
- detect errors or abuse
- support subscriptions and account access
- communicate product updates
- comply with legal obligations
    `,
  },
  {
    title: "Data Sharing",
    body: `
We do not sell personal information.

Information may be shared with service providers that help operate the platform, including hosting providers, analytics providers, email systems, payment processors, customer support tools, and security services.

Information may also be disclosed if required by law, legal process, fraud prevention, security protection, or protection of company rights.
    `,
  },
  {
    title: "Cookies and Local Storage",
    body: `
LoadIQ may use cookies, local storage, session storage, or similar technologies to support site functionality, analytics, preferences, security, and product performance.

Users may control certain browser storage options through their browser settings.
    `,
  },
  {
    title: "Data Security",
    body: `
Karpilo Endeavor Technologies LLC intends to use reasonable administrative, technical, and organizational safeguards to protect information.

No system can be guaranteed completely secure. Users should avoid submitting unnecessary sensitive personal information through general contact forms.
    `,
  },
  {
    title: "User Choices",
    body: `
Users may request access, correction, deletion, or limitation of personal information by contacting Karpilo Endeavor Technologies LLC.

Certain records may need to be retained for legal, security, operational, billing, or legitimate business purposes.
    `,
  },
  {
    title: "Children’s Privacy",
    body: `
LoadIQ is intended for business and transportation professionals. It is not intended for children or users under the age required by applicable law.
    `,
  },
  {
    title: "Updates to This Policy",
    body: `
This Privacy Policy may be updated as LoadIQ develops, launches, expands features, adds subscriptions, integrates mobile applications, or changes service providers.

The latest version will be posted on this page.
    `,
  },
  {
    title: "Contact Information",
    body: `
Karpilo Endeavor Technologies LLC

Website:
www.karpiloendeavortechnologies.com

Contact:
karpiloloadiq@karpiloendeavortechnologies.com
    `,
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(239,68,68,0.12),transparent_26%),linear-gradient(to_bottom,#020617,#020617)]" />
        <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-5xl px-6 py-20 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="inline-flex rounded-full border border-sky-300/30 bg-sky-400/10 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-200">
            Privacy Policy
          </div>

          <h1 className="mt-8 text-5xl font-black tracking-[-0.06em] sm:text-6xl">
            Karpilo LoadIQ Privacy Policy
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
            This Privacy Policy explains how Karpilo Endeavor Technologies LLC
            may collect, use, protect, and disclose information related to
            Karpilo LoadIQ.
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-[2rem] border border-white/10 bg-[#0B1120]/80 p-8 shadow-[0_0_34px_rgba(56,189,248,0.06)]"
            >
              <h2 className="text-2xl font-black tracking-[-0.03em] text-white">
                {section.title}
              </h2>

              <div className="mt-5 whitespace-pre-line leading-8 text-slate-300">
                {section.body}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 rounded-[2rem] border border-sky-300/20 bg-sky-400/5 p-8">
          <p className="text-sm leading-7 text-slate-400">
            This Privacy Policy is a launch-stage policy framework and may be
            revised as LoadIQ adds accounts, subscriptions, mobile app features,
            analytics, payment processing, or additional operational modules.
          </p>
        </div>
      </section>
    </main>
  );
}