# CMS module (`src/lib/cms`)

Server-side gateway to the WordPress CMS via WPGraphQL.

## Layout

```
src/lib/cms/
├── client.ts          server-only fetch wrapper (cache + tags)
├── flags.ts           feature flags (NEXT_PUBLIC_USE_CMS etc.)
├── queries/           one file per logical query
│   ├── site-settings.ts
│   └── categories.ts
└── generated/         GraphQL Codegen output (gitignored; run `npm run codegen`)
```

## Where to use what

| You need to…                                     | Use                           |
|--------------------------------------------------|-------------------------------|
| Read CMS data from a server component / route    | `import { getX } from "./queries/x"` |
| Check whether a page is on CMS or static yet     | `cmsFlags.enabled`            |
| Add a new query                                  | New file in `queries/`, then `npm run codegen` |
| Tag cache for on-demand revalidation             | `tags: ["cms:foo"]` option    |

## Phase progression

- **Phase 0** (current): pipeline only. `/dev/graphql-ping` proves reads work.
  Public site is still 100% static.
- **Phase 1**: per-data-type cutover behind the flag. Static fallbacks remain
  in `src/lib/{site,categories,authors,articles}.ts` until each is migrated.
- **Phase 1.5**: WP mu-plugin POSTs to `/api/revalidate` with the affected
  cache tag on every save/update.
- **Phase 3+**: dashboard `Server Action`s call CMS write mutations.

## Codegen

Queries in this folder are hand-typed during Phase 0 so the smoke check works
without auth. Once you've set `WP_ADMIN_USER` + `WP_ADMIN_APP_PASSWORD` in
`.env.local`, run:

```bash
npm run codegen
```

This introspects the live schema and writes typed document nodes to
`generated/`. Migrate each query to use the generated types before adding
the next one — keeps drift impossible.

## Never do

- ❌ Import `client.ts` from a Client Component (it's `server-only`).
- ❌ Hard-code the endpoint — always go through `WP_GRAPHQL_URL`.
- ❌ Skip cache tags on a read that needs instant revalidation.
