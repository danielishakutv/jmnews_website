import { Facebook, Twitter, Instagram, Youtube, Music2 } from "lucide-react";
import { site } from "@/lib/site";

const socials = [
  { href: site.socials.facebook, label: "Facebook", Icon: Facebook, count: "248K", color: "bg-[#1877f2]" },
  { href: site.socials.twitter, label: "X", Icon: Twitter, count: "192K", color: "bg-ink" },
  { href: site.socials.instagram, label: "Instagram", Icon: Instagram, count: "317K", color: "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]" },
  { href: site.socials.youtube, label: "YouTube", Icon: Youtube, count: "1.1M", color: "bg-[#ff0000]" },
  { href: site.socials.tiktok, label: "TikTok", Icon: Music2, count: "560K", color: "bg-ink" },
];

export default function FollowBox() {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <h2 className="mb-4 text-lg font-extrabold text-fg">Follow JM News</h2>
      <ul className="grid grid-cols-1 gap-2.5">
        {socials.map(({ href, label, Icon, count, color }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-line p-2 transition-colors hover:border-brand-300 hover:bg-brand-50/50"
            >
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white ${color}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-fg">{count}</span>
                <span className="block text-xs text-fg-muted">{label} followers</span>
              </span>
              <span className="shrink-0 rounded-full border border-brand-500 px-3 py-1 text-xs font-bold text-brand-600">
                Follow
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
