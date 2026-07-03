"use client";

import { useState } from "react";
import { Facebook, Twitter, Linkedin, Link2, Check, Share2 } from "lucide-react";
import { site } from "@/lib/site";

export default function ShareButtons({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);
  const url = `${site.url}/article/${slug}`;
  const text = encodeURIComponent(title);
  const enc = encodeURIComponent(url);

  const links = [
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
      Icon: Facebook,
      className: "hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2]",
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${enc}&text=${text}`,
      Icon: Twitter,
      className: "hover:bg-ink hover:text-white hover:border-ink",
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`,
      Icon: Linkedin,
      className: "hover:bg-[#0a66c2] hover:text-white hover:border-[#0a66c2]",
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 flex items-center gap-1.5 text-sm font-semibold text-fg-muted">
        <Share2 className="h-4 w-4" /> Share
      </span>
      {links.map(({ label, href, Icon, className }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`grid h-9 w-9 place-items-center rounded-full border border-line-strong text-fg-muted transition-colors ${className}`}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-fg-muted transition-colors hover:border-brand-500 hover:bg-brand-500 hover:text-white"
      >
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
