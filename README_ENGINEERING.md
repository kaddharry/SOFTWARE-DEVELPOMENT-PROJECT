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
