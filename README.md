<p align="center">
  <img src="client/public/orion-icon-512.svg" width="120" alt="ORION FLUX Logo"/>
</p>

<h1 align="center">ORION FLUX</h1>
<p align="center"><strong>AI-Powered Super Agent for Business Automation</strong></p>

<p align="center">
  CRM · Lead Scraping · Auto Outreach · AI Proposals · Invoices · Project Management · Analytics
</p>

---

## ⚡ Quick Start (3 Steps)

**Prerequisites**: [Node.js 18+](https://nodejs.org/) installed on your system.

### Windows
```
Double-click start.bat
```

### Mac / Linux
```bash
chmod +x start.sh
./start.sh
```

### Manual Start
```bash
# 1. Install dependencies
cd client && npm install && cd ../server && npm install && cd ..

# 2. Build frontend
cd client && npm run build && cd ..

# 3. Start the app
cd server && node app.js
```

Then open **http://localhost:5000** in your browser.

---

## 🌟 Features

| Module | Description |
|--------|-------------|
| 📊 **Executive Dashboard** | Revenue metrics, QA pipeline, real-time activity feed |
| 🤖 **Agency OS (Solene AI)** | Multi-agent orchestrator with memory & workflows |
| 🎬 **Video Studio** | AI-powered cinematic video blueprint generator |
| 👥 **CRM** | Contact management, lead scoring, deal pipeline |
| 🔍 **Lead Scraper** | Google Maps, web search, bulk import |
| 📧 **Auto Outreach** | Gmail SMTP campaigns with templates |
| 📝 **AI Proposals** | Gemini-powered proposal generator |
| 💰 **Invoices** | GST calculation, UPI QR, PayPal integration |
| 📋 **Projects** | Task tracker with QA pipeline & delivery |
| 🚀 **Project Showcase** | Interactive sandbox to run delivered projects |
| 💬 **AI Chatbot** | 24/7 query handler |
| 📱 **Social Media** | Post planner with AI captions |
| 📈 **Analytics** | Business intelligence & projections |

---

## 📱 Install as App (PWA)

ORION FLUX works as a **Progressive Web App**. After opening it in your browser:

1. Click the **Install** icon in the browser's address bar
2. Or on mobile: tap **"Add to Home Screen"**
3. The app will run like a native application — no browser chrome!

---

## ☁️ Deploy Online (Free)

### Render.com (Recommended)
1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New Blueprint**
3. Connect your repo — it auto-detects `render.yaml`
4. Click **Deploy** — done!

### Docker
```bash
docker build -t orion-flux .
docker run -p 5000:5000 orion-flux
```

### Railway / Fly.io
```bash
# Railway
railway init && railway up

# Fly.io
fly launch && fly deploy
```

---

## 📦 Download & Distribute

Create a distributable package:
```bash
node scripts/package.js
```
This creates an `orion-flux-v1.0.0/` folder with everything needed. ZIP it and share!

---

## 🔧 Configuration

Copy `.env.example` to `.env` in the `server/` directory:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `GMAIL_USER` | Gmail address for outreach |
| `GMAIL_APP_PASSWORD` | Gmail app password |
| `GEMINI_API_KEY` | Google Gemini API key |

---

## 🏗️ Tech Stack

- **Frontend**: React 18 + Vite + Chart.js
- **Backend**: Node.js + Express
- **Database**: JSON file storage (zero config)
- **Styling**: Custom CSS with glassmorphism
- **PWA**: Service Worker + Web App Manifest

---

## 📂 Project Structure

```
orion-flux/
├── client/               # React frontend
│   ├── src/
│   │   ├── pages/        # All page components
│   │   ├── components/   # Layout (Sidebar, Header)
│   │   └── context/      # Theme provider
│   ├── public/           # Static assets & PWA files
│   └── dist/             # Production build output
├── server/               # Express backend
│   ├── app.js            # Main server (serves API + frontend)
│   ├── routes/           # API route handlers
│   ├── config/           # Database configuration
│   └── .env              # Environment variables
├── database/             # JSON data store
├── scripts/              # Build & package utilities
├── start.bat             # Windows launcher
├── start.sh              # Mac/Linux launcher
├── Dockerfile            # Container deployment
├── render.yaml           # Render.com blueprint
└── README.md             # This file
```

---

<p align="center">
  Built with ❤️ by <strong>ORION FLUX Team</strong>
</p>
