# CareerPath — Intelligent Career Orientation & Roadmaps
https://careerpath-assistant.ai.studio

[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Embedded_%26_Cloud-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

An intelligent, data-driven career-orientation platform built for college students, young professionals, and career switchers. CareerPath bridges the gap between academic education and modern industry demands through self-assessments, 52+ comprehensive career paths, real-time localized salary benchmarking (**₹ INR in LPA** and **$ USD**), side-by-side career comparisons, milestone-based learning roadmaps, portfolio project defense, and skill readiness tracking.

---

## 🌟 Key Features

### 1. 🎯 Career Interest & Compatibility Assessment
- **10-Factor Psychometric & Technical Quiz**: Evaluates work style, problem-solving preferences, operational environments, and mathematical/creative aptitudes.
- **In-Memory Guest Isolation**: Guests can take assessments with zero authentication required; recommendations compute instantly in-memory without overwriting registered student accounts.
- **Match Factor & Skill Gaps**: Highlights top-matching career tracks with percentage compatibility, rationale, and specific skill gaps to address.

### 2. 📚 Comprehensive 52+ Career Directory
- Detailed taxonomy across 7 modern tracks: **Software Engineering**, **AI & Data Science**, **Cloud & DevOps**, **Cybersecurity**, **Product & UI/UX**, **Digital Growth & Marketing**, and **Quantitative Finance**.
- Profiles detail core responsibilities, foundational education, prerequisite entry difficulty, demand forecasts, top skills, tools, and real-world trade-offs (pros & cons).

### 3. 💰 Dual-Currency Compensation Engine
- **Indian Market Calibration (₹ INR in LPA)**: Tailored specifically for Indian tech graduates and professionals, calibrated against compensation benchmarks in Bengaluru, Hyderabad, Pune, Mumbai, and NCR (e.g. `₹12 - 26 LPA` with full `₹12,00,000 - ₹26,00,000/yr` breakdowns).
- **Global USD Benchmark ($ USD)**: Direct annual US market benchmarks (e.g. `$85k - $145k/yr`).
- **One-Click Navbar & In-Page Switcher**: Switch between **₹ INR** and **$ USD** anywhere on the platform with instant preference persistence via `localStorage`.

### 4. ⚖️ Side-by-Side Career Comparison Matrix
- Compare up to 3 distinct career paths simultaneously.
- Structural analysis of starting compensation, projected market growth, entry difficulty, educational prerequisites, shared vs. unique toolchains, and day-to-day work trade-offs.

### 5. 🗺️ Milestone-Based Interactive Roadmaps
- Structured 4-phase learning progression:
  1. *Foundations & Core Principles*
  2. *Applied Practical Competencies*
  3. *Advanced Systems & Specialization*
  4. *Production Capstone & Portfolio Defense*
- Interactive milestone checklists, progress percentage calculation, and linked hands-on projects.

### 6. 🧪 Hands-On Project Laboratory & Submission Engine
- Curated real-world project specifications with difficulty tiers, hour estimates, and concrete deliverables.
- Portfolio defense submissions accepting **GitHub repository links**, **live deployed demo URLs**, and student execution notes.

### 7. 📊 Career Readiness & Competency Analyzer
- Track your verified competencies against required industry skills for any chosen career.
- Dynamic readiness percentage gauge, categorized skills (Technical, Systems, Soft Skills), and actionable next steps to bridge proficiency gaps.

### 8. 🛡️ Role-Based Administrative Panel
- Multi-role authorization (`STUDENT` vs. `ADMIN`).
- Real-time platform analytics: total user registrations, roadmaps generated, career views, and student feedback.
- Administrative CRUD operations for career directories.

---

## 🏗️ Architecture & Tech Stack

```
careerpath/
├── server.ts                    # Unified Express entry point + Vite middleware
├── server/
│   └── src/
│       ├── controllers/         # Endpoint handlers (auth, careers, roadmaps, quiz, etc.)
│       ├── db/
│       │   ├── client.ts        # Dual-mode DB: pg.Pool (Cloud Postgres) + PGlite (Embedded)
│       │   ├── schema.sql       # PostgreSQL DDL schema with indexes
│       │   ├── seed.ts          # Automatic database seeder
│       │   └── seedGenerator.ts # Comprehensive 52-career dataset
│       ├── middleware/          # JWT auth guards, IDOR protection, sliding-window rate limiters
│       └── routes/              # Express API routers (/api/*)
├── src/
│   ├── components/              # Reusable UI (Navbar, Footer, AuthModal, CurrencySwitch)
│   ├── context/                 # React Contexts (AuthContext, CompareContext, CurrencyContext)
│   ├── pages/                   # Application views (Home, Assessment, Careers, Compare, etc.)
│   ├── services/                # Axios/Fetch API client layer
│   └── types/                   # TypeScript interfaces and shared models
```

### Frontend
- **Framework**: React 19 with Vite 6
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Visuals & Charts**: Recharts & Motion

### Backend
- **Runtime**: Node.js with native TypeScript via `tsx`
- **Framework**: Express 4
- **Security**: `jsonwebtoken` (JWT), `bcryptjs` password hashing, CORS, rate limiting
- **Build System**: `esbuild` for single-bundle server compilation (`dist/server.cjs`)

### Database
- **Dual-Mode Persistence**:
  - **Local Development**: Embedded PostgreSQL via `@electric-sql/pglite` (requires zero Docker or database installations).
  - **Production Deployment**: High-performance PostgreSQL connection pooling via `pg.Pool` automatically activated when `DATABASE_URL` is set.
- **Relational Integrity**: Foreign keys, cascade rules, and query indexes on slugs, categories, and foreign identifiers.

---

## 🔒 Security & Hardening Highlights

- **IDOR Protection**: Milestone step toggles (`PUT /api/roadmaps/steps/:stepId/toggle`) and roadmap deletions join against parent tables and verify ownership against `req.user.id`.
- **Brute-Force Rate Limiting**: IP-based sliding-window rate limiters defend sensitive endpoints (`/auth/login`, `/auth/register`, `/auth/forgot-password`, `/quiz/submit`).
- **Zero SQL Injection**: All queries utilize strict parameterized placeholders (`$1`, `$2`, etc.).
- **Guest State Privacy**: Unauthenticated assessment sessions compute recommendations completely in-memory without polluting student tables.
- **Password Salting**: Passwords hashed with 10 salt rounds of bcrypt and never exposed in API payloads.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/careerpath.git
   cd careerpath
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Note: For local development, the default embedded PGlite database will start automatically without configuring an external PostgreSQL database.*

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Configured Demo Accounts

For instant testing, use the quick-login demo buttons in the top-right navbar, or enter the credentials below:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@careerpath.edu` | `Student@12345` |
| **Administrator** | `admin@careerpath.edu` | `Admin@12345` |

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the unified Express API server and Vite dev server on port 3000 |
| `npm run build` | Builds the React frontend and bundles `server.ts` into `dist/server.cjs` via esbuild |
| `npm start` | Runs the compiled production server (`node dist/server.cjs`) |
| `npm run lint` | Runs TypeScript compilation verification (`tsc --noEmit`) |
| `npm run prisma:seed` | Manually triggers the comprehensive 52-career database seeder |

---

## 🔌 API Reference Overview

| Endpoint | Method | Auth | Description |
| :--- | :---: | :---: | :--- |
| `/api/health` | `GET` | Public | Service health and status check |
| `/api/auth/register` | `POST` | Public (Rate Limited) | Register a new student account |
| `/api/auth/login` | `POST` | Public (Rate Limited) | Authenticate user and receive JWT |
| `/api/auth/me` | `GET` | Bearer Token | Fetch current authenticated profile |
| `/api/careers` | `GET` | Public | Search and filter careers with pagination |
| `/api/careers/:slug` | `GET` | Public | Retrieve full career profile with skills & resources |
| `/api/quiz/questions` | `GET` | Public | Retrieve assessment question bank |
| `/api/quiz/submit` | `POST` | Public / Token | Submit answers & compute career recommendations |
| `/api/roadmaps` | `GET` | Bearer Token | List all generated roadmaps for active user |
| `/api/roadmaps/generate` | `POST` | Bearer Token | Generate a personalized 4-phase milestone roadmap |
| `/api/roadmaps/steps/:id/toggle` | `PUT` | Bearer Token (IDOR Guard) | Toggle milestone step completion |
| `/api/projects` | `GET` | Public | Retrieve curated project specifications |
| `/api/projects/submit` | `POST` | Bearer Token | Submit project GitHub repo & live URL for review |
| `/api/admin/stats` | `GET` | Admin Token | Platform analytics and telemetry metrics |

---

## 👨‍💻 Developer
Atharva Wagh

AI/ML & Software Development Student

GitHub:
https://github.com/atharvawagh-07

## 📄 License

This project is distributed under the MIT License.

See the LICENSE file for details.

## ⭐ Support

If you find CareerPath useful or interesting:

⭐ Star the repository
🐛 Report issues
💡 Suggest improvements
🔀 Submit pull requests

##🚀 CareerPath Assistant

Discover the right direction. Build the right skills. Become career-ready.
