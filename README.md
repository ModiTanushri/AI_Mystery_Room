# AI Mystery Room

Create a fictional mystery, examine its evidence, submit one final verdict, and read the solution. The creation page also includes a clearly labeled sample case that does not call Gemini.

## For players

If this project has a hosted website URL, open it in your browser and choose **Create your mystery** or **Try the sample case**. You do not need Node.js, MongoDB, or a Gemini key to use a hosted site.

Pushing this repository to GitHub does **not** publish or run the app. A public player link requires deploying the frontend, API, and database. Until a deployment URL is added here, use the local setup below.

## Run locally on Windows

### Requirements

- Node.js 20 or later
- MongoDB Community running locally, or a MongoDB connection URI
- A Google Gemini API key to generate custom cases (the sample case does not use Gemini)

### First-time setup

1. Copy `server/.env.example` to `server/.env`:

   ```powershell
   Copy-Item server/.env.example server/.env
   ```
2. In `server/.env`, set `GEMINI_API_KEY`. Keep the provided local `MONGODB_URI` if MongoDB Community is running on this computer. Leave `GEMINI_MODEL=gemini-3.8-flash` unless you intentionally choose another supported model.
3. Replace `SESSION_SECRET` with a random value. You can generate one in PowerShell with:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
   ```

   Copy the output into `server/.env`. Never commit or share that file.

4. From the project root—the folder containing this README and the `client` and `server` folders—install all dependencies once:

   ```powershell
   npm.cmd install
   ```

### Start the app

From that same project root, run:

```powershell
npm.cmd run dev
```

Keep the terminal open. Wait for `Connected to MongoDB`, `API listening on port 5000`, and Vite’s `Local:` URL. Open that exact URL in your browser. If Vite uses a fallback port because another app occupies 5173, the development API allows Vite localhost ports.

To play without a Gemini request, open the creation page and choose **Try the sample case**. To create a new case from your own premise, enter a scenario and choose **Generate mystery**.

## Deploy for other people

GitHub stores the source; it does not run the app for players. This repo includes a [Render Blueprint](render.yaml) that deploys the built React frontend and Express API together, giving players one website URL.

1. Push the repository to GitHub.
2. Create or choose a hosted MongoDB database, make sure the hosting service can connect to it, and copy its connection URI.
3. In Render, create a Blueprint from the GitHub repository and provide the requested `MONGODB_URI` and `GEMINI_API_KEY` secrets. The Blueprint generates `SESSION_SECRET` and sets the production model.
4. Wait for the build and health check to pass, then share the Render URL. Players can open the site directly; they do not need Node.js, MongoDB, a Gemini key, or a terminal.

The deployed app serves the client and API from the same origin. Keep all credentials in the hosting provider’s environment settings; never commit `server/.env` or put the Gemini key in the client bundle. Render’s [Blueprint guide](https://render.com/docs/blueprints) explains creating a service from `render.yaml`.

## API

- `GET /api/health`
- `POST /api/cases` — generate an AI case
- `POST /api/cases/demo` — create a sample case without Gemini
- `GET /api/cases/:caseId`
- `GET /api/investigations/:investigationId`
- `POST /api/investigations/:investigationId/evidence/:evidenceId/open`
- `POST /api/investigations/:investigationId/verdict`
- `GET /api/investigations/:investigationId/results`
