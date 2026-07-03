import type { Author } from "./types";

/**
 * Newsroom reporter profiles — the single source of truth for bylines and the
 * public /reporter/[slug] profile pages.
 *
 * Edit these values to update the byline everywhere + the profile page. (This
 * is intentionally a config file so it works on Vercel with no database; the
 * admin "Profile" page reads from here. Swap `avatar` for a real uploaded
 * photo URL when you have one.)
 */
export interface Reporter extends Author {
  /** Full location, e.g. "Yola, Adamawa State". */
  location: string;
  /** UPPERCASE dateline stamped on articles, e.g. "YOLA". */
  dateline: string;
  /** Longer profile blurb for the reporter page. */
  longBio: string;
  email?: string;
  socials: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    email?: string;
  };
}

export const reporters: Reporter[] = [
  {
    slug: "ojoma-yusuf",
    name: "Ojoma Yusuf",
    role: "Correspondent",
    location: "Yola, Adamawa State",
    dateline: "YOLA",
    // Ojoma's Gravatar (from her WordPress account). Replace with a real
    // uploaded headshot URL for a sharper profile photo.
    avatar:
      "https://0.gravatar.com/avatar/4966385538113b4f7ff4062cb2f429f014ba7489e8432aba83fceb19a59da4f9?s=512&d=mp",
    bio: "Ojoma Yusuf is a correspondent based in Yola, reporting on Adamawa State and Nigeria's Northeast.",
    longBio:
      "Ojoma Yusuf reports from Yola on the stories shaping Adamawa State and the wider Northeast — security and policing, politics and governance, humanitarian affairs, health, education and the everyday lives of communities across the region. Her on-the-ground reporting brings the newsroom's coverage to readers across Nigeria and beyond.",
    email: "ojoma@jmnews.ng",
    socials: {
      twitter: "https://twitter.com/jmnews",
      facebook: "https://facebook.com/jmnews",
      whatsapp: "https://wa.me/2348000000000",
      email: "mailto:ojoma@jmnews.ng",
    },
  },
];

export const reporterMap = new Map(reporters.map((r) => [r.slug, r]));

/** The reporter every article is currently bylined to. */
export const defaultReporter = reporters[0];

export function getReporter(slug: string): Reporter | undefined {
  return reporterMap.get(slug);
}
