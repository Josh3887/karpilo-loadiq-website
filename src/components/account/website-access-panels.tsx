"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { LOADIQ_CONTACT, LOADIQ_ROUTES, LOADIQ_URLS } from "@/config/loadiq";
import {
  getSupabaseBrowserClient,
  hasSupabaseBrowserConfig,
} from "@/lib/supabase";

type PanelState = {
  loading: boolean;
  message: string | null;
  error: string | null;
};

const initialPanelState: PanelState = {
  loading: false,
  message: null,
  error: null,
};

const SUPABASE_UNAVAILABLE_MESSAGE =
  "Karpilo LoadIQ account access is temporarily unavailable. Please try again shortly.";
const PORTAL_UNAVAILABLE_MESSAGE =
  "Subscription management is temporarily unavailable. Please contact support.";

function useWebsiteUser() {
  const accountAccessUnavailable = !hasSupabaseBrowserConfig();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!accountAccessUnavailable);

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const client = supabase;

    async function loadUser() {
      const { data } = await client.auth.getUser();

      if (active) {
        setUser(data.user);
        setLoading(false);
      }
    }

    void loadUser();

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { user, loading, accountAccessUnavailable };
}

function AccessShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#020617] px-6 py-14 text-white sm:px-8">
      <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="pt-3">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-300">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
            {description}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-sky-300/20 bg-[#07101E]/95 p-6 shadow-[0_0_54px_rgba(56,189,248,0.12)]">
          {children}
        </div>
      </section>
    </main>
  );
}

function FormStatus({ state }: { state: PanelState }) {
  if (state.error) {
    return (
      <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">
        {state.error}
      </p>
    );
  }

  if (state.message) {
    return (
      <p className="rounded-2xl border border-sky-300/25 bg-sky-400/10 px-4 py-3 text-sm font-bold text-sky-100">
        {state.message}
      </p>
    );
  }

  return null;
}

async function getWebsiteAccessToken() {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error(SUPABASE_UNAVAILABLE_MESSAGE);
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    throw new Error("Login is required before account changes can be submitted.");
  }

  return session.access_token;
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  minLength,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-200">
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/45"
      />
    </label>
  );
}

