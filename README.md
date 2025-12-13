# 🔥 Viral Engine Pro

![RJ Business Solutions](https://storage.googleapis.com/msgsndr/qQnxRHDtyx0uydPd5sRl/media/67eb83c5e519ed689430646b.jpeg)

**Built by RJ Business Solutions**  
📍 1342 NM 333, Tijeras, New Mexico 87059  
🌐 [rickjeffersonsolutions.com](https://rickjeffersonsolutions.com)

**Build Date:** December 13, 2025

---

## 🚀 Overview

**Viral Engine Pro** is the ultimate AI-powered viral video generation platform. Create TikToks, Instagram Reels, and YouTube Shorts in minutes with 150+ done-for-you templates, AI script generation, and automatic social posting.

### ✨ Key Features

- ✅ **150+ Viral Templates** - Proven templates across 10+ categories
- ✅ **AI Script Generation** - Hooks, captions, and viral scripts written by AI
- ✅ **Unlimited Exports** - No limits on video generation
- ✅ **Auto-Posting** - Schedule and publish to TikTok, Instagram, YouTube
- ✅ **Bulk Generation** - Create 50+ videos at once
- ✅ **White-Label Ready** - Rebrand and resell as your own
- ✅ **4K Quality** - Professional-grade exports
- ✅ **Analytics Dashboard** - Track views, engagement, and viral potential

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Data Fetching:** React Query

### Backend
- **Framework:** FastAPI (Python 3.12)
- **Database:** PostgreSQL + Supabase
- **Cache:** Redis
- **Queue:** Celery
- **Storage:** Cloudflare R2
- **Video Processing:** FFmpeg

### AI & APIs
- **Script Generation:** OpenAI GPT-4, Anthropic Claude
- **Voice:** ElevenLabs, Minimax
- **Social APIs:** TikTok, Instagram, YouTube

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Deployment:** Vercel (Frontend) + Railway (Backend)
- **CDN:** Cloudflare
- **Monitoring:** Sentry, Prometheus

---

## 📦 Installation

### Prerequisites

- Node.js 20+
- Python 3.12+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Clone Repository

```bash
git clone https://github.com/rjbizsolution23-wq/viral-engine-pro.git
cd viral-engine-pro
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your API keys
nano .env
```

### Docker Deployment (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Local Development

#### Frontend

```bash
cd frontend
npm install
npm run dev
# Access: http://localhost:3000
```

#### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Access: http://localhost:8000
```

---

## 🚀 Deployment

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

### Railway (Backend)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway up
```

### Environment Variables

Configure these on Vercel and Railway:

**Vercel (Frontend):**
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Railway (Backend):**
- `DATABASE_URL`
- `REDIS_URL`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- (See `.env.example` for full list)

---

## 📚 Documentation

Full documentation available in `/docs`:
- [API Reference](./docs/API.md)
- [Template System](./docs/TEMPLATES.md)
- [Social Posting](./docs/SOCIAL_POSTING.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

---

## 🎨 Usage

### 1. Choose a Template

Browse 150+ viral templates organized by category:
- Motivational
- Wealth & Money
- Business
- Self-Improvement
- Fitness
- Lifestyle
- Tech & AI
- Storytelling
- Educational

### 2. Customize Content

- **AI Script Generation:** Let AI write viral hooks and captions
- **Custom Script:** Write your own or edit AI-generated text
- **Visual Settings:** Choose caption styles, colors, animations
- **Music:** Select from curated background music library

### 3. Generate Video

- **Processing Time:** 30-60 seconds per video
- **Bulk Mode:** Generate up to 50 videos at once
- **Quality:** 1080p or 4K exports

### 4. Publish

- **Auto-Post:** Schedule to TikTok, Instagram, YouTube
- **Manual Export:** Download HD/4K files
- **Analytics:** Track performance across platforms

---

## 🔑 API Keys Required

### AI Services
- **OpenAI:** [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Anthropic:** [console.anthropic.com](https://console.anthropic.com)
- **ElevenLabs:** [elevenlabs.io/api](https://elevenlabs.io/api)

### Social Platforms
- **TikTok:** [developers.tiktok.com](https://developers.tiktok.com)
- **Instagram:** [developers.facebook.com](https://developers.facebook.com)
- **YouTube:** [console.cloud.google.com](https://console.cloud.google.com)

### Infrastructure
- **Cloudflare R2:** [dash.cloudflare.com/r2](https://dash.cloudflare.com/r2)
- **Supabase:** [supabase.com/dashboard](https://supabase.com/dashboard)
- **Stripe:** [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## 📧 Contact

**Rick Jefferson**  
- Email: rjbizsolution23@gmail.com
- LinkedIn: [in/rick-jefferson-314998235](https://linkedin.com/in/rick-jefferson-314998235)
- GitHub: [@rickjeffsolutions](https://github.com/rickjeffsolutions)
- Website: [rickjeffersonsolutions.com](https://rickjeffersonsolutions.com)

---

## 🔒 Security

Found a security issue? Email: rjbizsolution23@gmail.com

**Do not open public issues for security vulnerabilities.**

---

## 📊 Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

**© 2025 RJ Business Solutions. All rights reserved.**

Built with ❤️ in Tijeras, New Mexico
