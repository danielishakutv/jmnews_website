"use client";

import { useActionState, useEffect, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, Save } from "lucide-react";
import {
  updateSettingsAction,
  type SettingsActionResult,
} from "./actions";

interface InitialValues {
  title: string;
  description: string;
  url: string;
  email: string;
}

export default function SettingsForm({ initial }: { initial: InitialValues }) {
  const [state, formAction, pending] = useActionState<
    SettingsActionResult | undefined,
    FormData
  >(updateSettingsAction, undefined);

  // Hide the success banner a few seconds after a save so the UI doesn't
  // stay stuck on a stale confirmation if the user keeps editing.
  const [showSuccess, setShowSuccess] = useState(false);
  useEffect(() => {
    if (state?.ok) {
      setShowSuccess(true);
      const id = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(id);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <Field
        id="title"
        label="Site title"
        helper="Shown in the browser tab, OG tags, and the site header."
        defaultValue={initial.title}
        required
      />
      <Field
        id="description"
        label="Tagline"
        helper={'Short slogan — appears below the title in metadata (e.g. "Nigeria & The World, As It Happens").'}
        defaultValue={initial.description}
      />
      <Field
        id="url"
        label="Public URL"
        helper="The canonical address of the public site. Must start with https://."
        defaultValue={initial.url}
        type="url"
        inputMode="url"
      />
      <Field
        id="email"
        label="Admin email"
        helper="WP uses this for system notifications. Not shown publicly."
        defaultValue={initial.email}
        type="email"
        inputMode="email"
      />

      {/* Status banners */}
      {state && !state.ok && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-live/30 bg-live/5 px-3 py-2.5 text-sm font-medium text-live dark:text-red-400"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}
      {showSuccess && state?.ok && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-800"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Saved. The public site will reflect the change on the next request.</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-line pt-5">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-700 px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-800 disabled:opacity-70"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  helper,
  defaultValue,
  required = false,
  type = "text",
  inputMode,
}: {
  id: string;
  label: string;
  helper?: string;
  defaultValue: string;
  required?: boolean;
  type?: string;
  inputMode?: "url" | "email" | "text";
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-fg">
        {label}
        {required && <span className="ml-1 text-live dark:text-red-400">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        defaultValue={defaultValue}
        required={required}
        className="h-11 w-full rounded-lg border border-line-strong bg-surface px-3.5 text-sm text-fg shadow-sm outline-none transition-colors placeholder:text-fg-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
      />
      {helper && (
        <p className="mt-1.5 text-xs text-fg-muted">{helper}</p>
      )}
    </div>
  );
}
