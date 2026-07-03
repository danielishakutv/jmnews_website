import "server-only";
import { print } from "graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { CmsError } from "./client";

/**
 * Authenticated server-only GraphQL client for **mutations**.
 *
 * Authenticates with WP_ADMIN_USER + WP_ADMIN_APP_PASSWORD (the same
 * Application Password we use for codegen). This is a "service account"
 * pattern: every write is attributed in wp-admin to that user, not the
 * dashboard user who triggered it. Acceptable for Phase 3; Phase 7
 * hardening will swap to per-user JWT for proper audit.
 *
 * Never goes through Next's fetch cache — mutations must hit WP fresh.
 */

const endpoint = process.env.WP_GRAPHQL_URL;
const adminUser = process.env.WP_ADMIN_USER;
const adminPass = process.env.WP_ADMIN_APP_PASSWORD?.replace(/\s+/g, "");

export async function cmsMutate<TData, TVars>(
  document: TypedDocumentNode<TData, TVars>,
  variables?: TVars
): Promise<TData> {
  if (!endpoint) {
    throw new CmsError("WP_GRAPHQL_URL is not set in .env.local.");
  }
  if (!adminUser || !adminPass) {
    throw new CmsError(
      "WP_ADMIN_USER / WP_ADMIN_APP_PASSWORD not set — mutations require " +
        "an Application Password with write capabilities."
    );
  }
  const auth =
    "Basic " + Buffer.from(`${adminUser}:${adminPass}`).toString("base64");

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify({ query: print(document), variables }),
      cache: "no-store",
    });
  } catch (e) {
    throw new CmsError("Network error reaching WordPress.", e);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new CmsError(`CMS mutation HTTP ${res.status} ${res.statusText}`, body);
  }

  const json = (await res.json()) as { data?: TData; errors?: unknown };
  if (json.errors) {
    throw new CmsError("CMS returned GraphQL errors", json.errors);
  }
  if (json.data === undefined || json.data === null) {
    throw new CmsError("CMS mutation response had no data field", json);
  }
  return json.data;
}
