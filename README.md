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




# Artisan‑Direct – Software Engineering Overview

## Architecture Diagram
![Architecture](file:///c:/Users/HARDIK/.gemini/antigravity/brain/9c18614d-b22e-4a76-9c3d-8e45fe2444e9/architecture.png)

*The diagram (generated separately) shows the separation of concerns between the frontend SPA, the Express API gateway, the MongoDB database, and external AI services.*

## High‑Level Structure
| Layer | Technology | Responsibilities |
|---|---|---|
| **Presentation** | React (CRA) + Tailwind CSS + Framer Motion | UI components, routing, state management, micro‑animations, responsive design. |
| **API Gateway** | Node.js + Express (ESM) | HTTP endpoints, authentication (JWT), file uploads (Multer), Cloudinary integration, voice route handling. |
| **Business Logic** | Service modules (`services/*.js`) | PDF manipulation, AI calls (Gemini, Groq), inventory management, analytics calculations. |
| **Data Persistence** | MongoDB (Mongoose) | Schemas for Users, Products, Orders, PDFs, Voice transcripts. |
| **External Services** | Gemini API, Groq‑SDK, Cloudinary, Firebase (optional) | AI generation, image storage, real‑time notifications. |
| **DevOps / CI** | Vercel (frontend), Railway (backend), GitHub Actions | Automated builds, linting, testing, deployment pipelines. |

## Key Modules
- `backend/routes/voiceRoutes.js` – Handles `/api/voice` POST requests, saves audio, triggers speech‑to‑text, forwards transcript to Gemini for gift suggestions.
- `backend/controllers/pdfController.js` – Implements merge, split, compress operations using `pdf-lib`.
- `backend/middleware/auth.js` – Verifies JWT, attaches user object to request.
- `frontend/src/components/AIAdvisor.jsx` – UI for voice‑enabled gift advisor, integrates with WebSocket for live suggestions.
- `frontend/src/utils/api.js` – Centralized Axios instance with interceptors for auth token refresh.

## Data Flow Example (Voice Gift Advisor)
1. **Client** records audio and sends `multipart/form-data` to `POST /api/voice`.
2. **Express** middleware parses file via Multer, stores temporarily.
3. **Voice Service** calls external Speech‑to‑Text API, receives transcript.
4. Transcript is sent to **Gemini** via `groq-sdk` for gift idea generation.
5. Generated suggestions are returned to the client and displayed with animated cards.

## Security & Compliance
- **Authentication**: JWT stored in HttpOnly, SameSite‑Strict cookies.
- **Authorization**: Role‑based access control (seller vs buyer) enforced in route middleware.
- **Data Protection**: Passwords hashed with `bcryptjs`; Cloudinary URLs signed with expiration.
- **CORS**: Whitelisted origins, strict methods.
- **Input Validation**: `express-validator` used on all endpoints.

## Testing Strategy
- **Unit Tests**: Jest for backend services (`tests/**/*.test.js`).
- **Integration Tests**: Supertest for API routes, covering auth, PDF ops, voice flow.
- **Frontend Tests**: React Testing Library for component rendering and interaction.
- **E2E Tests**: Cypress for full user journeys (login, PDF merge, voice advisor).

## Development Workflow
1. **Branching** – `main` protected, feature branches (`feature/*`).
2. **Linting** – ESLint (frontend) & StandardJS (backend) with pre‑commit hooks.
3. **CI** – GitHub Actions run lint, tests, and build on PRs.
4. **Deployment** – Merge to `main` triggers Vercel (frontend) and Railway (backend) deployments.

## Future Enhancements
- **Scalable Architecture** – Move to micro‑services (PDF service, AI service) behind a service mesh.
- **Real‑time Collaboration** – WebSocket server for live PDF editing.
- **AI Model Upgrades** – Switch to Gemini‑1.5‑Pro for higher quality suggestions.
- **Accessibility** – WCAG 2.1 compliance for UI components.

---
*This document provides a concise yet comprehensive view for developers, architects, and new contributors to understand the system’s design, responsibilities, and operational practices.*