function WebsiteBillingPortalButton() {
  const [state, setState] = useState<PanelState>(initialPanelState);

  async function openPortal() {
    try {
      setState({
        loading: true,
        message: "Opening subscription management...",
        error: null,
      });

      const token = await getWebsiteAccessToken();
      const response = await fetch("/api/billing/portal", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = (await response.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.url) {
        setState({
          loading: false,
          message: null,
          error: data.error ?? PORTAL_UNAVAILABLE_MESSAGE,
        });
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      setState({
        loading: false,
        message: null,
        error:
          error instanceof Error ? error.message : PORTAL_UNAVAILABLE_MESSAGE,
      });
    }
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        disabled={state.loading}
        onClick={openPortal}
        className="rounded-2xl border border-sky-300/35 bg-sky-400/15 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-sky-100 transition hover:bg-sky-400/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Manage Subscription
      </button>
      <FormStatus state={state} />
    </div>
  );
}

function WebsiteAccountDeletionPanel({ userEmail }: { userEmail: string }) {
  const [contactEmail, setContactEmail] = useState(userEmail);
  const [reason, setReason] = useState("");
  const [requestedScope, setRequestedScope] = useState<
    "account_and_data" | "data_only"
  >("account_and_data");
  const [acknowledgedSubscriptionWarning, setAcknowledgedSubscriptionWarning] =
    useState(false);
  const [confirmationPhrase, setConfirmationPhrase] = useState("");
  const [state, setState] = useState<PanelState>(initialPanelState);

  async function submitDeletionRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, message: null, error: null });

    try {
      const token = await getWebsiteAccessToken();
      const response = await fetch("/api/account/deletion-request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactEmail,
          reason,
          requestedScope,
          acknowledgedSubscriptionWarning,
          confirmationPhrase,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setState({
          loading: false,
          message: null,
          error: data.error ?? "Unable to submit account deletion request.",
        });
        return;
      }

      setReason("");
      setConfirmationPhrase("");
      setAcknowledgedSubscriptionWarning(false);
      setState({
        loading: false,
        message:
          "Deletion request received. Account deletion and subscription cancellation remain separate review paths.",
        error: null,
      });
    } catch (error) {
      setState({
        loading: false,
        message: null,
        error:
          error instanceof Error
            ? error.message
            : "Unable to submit account deletion request.",
      });
    }
  }

  return (
    <form
      onSubmit={submitDeletionRequest}
      className="grid gap-4 rounded-2xl border border-red-400/25 bg-red-500/10 p-4"
    >
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-red-200">
          Danger Zone
        </p>
        <h2 className="mt-2 text-xl font-black text-white">
          Request account deletion
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Deleting your account may remove access to saved loads, profiles,
          settings, and account history. Subscription cancellation is handled
          separately through billing management unless already canceled.
        </p>
      </div>

      <Field
        label="Contact email"
        name="deletion_contact_email"
        type="email"
        required
        value={contactEmail}
        onChange={setContactEmail}
      />

      <label className="grid gap-2 text-sm font-bold text-slate-200">
        Request scope
        <select
          value={requestedScope}
          onChange={(event) =>
            setRequestedScope(
              event.target.value as "account_and_data" | "data_only",
            )
          }
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-white outline-none transition focus:border-sky-300/45"
        >
          <option value="account_and_data">Delete account and app data</option>
          <option value="data_only">Delete app data where possible</option>
        </select>
      </label>

      <label className="grid gap-2 text-sm font-bold text-slate-200">
        Optional context
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="min-h-28 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/45"
        />
      </label>

      <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">
        <input
          type="checkbox"
          checked={acknowledgedSubscriptionWarning}
          onChange={(event) =>
            setAcknowledgedSubscriptionWarning(event.target.checked)
          }
          className="mt-1 h-4 w-4 accent-red-300"
        />
        <span>
          I understand account deletion does not automatically cancel active
          subscriptions with Stripe, Apple, or Google, and some records may be
          retained for legal, billing, fraud prevention, tax, dispute, or
          security reasons.
        </span>
      </label>

      <Field
        label="Type DELETE to confirm"
        name="deletion_confirmation"
        required
        value={confirmationPhrase}
        onChange={setConfirmationPhrase}
      />

      <FormStatus state={state} />

      <button
        type="submit"
        disabled={
          state.loading ||
          !contactEmail ||
          !acknowledgedSubscriptionWarning ||
          confirmationPhrase.trim() !== "DELETE"
        }
        className="rounded-2xl border border-red-300/40 bg-red-500/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-red-100 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit Deletion Request
      </button>
    </form>
  );
}

export function WebsiteLoginPanel() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<PanelState>(initialPanelState);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, message: null, error: null });
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setState({
        loading: false,
        message: null,
        error: SUPABASE_UNAVAILABLE_MESSAGE,
      });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setState({ loading: false, message: null, error: error.message });
      return;
    }

    setState({
      loading: false,
      message: "Signed in. Opening the app portal...",
      error: null,
    });
    router.push(LOADIQ_URLS.app);
  }

  return (
    <AccessShell
      eyebrow="Website Login"
      title="Sign in to Karpilo LoadIQ"
      description="Use the same Supabase identity that connects website access, reservations, account settings, subscription support, and future mobile app readiness."
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={setEmail}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={setPassword}
        />
        <FormStatus state={state} />
        <button
          type="submit"
          disabled={state.loading}
          className="rounded-2xl border border-sky-300/35 bg-sky-400/15 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-sky-100 transition hover:bg-sky-400/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state.loading ? "Signing In..." : "Login"}
        </button>
        <p className="text-sm text-slate-400">
          Need access?{" "}
          <Link href={LOADIQ_ROUTES.launch} className="font-bold text-sky-200">
            Request controlled access
          </Link>
        </p>
      </form>
    </AccessShell>
  );
}

