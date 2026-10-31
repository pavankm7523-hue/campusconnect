# CampusConnect — Deployment Guide

## 🌐 Production Architecture

CampusConnect uses a decoupled modern web architecture:

```
┌─────────────────────────────────┐
│     Vercel Edge Network         │
│  React 18 + Vite SPA Frontend   │
│  https://campusconnect-portal...│
└────────────────┬────────────────┘
                 │ HTTPS (REST + JWT)
                 ▼
┌─────────────────────────────────┐
│     Cloud Backend Host          │
│   (Render / Railway / Docker)   │
│   Spring Boot 3.2 + Java 21     │
│   MySQL 8.0 / In-Memory H2      │
└─────────────────────────────────┘
```

---

## 🚀 1. Frontend: Deployed on Vercel

The frontend is live and deployed on Vercel:

- **Live Production URL:** [https://campusconnect-portal-alpha.vercel.app](https://campusconnect-portal-alpha.vercel.app)
- **Vercel Project Dashboard:** [https://vercel.com/pavankm7523-hues-projects/campusconnect-portal](https://vercel.com/pavankm7523-hues-projects/campusconnect-portal)
- **Deployment Status:** `Ready` (HTTP 200)

### SPA Routing Configuration (`frontend/vercel.json`)
Vercel handles client-side React Router navigation (e.g. `/student/dashboard`, `/login`, `/register`) using the following filesystem rule:

```json
{
  "version": 2,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
```

### Manual Redeploying via Vercel CLI
```bash
cd CampusConnect/frontend
vercel deploy --prod
```

---

## ☕ 2. Backend: Hosting Options for Spring Boot

> [!NOTE]
> Vercel is optimized for static sites and serverless Node.js/Edge runtimes. A Java Spring Boot application with embedded Tomcat requires a containerized or VM host.

### Option A: Render (Free Docker Hosting)
We have included a pre-configured `render.yaml` and multi-stage `Dockerfile`:

1. Push this repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Blueprint** and connect your repository.
4. Render will automatically build the `backend/Dockerfile` and deploy the Spring Boot service.

### Option B: Railway / Fly.io / Koyeb
Simply point Railway or Koyeb to the `backend/Dockerfile`. It builds using Temurin Java 21 and runs the standalone JAR on port 8080.

---

## 🔗 3. Connecting Vercel Frontend to the Backend

Once your backend is live (e.g. `https://campusconnect-api.onrender.com`), configure Vercel:

### Via Vercel CLI:
```bash
vercel env add VITE_API_URL production --cwd CampusConnect/frontend
# Enter value: https://your-backend-domain.com
vercel deploy --prod --cwd CampusConnect/frontend
```

### Via Vercel Web Dashboard:
1. Open [Project Settings → Environment Variables](https://vercel.com/pavankm7523-hues-projects/campusconnect-portal/settings/environment-variables).
2. Key: `VITE_API_URL`
3. Value: `https://your-backend-domain.com`
4. Redeploy the latest deployment.
