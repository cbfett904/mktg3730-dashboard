# MKTG 3730 — Brand Page Analytics Dashboard

Social media analytics dashboard for the WMU MKTG 3730 Community Project (Spring 2026).

## Features
- Historical data from Update 1 and Update 2 presentations
- Live follower count refresh via Anthropic API + web search
- Filter by class section (110 / 115)
- 4 views: Overview, Growth, Views & Reach, Brand Cards

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Connect the repo to Vercel
3. Add environment variable: `VITE_ANTHROPIC_API_KEY`
4. Deploy

The dashboard works fully without the API key — the live refresh button just won't function.
