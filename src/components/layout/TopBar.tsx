"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Music2 } from "lucide-react";
import { site } from "@/lib/site";

const socials = [
  { href: site.socials.facebook, label: "Facebook", Icon: Facebook },
  { href: site.socials.twitter, label: "X (Twitter)", Icon: Twitter },
  { href: site.socials.instagram, label: "Instagram", Icon: Instagram },
  { href: site.socials.youtube, label: "YouTube", Icon: Youtube },
  { href: site.socials.tiktok, label: "TikTok", Icon: Music2 },
];

function useNowInLagos() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function greeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function TopBar() {
  const now = useNowInLagos();

  const dateLabel = now
    ? now.toLocaleDateString("en-NG", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Africa/Lagos",
      })
    : "";

  const timeLabel = now
    ? now.toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Africa/Lagos",
      })
    : "";

  const hour = now
    ? Number(
        now.toLocaleString("en-NG", {
          hour: "numeric",
          hour12: false,
          timeZone: "Africa/Lagos",
        })
      )
    : 9;

  return (
    <div className="hidden border-b border-white/10 bg-ink text-white md:block">
      <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between px-4 text-xs lg:px-6">
        {/* Left: greeting, date, live clock */}
        <div className="flex items-center gap-4">
          <span className="font-semibold text-brand-400">
            {now ? `${greeting(hour)}, Nigeria` : "Welcome to JM News"}
          </span>
          <span className="hidden text-white/30 lg:inline">|</span>
          <span className="hidden text-white/70 lg:inline">{dateLabel}</span>
          {now && (
            <span className="hidden items-center gap-1.5 tabular-nums text-white/90 lg:flex">
              <span className="text-white/30">|</span>
              <span aria-label="Current time in Lagos">{timeLabel} WAT</span>
            </span>
          )}
        </div>

        {/* Right: quick links + socials */}
        <div className="flex items-center gap-4">
          <Link href="/live" className="font-semibold text-white/80 transition-colors hover:text-brand-400">
            Live TV
          </Link>
          <Link href="/category/opinion" className="hidden text-white/80 transition-colors hover:text-brand-400 lg:inline">
            Newsletters
          </Link>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-6 w-6 place-items-center rounded text-white/70 transition-colors hover:bg-white/10 hover:text-brand-400"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
