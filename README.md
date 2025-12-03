# Project Features Overview

## 🎯 Purpose
The **Artisan‑Direct** (formerly *PDF Kitchen*) platform enables users to seamlessly create, edit, and share digital content, with a focus on PDF manipulation, AI‑powered gift recommendations, and real‑time voice interactions.

## ✨ Core Features
| Category | Feature | Description |
|---|---|---|
| **PDF Tools** | Merge PDFs | Drag‑and‑drop reordering of PDFs before merging, with preview thumbnails. |
| | Split PDFs | Select page ranges to extract into separate files. |
| | Compress PDFs | Reduce file size while preserving quality. |
| **AI Gift Advisor** | Voice‑enabled suggestions | Users can speak their preferences; the backend processes the audio via the **voiceRoutes** API and returns curated gift ideas. |
| | Image‑to‑gift conversion | Upload an image; AI generates a personalized gift description. |
| **User Management** | Persistent login sessions | JWT stored in HttpOnly cookies keeps users logged in across browser restarts. |
| | Role‑based dashboards | Separate seller and buyer views with tailored analytics. |
| **Real‑time Collaboration** | Shared editing | Multiple users can edit a PDF simultaneously with live updates via WebSocket. |
| **Analytics & Reporting** | Revenue & order stats | Sellers see real‑time revenue, shipped order counts, and inventory alerts. |
| **Responsive UI** | Mobile‑first design | Adaptive layouts, glass‑morphism cards, and micro‑animations for a premium feel. |
| **Security** | Cloudinary image storage with signed URLs, bcrypt password hashing, and CORS protection. |

## 🛠️ Technology Stack
- **Frontend**: React (Create‑React‑App), Tailwind CSS, Framer Motion, Three.js for 3D visualizations.
- **Backend**: Node.js + Express, Mongoose (MongoDB), Cloudinary, Multer, dotenv.
- **AI Services**: Gemini API for text generation, Groq‑SDK for embeddings, Speech‑to‑Text for voice routes.
- **DevOps**: Vercel (frontend), Railway (backend), GitHub Actions CI.

## 📦 Getting Started
```bash
# Clone repo
git clone https://github.com/yourusername/artisan-direct.git
cd artisan-direct

# Install dependencies
npm install   # installs both frontend and backend deps

# Set up environment variables (see .env.example)
cp .env.example .env
# edit .env with your keys

# Run development servers
npm run dev   # starts both frontend (React) and backend (Express) concurrently
```

---
*All UI components follow a premium design language with dark mode, glass‑morphism cards, and subtle micro‑animations to provide a modern, engaging user experience.*
