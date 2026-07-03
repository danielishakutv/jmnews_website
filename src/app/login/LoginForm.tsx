"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, Info } from "lucide-react";

type Status = "idle" | "submitting" | "info";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("That doesn't look like a valid email address.");
      return;
    }

    setStatus("submitting");
    // Simulate a network round-trip so the UI feels real.
    await new Promise((r) => setTimeout(r, 600));
    setStatus("info");
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-fg">
          Work email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@jmnews.ng"
            className="h-11 w-full rounded-lg border border-line-strong bg-surface pl-10 pr-3 text-sm text-fg shadow-sm outline-none transition-colors placeholder:text-fg-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-semibold text-fg">
            Password
          </label>
          <a href="#" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-11 w-full rounded-lg border border-line-strong bg-surface pl-10 pr-11 text-sm text-fg shadow-sm outline-none transition-colors placeholder:text-fg-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-fg-muted hover:bg-surface-2 hover:text-fg"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Remember me */}
      <label className="flex items-center gap-2 text-sm text-fg-muted">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="h-4 w-4 rounded border-line-strong text-brand-600 focus:ring-brand-500"
        />
        Keep me signed in on this device
      </label>

      {/* Validation error */}
      {error && (
        <p role="alert" className="rounded-lg border border-live/30 bg-live/5 px-3 py-2 text-sm font-medium text-live dark:text-red-400">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-700 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-800 disabled:opacity-70"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>

      {/* Post-submit notice — honest about backend not being wired yet */}
      {status === "info" && (
        <div className="flex gap-2 rounded-lg border border-azure-200 bg-azure-50 px-3 py-2.5 text-sm text-azure-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-azure-600" />
          <p>
            Staff authentication isn&apos;t connected yet. Reach out to{" "}
            <a href="mailto:newsroom@jmnews.ng" className="font-semibold underline">
              newsroom@jmnews.ng
            </a>{" "}
            for dashboard access.
          </p>
        </div>
      )}

      <p className="pt-2 text-center text-xs text-fg-muted">
        Authorised personnel only · All sign-in attempts are logged.
      </p>
    </form>
  );
}
