import { Check } from "lucide-react";
import { getSite } from "@/lib/cms/site";

/** WhatsApp brand glyph (lucide ships no brand icons). */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default async function WhatsAppCTA() {
  const site = await getSite();
  return (
    <section className="mx-auto max-w-[1400px] px-4 lg:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1faf57] via-[#128C7E] to-[#075E54] px-6 py-10 shadow-lg sm:px-12 sm:py-14">
        {/* decorative glows */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-[#25D366]/30" />
        {/* oversized watermark glyph */}
        <WhatsAppIcon className="pointer-events-none absolute -right-6 bottom-0 hidden h-56 w-56 text-white/10 sm:block" />

        <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp Channel
            </span>
            <h2 className="mt-4 font-display text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Get breaking news on WhatsApp
            </h2>
            <p className="mt-3 max-w-xl text-base text-white/90 sm:text-lg">
              Join the {site.name} channel for instant alerts on the biggest stories in
              Nigeria and around the world — straight to your phone, free.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white/90">
              {["Breaking alerts first", "No spam, ever", "100% free"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={site.whatsappChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-2.5 rounded-full bg-white px-7 py-4 text-base font-extrabold text-[#075E54] shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-xl sm:text-lg"
          >
            <WhatsAppIcon className="h-6 w-6 text-[#25D366]" />
            Join the Channel
          </a>
        </div>
      </div>
    </section>
  );
}
