# AI Mystery Room

Create a fictional mystery, examine its evidence, submit one final verdict, and read the solution. The creation page also includes a clearly labeled sample case that does not call Gemini.

## For players

If this project has a hosted website URL, open it in your browser and choose **Create your mystery** or **Try the sample case**. You do not need Node.js, MongoDB, or a Gemini key to use a hosted site.

### Start with the sample case

Choose **Try the sample case** for the most reliable way to start playing. It does not call Gemini. **Generate mystery** uses Gemini to create a custom case from your scenario, so it can take longer and may fail if the AI service is temporarily unavailable or its API quota has been reached. If it keeps loading or shows an error, return to the creation page and choose **Try the sample case** instead.

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

This project includes a [Render Blueprint](render.yaml) that builds the client and serves it with the API at one public URL. GitHub stores the code; players use the deployed Render URL and do not need a terminal, Node.js, MongoDB, or a Gemini key.

### 1. Protect local credentials

- Keep `server/.env` on your computer. `.gitignore` excludes it from Git; never copy it into GitHub or Render.
- `server/.env.example` contains placeholders and may be committed.
- If any real credential was ever placed in `server/.env.example`, rotate that Gemini key and MongoDB database password before publishing.

### 2. Create a hosted MongoDB database

1. Sign in to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a project and cluster. Choose Singapore if available to keep the database near this Render deployment.
2. In **Database Access**, create a database user with a new, strong password. Grant it the `readWrite` role for the `ai_mystery_room` database; do not use your Atlas website login as the database user.
3. In the cluster's **Connect** flow, choose **Drivers** and copy the connection string. Use the database user's username and password, and put `ai_mystery_room` after `.net/` in the URI. Keep this URI private. If the password has special characters, URL-encode them.
4. You will add Render's outbound IP ranges to the Atlas IP access list in step 5. Atlas requires both an allowed network address and a database user for connections; see [MongoDB's connection guide](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/).

### 3. Publish the project to GitHub

1. In VS Code, open **Source Control** (the branch icon on the left).
2. Check the file list before publishing. `server/.env` must not appear. If it does, stop and do not stage or publish it.
3. Choose **Publish to GitHub**. Create a new repository; a private repository is fine. Render can deploy from a private repository after you authorize GitHub access.
4. Keep `render.yaml`, the package files, source folders, and `server/.env.example` in the repository.

### 4. Create the Render service

1. Sign in to [Render](https://dashboard.render.com/).
2. Choose **New** -> **Blueprint**, connect GitHub if prompted, and select this repository. Render reads the root `render.yaml`.
3. Review the Blueprint. It defines one free Node web service in Singapore, builds with `npm install && npm run build`, starts with `npm start`, and checks `/api/health`.
4. When Render asks for secret values, enter the Atlas connection URI as `MONGODB_URI` and your rotated Gemini key as `GEMINI_API_KEY`. Do not paste them into GitHub or this README. Render generates `SESSION_SECRET` and sets `GEMINI_MODEL` for you.
5. Click **Deploy Blueprint**. The first deploy may fail its database connection until Atlas allows the Render service's network range; continue to the next step if the logs show a MongoDB connection error.

### 5. Allow Render to reach Atlas

1. In Render, open the new web service. Choose **Connect** -> **Outbound** and copy all the listed IP ranges.
2. In Atlas, open **Network Access** and add each Render IP range to the project's IP access list. Do not use `0.0.0.0/0` for this setup.
3. Return to Render and choose **Manual Deploy** -> **Deploy latest commit**. Wait for the deploy and `/api/health` check to succeed. Render documents where to find the [service outbound ranges](https://render.com/docs/outbound-ip-addresses).

### 6. Check the public app and share it

1. Open the service's `https://...onrender.com` URL. Opening `/api/health` on the same domain should return `{"status":"ok"}`.
2. Start with **Try the sample case** to confirm the deployed game works. It does not use Gemini. **Generate mystery** creates a custom case through Gemini and may take longer or fail if the AI service is unavailable or the API quota is reached; players can use the sample case instead.
3. Share the service's root URL with players. They can open it directly in a browser. Later pushes to the connected GitHub branch trigger a new deployment.

The Blueprint uses Render's free web service plan. Free services sleep after 15 minutes without traffic, so the first visit after idle time can take about a minute to wake up. See Render's [free service limits](https://render.com/docs/free).

## API

- `GET /api/health`
- `POST /api/cases` — generate an AI case
- `POST /api/cases/demo` — create a sample case without Gemini
- `GET /api/cases/:caseId`
- `GET /api/investigations/:investigationId`
- `POST /api/investigations/:investigationId/evidence/:evidenceId/open`
- `POST /api/investigations/:investigationId/verdict`
- `GET /api/investigations/:investigationId/results`
