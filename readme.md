# DocuChain — Intelligent Document Management

All‑in‑one web app to upload, preview, and process documents (optimize, split, extract text, protect). Backend is Node/Express + MongoDB; Frontend is React (CRA) + Tailwind + DaisyUI.

## Live Demo
- Web: https://docu-chain-h85.vercel.app/
- API: https://docu-chain.onrender.com (Health: `/health`)

## Features
- Upload documents and manage metadata
- PDF operations: Optimize, Split (by pages), Extract Text, Protect (password)
- Preview PDFs in browser (react-pdf)
- Auth with JWT (login/register)

Note: When external PDF service is unavailable, the app gracefully falls back to local processing for demo purposes.

## Tech Stack
- Frontend: React 18, React Router, TailwindCSS, DaisyUI, react-pdf
- Backend: Node.js, Express, MongoDB (Mongoose), Multer, JWT

## Quick Start (Local)
```bash
# Backend
cd 3_dev/docu_chain/backend
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET
npm install
npm run dev

# Frontend (new terminal)
cd 3_dev/docu_chain/frontend
npm install
REACT_APP_API_URL=http://localhost:5001/api npm start
```

## Production
- Frontend (Vercel): set `REACT_APP_API_URL=https://docu-chain.onrender.com/api`
- Backend (Render): set env `MONGODB_URI`, `JWT_SECRET`, and `CORS_ORIGINS=https://docu-chain-h85.vercel.app`

## API (selected)
- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Documents: `GET/POST /api/documents`, `GET/PUT/DELETE /api/documents/:id`, `POST /api/documents/upload`
- PDF Ops: `POST /api/documents/optimize`, `extract-text`, `protect`, `split`

## License
MIT
