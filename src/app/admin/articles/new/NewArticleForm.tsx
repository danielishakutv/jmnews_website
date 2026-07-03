"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Save,
  Send,
  CheckCircle2,
  AlertCircle,
  ImagePlus,
  ExternalLink,
} from "lucide-react";
import { createArticleAction, type NewArticleResult } from "./actions";
import type { WpCategory } from "@/lib/cms/wp-write";

export default function NewArticleForm({ categories }: { categories: WpCategory[] }) {
  const [state, formAction, pending] = useActionState<NewArticleResult | undefined, FormData>(
    createArticleAction,
    undefined
  );
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form action={formAction} className="space-y-6">
      {/* Success */}
      {state?.ok && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            {state.status === "publish"
              ? `Published “${state.title}”.`
              : `Saved “${state.title}” as a draft.`}
          </span>
          <a
            href={state.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-emerald-800 underline"
          >
            View <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
      {/* Error */}
      {state && !state.ok && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-live/30 bg-live/5 px-4 py-3 text-sm font-medium text-live dark:text-red-400"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-fg">
          Headline <span className="text-live dark:text-red-400">*</span>
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="e.g. NUJ Adamawa Condoles Police PRO Over Mother's Death"
          className="h-12 w-full rounded-lg border border-line-strong bg-surface px-3.5 text-base font-semibold text-fg shadow-sm outline-none transition-colors placeholder:font-normal placeholder:text-fg-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-semibold text-fg">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue=""
            className="h-11 w-full rounded-lg border border-line-strong bg-surface px-3 text-sm text-fg shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
          >
            <option value="">— Uncategorised —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="image" className="mb-1.5 block text-sm font-semibold text-fg">
            Featured image
          </label>
          <label
            htmlFor="image"
            className="flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-line-strong bg-surface-2 px-3 text-sm text-fg-muted transition-colors hover:border-brand-400 hover:text-fg"
          >
            <ImagePlus className="h-4 w-4" />
            {preview ? "Change image…" : "Choose an image…"}
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setPreview(f ? URL.createObjectURL(f) : null);
            }}
          />
        </div>
      </div>

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Featured preview"
          className="max-h-56 w-full rounded-xl object-cover ring-1 ring-line"
        />
      )}

      <div>
        <label htmlFor="excerpt" className="mb-1.5 block text-sm font-semibold text-fg">
          Excerpt <span className="font-normal text-fg-muted">(optional summary)</span>
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          placeholder="A one or two sentence summary for previews and search."
          className="w-full rounded-lg border border-line-strong bg-surface px-3.5 py-2.5 text-sm text-fg shadow-sm outline-none transition-colors placeholder:text-fg-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-1.5 block text-sm font-semibold text-fg">
          Story <span className="text-live dark:text-red-400">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={16}
          placeholder={"Write the full story here.\n\nLeave a blank line between paragraphs — each becomes its own paragraph on the site."}
          className="w-full rounded-lg border border-line-strong bg-surface px-3.5 py-3 text-[15px] leading-relaxed text-fg shadow-sm outline-none transition-colors placeholder:text-fg-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
        />
        <p className="mt-1.5 text-xs text-fg-muted">
          Blank line = new paragraph. Every story is bylined to the newsroom correspondent.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line pt-5">
        <button
          type="submit"
          name="intent"
          value="draft"
          disabled={pending}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-line-strong bg-surface px-5 text-sm font-bold text-fg transition-colors hover:bg-surface-2 disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save draft
        </button>
        <button
          type="submit"
          name="intent"
          value="publish"
          disabled={pending}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-700 px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-800 disabled:opacity-70"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Publish now
        </button>
      </div>
    </form>
  );
}
