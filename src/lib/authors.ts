import type { Author } from "./types";
import { img } from "./utils";

export const authors: Author[] = [
  {
    slug: "adaeze-okonkwo",
    name: "Adaeze Okonkwo",
    role: "Senior Political Correspondent",
    avatar: img("author-adaeze", 200, 200),
    bio: "Adaeze covers the National Assembly and Aso Rock with more than a decade on the politics beat.",
  },
  {
    slug: "musa-ibrahim",
    name: "Musa Ibrahim",
    role: "Business & Markets Editor",
    avatar: img("author-musa", 200, 200),
    bio: "Musa tracks the naira, the NGX and the policy decisions moving Africa's largest economy.",
  },
  {
    slug: "tunde-bello",
    name: "Tunde Bello",
    role: "Sports Writer",
    avatar: img("author-tunde", 200, 200),
    bio: "Tunde follows the Super Eagles home and away and writes on the business of Nigerian football.",
  },
  {
    slug: "ngozi-eze",
    name: "Ngozi Eze",
    role: "Technology Reporter",
    avatar: img("author-ngozi", 200, 200),
    bio: "Ngozi reports on fintech, startups and the people building Nigeria's digital economy.",
  },
  {
    slug: "fatima-yusuf",
    name: "Fatima Yusuf",
    role: "Health Correspondent",
    avatar: img("author-fatima", 200, 200),
    bio: "Fatima covers public health, hospitals and the science that affects everyday Nigerians.",
  },
  {
    slug: "emeka-nwachukwu",
    name: "Emeka Nwachukwu",
    role: "Foreign Affairs Editor",
    avatar: img("author-emeka", 200, 200),
    bio: "Emeka makes sense of global events and what they mean for Nigeria and West Africa.",
  },
  {
    slug: "bisi-adeyemi",
    name: "Bisi Adeyemi",
    role: "Arts & Culture Writer",
    avatar: img("author-bisi", 200, 200),
    bio: "Bisi chronicles Nollywood, Afrobeats and the creative scene from Lagos to the world.",
  },
  {
    slug: "editorial-board",
    name: "JM News Editorial Board",
    role: "Opinion",
    avatar: img("author-board", 200, 200),
    bio: "The collective voice of JM News on the issues shaping the nation.",
  },
];

export const authorMap = new Map(authors.map((a) => [a.slug, a]));

export function getAuthor(slug: string): Author {
  return (
    authorMap.get(slug) ?? {
      slug: "newsroom",
      name: "JM Newsroom",
      role: "Staff",
      avatar: img("author-newsroom", 200, 200),
      bio: "Reporting from the JM News newsroom.",
    }
  );
}