export function WebsiteSignupPanel() {
  return (
    <AccessShell
      eyebrow="Controlled Access"
      title="Public signup is not currently available."
      description="Karpilo LoadIQ is preparing for controlled launch access. Operators may request access, view the public demo, or open the app portal if access has already been issued."
    >
      <div className="grid gap-5">
        <div className="rounded-2xl border border-red-400/25 bg-red-500/10 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-red-200">
            Access Status
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Early access is currently limited. Public signup is not available at
            this time, and launch access may be restricted by phase availability,
            approval status, and billing-provider readiness.
          </p>
        </div>
        <Link
          href={LOADIQ_ROUTES.launch}
          className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-4 text-center text-sm font-black uppercase tracking-[0.16em] text-red-100 transition hover:bg-red-500/20"
        >
          Request Access
        </Link>
        <Link
          href={LOADIQ_ROUTES.demo}
          className="rounded-2xl border border-sky-300/35 bg-sky-400/15 px-4 py-4 text-center text-sm font-black uppercase tracking-[0.16em] text-sky-100 transition hover:bg-sky-400/25"
        >
          View Demo
        </Link>
        <Link
          href={LOADIQ_URLS.app}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-4 text-center text-sm font-black uppercase tracking-[0.16em] text-slate-200 transition hover:border-sky-300/30"
        >
          Open Portal
        </Link>
        <p className="text-xs leading-5 text-slate-500">
          The portal may support issued accounts or restricted launch access.
          It should not be interpreted as open public subscription availability.
        </p>
      </div>
    </AccessShell>
  );
}

export function WebsiteAccountSettingsPanel() {
  const { user, loading, accountAccessUnavailable } = useWebsiteUser();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [state, setState] = useState<PanelState>(initialPanelState);

  async function updateEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, message: null, error: null });
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setState({
        loading: false,
        message: null,
        error: SUPABASE_UNAVAILABLE_MESSAGE,
      });
      return;
    }

    const { error } = await supabase.auth.updateUser({
      email: newEmail.trim().toLowerCase(),
    });

    setState({
      loading: false,
      message: error ? null : "Email update submitted. Check your inbox.",
      error: error?.message ?? null,
    });
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, message: null, error: null });
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setState({
        loading: false,
        message: null,
        error: SUPABASE_UNAVAILABLE_MESSAGE,
      });
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setState({
      loading: false,
      message: error ? null : "Password updated.",
      error: error?.message ?? null,
    });
    setNewPassword("");
  }

  async function signOut() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setState({
        loading: false,
        message: null,
        error: SUPABASE_UNAVAILABLE_MESSAGE,
      });
      return;
    }

    await supabase.auth.signOut();
    setState({
      loading: false,
      message: "Signed out of the Karpilo LoadIQ website.",
      error: null,
    });
  }

  return (
    <AccessShell
      eyebrow="Account Settings"
      title="Karpilo LoadIQ account identity"
      description="Website account settings use the shared Supabase Auth user. No separate website-only profile identity is created here."
    >
      {loading ? (
        <p className="text-sm font-bold text-slate-400">Checking session...</p>
      ) : accountAccessUnavailable ? (
        <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">
          {SUPABASE_UNAVAILABLE_MESSAGE}
        </p>
      ) : user ? (
        <div className="grid gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Signed In As
            </p>
            <p className="mt-2 text-lg font-black text-white">{user.email}</p>
          </div>

          <form className="grid gap-4" onSubmit={updateEmail}>
            <Field
              label="New email"
              name="new_email"
              type="email"
              autoComplete="email"
              required
              value={newEmail}
              onChange={setNewEmail}
            />
            <button
              type="submit"
              disabled={state.loading}
              className="rounded-2xl border border-sky-300/30 bg-sky-400/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-sky-100"
            >
              Update Email
            </button>
          </form>

          <form className="grid gap-4" onSubmit={updatePassword}>
            <Field
              label="New password"
              name="new_password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={newPassword}
              onChange={setNewPassword}
            />
            <button
              type="submit"
              disabled={state.loading}
              className="rounded-2xl border border-sky-300/30 bg-sky-400/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-sky-100"
            >
              Update Password
            </button>
          </form>

          <FormStatus state={state} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href={LOADIQ_ROUTES.billing}
              className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-200"
            >
              Manage Billing
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-100"
            >
              Logout
            </button>
          </div>

          <WebsiteAccountDeletionPanel userEmail={user.email ?? ""} />
        </div>
      ) : (
        <div className="grid gap-4">
          <p className="text-sm leading-6 text-slate-400">
            Sign in to manage website-side account settings for the shared
            Karpilo LoadIQ identity.
          </p>
          <Link
            href={LOADIQ_URLS.app}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-sky-300/35 bg-sky-400/15 px-5 py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-sky-100"
          >
            Open Portal
          </Link>
        </div>
      )}
    </AccessShell>
  );
}

