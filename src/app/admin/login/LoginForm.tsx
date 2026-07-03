"use client";

import { useActionState, useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, Info, AlertCircle } from "lucide-react";
import { loginAction } from "@/lib/auth/actions";

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="mt-6 space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />

      {/* Username */}
      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-semibold text-fg">
          wp-admin username
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            placeholder="ojoma"
            className="h-11 w-full rounded-lg border border-line-strong bg-surface pl-10 pr-3 text-sm text-fg shadow-sm outline-none transition-colors placeholder:text-fg-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
      </div>

      {/* Application Password */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-semibold text-fg">
            Application Password
          </label>
          <a
            href="https://wordpress.org/documentation/article/application-passwords/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            How to create one
          </a>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
            className="h-11 w-full rounded-lg border border-line-strong bg-surface pl-10 pr-11 font-mono text-sm text-fg shadow-sm outline-none transition-colors placeholder:font-sans placeholder:text-fg-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
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
        <p className="mt-1.5 text-xs text-fg-muted">
          Spaces are fine — they&apos;re stripped automatically.
        </p>
      </div>

      {/* Error */}
      {state?.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-live/30 bg-live/5 px-3 py-2 text-sm font-medium text-live dark:text-red-400"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-700 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-800 disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
          </>
        ) : (
          "Sign in"
        )}
      </button>

      <div className="flex gap-2 rounded-lg border border-azure-200 bg-azure-50 px-3 py-2.5 text-xs text-azure-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-azure-600" />
        <p>
          Sign-in is verified against WordPress. Generate a dedicated
          Application Password (Users → Profile → Application Passwords) and
          paste it above — your main wp-admin password is not used.
        </p>
      </div>
    </form>
  );
}
