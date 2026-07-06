# CLIQUE — The IT & Analytics Club, IMNU

Marketing site for CLIQUE, the IT & Analytics Club at the Institute of
Management, Nirma University. Built with React 19, Vite, TypeScript and
React Router.

## Local development

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build locally
```

## Deployment

The site auto-deploys to **GitHub Pages** on every push to `main` via the
workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

Live URL: <https://clique-imnu.github.io/Website/>

One-time setup in the repo: **Settings → Pages → Build and deployment →
Source: GitHub Actions**.

Because it's served from the `/Website/` sub-path, the Vite `base` is set to
`/Website/` in [vite.config.ts](vite.config.ts) and the router reads it via
`import.meta.env.BASE_URL`. Client-side routes (`/join`, `/people/:slug`)
survive a hard refresh thanks to the SPA fallback in
[public/404.html](public/404.html). For a custom domain served from the root,
set `base` back to `'/'`.

## Registration form → Google Sheet

The `/join` form can post submissions to a Google Sheet. See
[SHEET_SETUP.md](SHEET_SETUP.md) for the one-time Apps Script setup; until a
webhook URL is configured the form runs in demo mode (localStorage only).
