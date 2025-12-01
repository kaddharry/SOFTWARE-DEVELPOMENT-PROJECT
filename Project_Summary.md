# Project Summary

## Stack & Frameworks
- **Frontend**: React (Create‑React‑App) + vanilla CSS
- **Backend**: Node.js / Express
- **Database**: MongoDB (Mongoose)
- **AI Services**: Groq (Whisper transcription + Llama 3.1) for voice‑to‑product extraction
- **Media**: Cloudinary for image storage
- **Config**: dotenv for environment variables, `.env` (ignored in Git)
- **Version Control**: Git + GitHub

## Core Features
| Feature | Description |
|---------|-------------|
| User Management | Register / login with JWT, passwords hashed via `bcryptjs` |
| Product Catalog | List, view, add, edit, delete products. Desktop grid (4‑col) and mobile "Blinkit‑style" 2‑col compact cards |
| Shopping Cart | Floating "Your Cart" button, cart persistence, checkout flow |
| AI Gift Advisor | Floating button opens modal with AI‑generated suggestions |
| Voice‑Activated Add Product | Record audio → `/api/voice/analyze` → Groq Whisper → Llama 3 extracts JSON (name, price, qty, description) → form pre‑filled |
| Image Upload | Upload product images to Cloudinary via `uploadRoutes` |
| Order Management | Create orders, view order history |
| Responsive UI | Mobile‑first CSS, media queries, skeleton loaders, ripple effects, modal animations |
| Error Handling | Clear JSON error messages (e.g., missing API key, no audio file) displayed to user |

## Folder Structure (high‑level)
```
frontend/
│   src/pages/          # Home.js, AddProduct.js, …
│   src/pages/Home.css  # responsive grid, floating buttons, skeletons
│   ...
backend/
│   config/dotenv.js    # loads .env
│   routes/
│       userRoutes.js
│       productRoutes.js
│       uploadRoutes.js
│       orderRoutes.js
│       voiceRoutes.js   # voice analysis endpoint
│   test_groq_key.js    # sanity‑check script for GROQ key
│   .env                # API keys, DB URI (git‑ignored)
│   server.js           # Express app, CORS, route registration
```

## Deployment Note
The `.env` file is listed in `.gitignore`, so API keys are **not** pushed to the repository. When deploying, add the following environment variables in your hosting provider:
- `GROQ_API_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `MONGO_URI`
- `JWT_SECRET`

## How to Get a PDF
1. Open `Project_Summary.md` in your editor.
2. Use **Print → Save as PDF** (or any markdown‑to‑PDF tool).
3. The resulting PDF will contain the full project overview.

---
*Generated on 2025‑11‑25.*
