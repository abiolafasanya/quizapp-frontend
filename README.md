# Quiz App Frontend

Frontend for the **QuizMe App**, built with:

- **React 19 + TypeScript**
- **Vite** as build tool
- **Tailwind CSS v4** for styling
- **Zustand** for state management
- **React Query v5** for API data fetching & caching
- **React Router v7** for routing
- **Axios** for HTTP requests
- **Radix UI + Lucide Icons** for UI components and icons
- **React Hook Form + Zod** for forms & validation

---

## ⚡️ Features

- **Authentication (Login / Register)**

  - Combined login/register form
  - JWT stored in Zustand/localStorage
  - Redirect to Questions page after login

- **Questions Management (Protected)**

  - List all questions in a table/card format
  - Add new question (text + 4 options + correct answer)
  - Edit & Delete existing questions
  - Only accessible after login

- **Quiz Interface**

  - One question at a time
  - Next / Previous navigation
  - Timer (elapsed mm\:ss)
  - Submit button → Results page
  - Results: total score, correct count, time taken

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js **20.x LTS** (recommended)
- npm or yarn
- Backend API running (default: `http://localhost:8000`)

### 2. Clone & Install
```bash
git clone https://github.com/abiolafasanya/quizapp-frontend
cd quizapp-frontend
npm install
```

### 3. Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:8000
```

For production deployment:

```env
VITE_API_URL=https://quizapp-backend-kqbd.onrender.com
```

### 4. Run (Dev)

```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

### 5. Build & Preview

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── api/              # Axios instance & API modules
├── assets/           # Images, static files
├── components/       # Shared UI components
├── features/         # Quiz, Auth, Admin modules
├── libs/             # Utilities, helpers
├── page/             # Route-level pages
├── store/            # Zustand stores
├── types/            # TypeScript types/interfaces
├── App.tsx
├── main.tsx
└── index.css         # Tailwind entry
```

---

## ✅ Available Scripts

```jsonc
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext .ts,.tsx"
}
```

---

## 🔐 Authentication & API

- JWT returned from backend (`/api/auth/login`)
- Stored in **Zustand** + localStorage for persistence
- Axios instance attaches token for protected API requests
- React Query manages caching & refetching

---

## 🧪 Demo Account

Use the following credentials to test the app:

```txt
Email: abiolafasanya@yopmail.com
Password: test12345
```

> These credentials are also configured in the backend seed script so the evaluator can log in immediately without registering.

---

## 🌐 Deployment

Deployed on **Vercel**:
👉 [https://quizapp-frontend-seven.vercel.app/](https://quizapp-frontend-seven.vercel.app/)

Backend deployed on **Render**:
👉 [https://quizapp-backend-kqbd.onrender.com](https://quizapp-backend-kqbd.onrender.com)

Database hosted on **Supabase**.

---

## 🛠 Troubleshooting

- **CORS errors** → Ensure backend `cors({ origin: ["http://localhost:5173", "https://quizapp-frontend-seven.vercel.app/"], credentials: true })`.
- **Auth not persisting** → Check Zustand + localStorage integration.
- **Quiz not refreshing on retake** → Use `qc.invalidateQueries({ queryKey: ["questions"] })` to fetch fresh data.
- **Tailwind plugin error** → Use Vite 6 with `@tailwindcss/vite@^4`, or configure via PostCSS.

---

## 📄 License

MIT © Abiola Fasanya

---
