# 🧠 MindOps Web

MindOps is a **Mental Engineering** platform designed to optimize your biological and cognitive performance. It is not just a task manager; it is a monitoring system that translates your vents and mental patterns into actionable items, helping you maintain "Momentum" without saturating your "RAM" (cognitive capacity).

## 🚀 Key Features

- **Momentum Anchor:** Identifies your "Atomic Action" priority to avoid analysis paralysis.
- **Telegram Synchronization:** Connect your mind in real-time via a bot. Send your thoughts and the system will process them.
- **Calm Rhythm:** Visualization of your mental load throughout the day to identify saturation peaks.
- **AI Perspective:** Receive deep interpretations of your own patterns to see clearly through the noise.
- **Pause Protocol:** Automatic detection of critical fatigue to force a biological reset when necessary.

## 🛠 Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router, Turbopack)
- **Database & Auth:** [Supabase](https://supabase.com/) (SSR, Google OAuth)
- **UI & Animations:** [Framer Motion](https://www.framer.com/motion/), [Tailwind CSS](https://tailwindcss.com/) & [Tremor](https://www.tremor.so/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Infrastructure:** [Google Cloud Run](https://cloud.google.com/run) & [Docker](https://www.docker.com/)
- **CI/CD:** GitHub Actions

## ⚙️ Configuration (Environment Variables)

Create a `.env` file in the project root with the following keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📦 Deployment (On Google Cloud Run)

This project **does not use Vercel**. It is deployed on scalable Google Cloud infrastructure.

### Manual Deployment
If you have the Google Cloud SDK (`gcloud`) configured, you can deploy directly with:

```bash
npm run deploy
```

### Automatic Deployment (GitHub Actions)
The project includes a complete pipeline configured in `.github/workflows/`:
1. **CI:** Checks for linter and build errors on every Push/PR.
2. **CD:** Automatically deploys to Google Cloud Run when merging into `main`.

> *Note: Requires configuring `GCP_SA_KEY`, `GCP_PROJECT_ID`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` Secrets in the GitHub repository.*

## 💻 Local Development

1. Install dependencies (using legacy-peer-deps for React 19 compatibility):
   ```bash
   npm install --legacy-peer-deps
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Clean code before pushing changes:
   ```bash
   npm run lint
   ```

---
Designed for efficiency. Built for the mind. ⚡
