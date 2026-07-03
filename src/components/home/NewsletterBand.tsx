import { Mail, CheckCircle2 } from "lucide-react";

export default function NewsletterBand() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 lg:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700 px-6 py-10 shadow-lg sm:px-12 sm:py-14">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-azure-500/20" />

        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div className="text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <Mail className="h-3.5 w-3.5" /> The JM Brief
            </span>
            <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
              Nigeria&apos;s top stories, every morning.
            </h2>
            <p className="mt-2 max-w-md text-white/85">
              Join thousands of readers who start their day with the news that matters — politics,
              business, sports and more, distilled in a five-minute read.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
              {["Free forever", "No spam", "Unsubscribe anytime"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="you@example.com"
              aria-label="Email address"
              className="h-12 flex-1 rounded-full border-0 bg-surface px-5 text-sm text-fg shadow-sm placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-azure-400"
            />
            <button
              type="submit"
              className="h-12 shrink-0 rounded-full bg-ink px-6 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Subscribe Free
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
