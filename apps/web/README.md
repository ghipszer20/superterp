This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Owner review tool (`/review`)

An internal page where the owner checks each program's requirements against the catalog and signs it off
(PROJECT_MEMORY.md section 6, step 5). It is never shipped to students:

- **Enabled** only under `npm run dev`, or in a production build started with `SUPERTERP_REVIEW=1`
  (e.g. `SUPERTERP_REVIEW=1 npm run start -w @superterp/web`). Otherwise `proxy.ts` answers 404 for `/review`
  and `/api/review`, and the pages and API route check again. Not linked from the nav; disallowed in `robots.txt`.
- **Data:** reads the catalog cache in `packages/catalog/.cache/catalog/` (fill it with
  `node scripts/coverage.ts` in packages/catalog) and the hand-encoded programs in `packages/audit/programs/`.
- **Sign-offs** are written to `packages/catalog/review/signoffs.json`; commit that file.
- Overrides: `SUPERTERP_CATALOG_CACHE` (cache directory), `SUPERTERP_SIGNOFFS` (sign-off file).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