export function WebsiteBillingPanel() {
  const { user, loading, accountAccessUnavailable } = useWebsiteUser();
  const billingChannels = [
    {
      title: "Website / Stripe Billing",
      description:
        "Website subscriptions are processed through Stripe. Stripe subscribers may manage payment method, invoices, cancellation, and plan billing through the Stripe billing portal when available.",
    },
    {
      title: "Apple App Store Billing",
      description:
        "Apple App Store subscriptions are managed by Apple. Karpilo LoadIQ cannot directly modify Apple App Store billing from the website.",
    },
    {
      title: "Google Play Billing",
      description:
        "Google Play subscriptions are managed by Google. Karpilo LoadIQ cannot directly modify Google Play billing from the website.",
    },
  ] as const;

  return (
    <AccessShell
      eyebrow="Website Billing"
      title="Stripe/web billing support only."
      description="The public website supports billing guidance and Stripe/web subscription management when available. App functionality, saved calculations, app settings, and user account experience belong in the app portal."
    >
      {loading ? (
        <p className="text-sm font-bold text-slate-400">Checking session...</p>
      ) : accountAccessUnavailable ? (
        <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">
          {SUPABASE_UNAVAILABLE_MESSAGE}
        </p>
      ) : (
        <div className="grid gap-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Website / Stripe Subscriber
            </p>
            <p className="mt-2 text-lg font-black text-white">
              {user?.email ?? "Stripe portal access appears only for eligible signed-in website subscribers."}
            </p>
          </div>
          <p className="text-sm leading-6 text-slate-400">
            Silver, Gold, Platinum, and Pro describe Karpilo LoadIQ
            decision-support depth. Website billing applies only to Stripe/web
            subscribers once subscription access is issued. Public signup and
            public checkout are not currently available.
          </p>
          <div className="grid gap-4 lg:grid-cols-3">
            {billingChannels.map((channel) => (
              <div
                key={channel.title}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-300">
                  {channel.title}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {channel.description}
                </p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {user ? <WebsiteBillingPortalButton /> : null}
            <Link
              href={LOADIQ_URLS.app}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-200"
            >
              Open Portal
            </Link>
            <Link
              href={LOADIQ_ROUTES.contact}
              className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-200"
            >
              Billing Support
            </Link>
          </div>
          <p className="text-xs leading-5 text-slate-500">
            Billing support:{" "}
            <a className="text-sky-200" href={`mailto:${LOADIQ_CONTACT.billingEmail}`}>
              {LOADIQ_CONTACT.billingEmail}
            </a>
          </p>
        </div>
      )}
    </AccessShell>
  );
}

export function WebsiteSubscriptionHelpPanel() {
  const { user } = useWebsiteUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<PanelState>(initialPanelState);

  async function submitHelp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, message: null, error: null });

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email: email || user?.email || "",
        role: "subscription-help",
        message,
        source: "subscription-help",
        intake_type: "billing_support",
      }),
    });

    if (!response.ok) {
      setState({
        loading: false,
        message: null,
        error: "Subscription help request could not be sent.",
      });
      return;
    }

    setState({
      loading: false,
      message: "Subscription help request sent.",
      error: null,
    });
    setName("");
    setMessage("");
  }

  return (
    <AccessShell
      eyebrow="Subscription Help"
      title="Karpilo LoadIQ billing support"
      description="Send subscription, invoice, refund review, account access, or trial questions through the existing website support intake and email audit path."
    >
      <form className="grid gap-5" onSubmit={submitHelp}>
        <Field
          label="Name"
          name="name"
          autoComplete="name"
          required
          value={name}
          onChange={setName}
        />
        <Field
          label="Account email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={setEmail}
        />
        <label className="grid gap-2 text-sm font-bold text-slate-200">
          Message
          <textarea
            name="message"
            required
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="min-h-36 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/45"
          />
        </label>
        <FormStatus state={state} />
        <button
          type="submit"
          disabled={state.loading}
          className="rounded-2xl border border-sky-300/35 bg-sky-400/15 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-sky-100 transition hover:bg-sky-400/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state.loading ? "Sending..." : "Send Subscription Help Request"}
        </button>
      </form>
    </AccessShell>
  );
}
