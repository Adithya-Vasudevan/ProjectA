# RidePulse (Preview)

This is the preview build for the competition dashboard. It uses:
- Vite + React + TypeScript
- TailwindCSS
- Framer Motion
- React Router
- Recharts (final polish)

The Overview page already fetches live CitiBike GBFS station data as a proof-of-live-data.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy on Vercel (recommended)

1. Push this repo to GitHub on the `main` branch.
2. Go to https://vercel.com/new and import your GitHub repository.
3. Vercel should auto-detect Vite. If prompted:
   - Build Command: `vite build`
   - Output Directory: `dist`
4. Click Deploy. You'll get a public preview URL immediately.

`vercel.json` is included for single-page app routing.

## Notes

- Additional tabs (Trends, Stations, Story, Quiz) are stubbed and will be filled in during the final polish.
- Styling supports dark mode automatically based on system preference.