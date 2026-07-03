import { cmsFetch } from "../client";
import { cmsMutate } from "../admin-client";
import { graphql } from "../generated/gql";

/**
 * WP "General Settings" — site title, tagline, URL, admin email.
 *
 * Read path:  `getSiteSettings()` — public, cache-tagged, fast.
 * Write path: `updateSiteSettings()` — admin-authed; triggers
 *             `revalidateTag("cms:site-settings")` (see settings action)
 *             so the public site reflects the change within seconds.
 *
 * Codegen scans this file for the `graphql()` tags.
 */

const SITE_SETTINGS_QUERY = graphql(`
  query SiteSettings {
    generalSettings {
      title
      description
      url
      email
    }
  }
`);

const UPDATE_SITE_SETTINGS = graphql(`
  mutation UpdateSiteSettings(
    $title: String
    $description: String
    $url: String
    $email: String
  ) {
    updateSettings(
      input: {
        generalSettingsTitle: $title
        generalSettingsDescription: $description
        generalSettingsUrl: $url
        generalSettingsEmail: $email
      }
    ) {
      generalSettings {
        title
        description
        url
        email
      }
    }
  }
`);

export async function getSiteSettings() {
  const data = await cmsFetch(SITE_SETTINGS_QUERY, {}, {
    revalidate: 300,
    tags: ["cms:site-settings"],
  });
  return data.generalSettings;
}

export interface SiteSettingsInput {
  title?: string;
  description?: string;
  url?: string;
  email?: string;
}

export async function updateSiteSettings(input: SiteSettingsInput) {
  const data = await cmsMutate(UPDATE_SITE_SETTINGS, {
    title: input.title ?? null,
    description: input.description ?? null,
    url: input.url ?? null,
    email: input.email ?? null,
  });
  return data.updateSettings?.generalSettings;
}
