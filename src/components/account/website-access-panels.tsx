"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { LOADIQ_CONTACT, LOADIQ_ROUTES, LOADIQ_URLS } from "@/config/loadiq";
import { supabase } from "@/lib/supabase";

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

function useWebsiteUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      const { data } = await supabase.auth.getUser();

      if (active) {
        setUser(data.user);
        setLoading(false);
      }
    }

    void loadUser();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
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

export function WebsiteLoginPanel() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<PanelState>(initialPanelState);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, message: null, error: null });

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
      message: "Signed in. Opening Account Settings...",
      error: null,
    });
    router.push(LOADIQ_ROUTES.accountSettings);
  }

  return (
    <AccessShell
      eyebrow="Website Login"
      title="Sign in to Karpilo LoadIQ"
      description="Use the same Supabase identity that connects your website access, reservations, billing support, and protected app dashboard."
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
          <Link href={LOADIQ_ROUTES.signup} className="font-bold text-sky-200">
            Create Karpilo LoadIQ access
          </Link>
        </p>
      </form>
    </AccessShell>
  );
}

export function WebsiteSignupPanel() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<PanelState>(initialPanelState);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, message: null, error: null });

    const redirectTo = `${window.location.origin}${LOADIQ_ROUTES.accountSettings}`;
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          source: "website_signup",
          product: "Karpilo LoadIQ",
        },
      },
    });

    if (error) {
      setState({ loading: false, message: null, error: error.message });
      return;
    }

    setState({
      loading: false,
      message:
        "Signup started. Check your email if confirmation is required, then return to Account Settings.",
      error: null,
    });
    router.refresh();
  }

  return (
    <AccessShell
      eyebrow="Website Signup"
      title="Create Karpilo LoadIQ access"
      description="Signup uses the shared Supabase Auth identity. Reservation, pricing lock, and billing rules remain separate server-controlled records."
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
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={setPassword}
        />
        <FormStatus state={state} />
        <button
          type="submit"
          disabled={state.loading}
          className="rounded-2xl border border-sky-300/35 bg-sky-400/15 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-sky-100 transition hover:bg-sky-400/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state.loading ? "Creating Access..." : "Signup"}
        </button>
        <Link
          href={LOADIQ_ROUTES.pilotProgram}
          className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-red-100 transition hover:bg-red-500/20"
        >
          Reserve Pilot Eligibility
        </Link>
      </form>
    </AccessShell>
  );
}

export function WebsiteAccountSettingsPanel() {
  const { user, loading } = useWebsiteUser();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [state, setState] = useState<PanelState>(initialPanelState);

  async function updateEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, message: null, error: null });

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
        </div>
      ) : (
        <div className="grid gap-4">
          <p className="text-sm leading-6 text-slate-400">
            Sign in to manage website-side account settings for the shared
            Karpilo LoadIQ identity.
          </p>
          <Link
            href={LOADIQ_ROUTES.login}
            className="rounded-2xl border border-sky-300/35 bg-sky-400/15 px-5 py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-sky-100"
          >
            Login
          </Link>
        </div>
      )}
    </AccessShell>
  );
}

export function WebsiteBillingPanel() {
  const { user, loading } = useWebsiteUser();

  return (
    <AccessShell
      eyebrow="Billing Command"
      title="Manage Karpilo LoadIQ billing"
      description="Website billing access uses the same account email, Supabase user, and Stripe subscription assumptions as the app. No second billing identity is created."
    >
      {loading ? (
        <p className="text-sm font-bold text-slate-400">Checking session...</p>
      ) : (
        <div className="grid gap-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Billing Identity
            </p>
            <p className="mt-2 text-lg font-black text-white">
              {user?.email ?? "Login required"}
            </p>
          </div>
          <p className="text-sm leading-6 text-slate-400">
            Stripe customer portal wiring was not present in this WEBSITE repo.
            This page keeps billing access website-side and routes subscription
            help through the existing support channel until portal automation is
            approved.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href={user ? LOADIQ_ROUTES.subscriptionHelp : LOADIQ_ROUTES.login}
              className="rounded-2xl border border-sky-300/35 bg-sky-400/15 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-sky-100"
            >
              {user ? "Subscription Help" : "Login"}
            </Link>
            <Link
              href={`${LOADIQ_URLS.app}/dashboard`}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-200"
            >
              Open Karpilo LoadIQ Dashboard
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
      description="Send subscription, invoice, refund review, or access questions through the existing website support intake and email audit path."
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
