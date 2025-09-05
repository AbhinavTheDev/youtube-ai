<p align="center">
    <a href="https://github.com/abhinavthedev/youtube-ai" style="text-decoration: none; color: inherit;">
        <img src="./public/logo.svg" alt="YouTube AI logo" width="96" height="96" style="vertical-align: middle; margin-right: 12px;" />
        <span style="font-size: 1.8rem; font-weight: 700; vertical-align: middle;">YouTube AI</span>
    </a>
</p>

## Introduction

A production-grade, full‑fledged Remix application that provides a scalable, secure way to leverage YouTube video knowledge with AI. The app ships with built‑in YouTube support (using official APIs), server‑side session handling, Appwrite auth, and Genkit + Google Gemini for safe, policy‑aligned AI workflows. Nothing in this project bypasses YouTube or Google security — Genkit enables compliant interactions while enabling powerful features.

## Key features

- Built-in YouTube integration: official APIs only, rate‑limiting and access logging for auditability.  
- Genkit + Gemini: policy-aligned AI flows and safe model orchestration.  
- Limitless Use Cases: generate summaries, transcribe, simplify, translate, build searchable archives, create study notes or clips — and much more.
- Secure by default: server-side secrets, least-privilege keys, token lifecycle, input/output validation, and no client-side secret exposure.  
- Extensible: modular TypeScript + Remix structure, clear server helpers, and ready hooks for additional AI workflows.


## Tech stack

- Remix (full-stack React framework)
- TypeScript
- Tailwind CSS
- Appwrite (authentication / user/session backend)
- Genkit (server-side & AI feature)
- Node.js (server runtime)

## Project layout (files of interest)

- `root.tsx` — Remix root and common providers
- `entry.client.tsx`, `entry.server.tsx` — Remix entry points
- `_index.tsx` — main landing route
- `login.tsx`, `logout.tsx` — auth flows
- `appwrite.server.ts` — Appwrite server helpers
- `auth.server.ts` — auth/session utilities
- `youtube.server.ts` — Genkit-based server for AI-enabled YouTube content interactions

## Prerequisites

- Node.js (recommend LTS, e.g., 18+)
- npm (or yarn/pnpm)
- An Appwrite project and API key (for auth)
- A Google Cloud project with Genkit enabled for AI-enabled YouTube content interactions

## Environment variables

Create a `.env` (or use your deployment provider secrets) with at least:

- APPWRITE_ENDPOINT — Appwrite server URL (e.g., https://appwrite.example.com/v1)
- APPWRITE_PROJECT — Appwrite project ID
- APPWRITE_KEY — Appwrite API key (server key)
- GEMINI_API_KEY — Gemini API key from [Google AI Studio](https://aistudio.google.com/app/) for Gemini 1.5 Flash to interact with YouTube content with AI-enabled features

Note: Exact variable names may be found in `env.example`;

## Install & run (development)

Open Shell in project root.

- Install:

```
npm install
```

- Run dev server:

```
npm run dev
```

Open http://localhost:3000

Build for production:

```
npm run build
npm run start
```

(If your project uses a different package manager or scripts, use them accordingly.)

## Usage

- Visit / (root) for landing UI.
- Use /login to start Appwrite-backed authentication.
- Use /logout to end the session.
- Server-side YouTube requests are proxied/handled in `youtube.server.ts` via Genkit-based server for AI-enabled features using Gemini 1.5 Flash.

## Troubleshooting

- 401/403 from Appwrite — verify APPWRITE_KEY, project ID, and allowed origins.
- Genkit server errors — ensure GEMINI_API_KEY is enabled for Gemini 1.5 Flash interactions with YouTube content and quota is available.

## Contributing

- Fork, create feature branches, open PRs.
- Keep changes small and focused; add tests for new behavior.

## Author

- Github: [@AbhinavTheDev](https://github.com/abhinavthedev)
- Twitter: [@Abhinav_twts](https://x.com/abhinav_twts) (mostly found here!)
- LinkedIn: [Abhinav](https://www.linkedin.com/in/say-hi-to-abhinav/)

## Thank you

Thanks for checking out YouTube AI — contributions, feedback, and stars are appreciated!