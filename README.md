# Ronda — Barangay Incident Reporting App

> **Academic Project Prototype** — Developed as a course requirement for **GE-TFL (Technology for Less)**, a General Education subject that explores how technology can be designed and applied to address real-world challenges faced by underserved communities.

Ronda is a mobile-friendly web app that lets residents quickly report emergencies and community issues to barangay officials. Reports are visible to the community in real time, and officials can update their status as they respond.

The project focuses on reducing delays in incident reporting and helping barangay officials respond faster — particularly in areas where communication infrastructure is limited.

---

## Features

**For Residents**
- Submit incident reports with a type, description, optional photo, and location
- Browse a live community feed of all reports in the barangay
- View and track the status of your own reports
- Search reports by keyword, type, or location

**For Barangay Officials**
- View all submitted reports on a dedicated dashboard
- Filter reports by status (Pending, In Progress, Resolved)
- Update report status and add official notes
- See reporter details and photo evidence

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
Ronda/
├── frontend/
│   └── src/
│       ├── views/           # Page components (Login, Register, Dashboards, ReportForm)
│       ├── controllers/     # Custom hooks (useAuth, useReports)
│       └── services/        # API layer (api.js, authService.js, reportService.js)
│
└── backend/
    ├── controllers/         # Request handlers (authController, reportController)
    ├── models/              # Supabase queries (reportModel, userModel)
    ├── routes/              # Express routes (authRoutes, reportRoutes)
    ├── middleware/          # Auth + role guard (authMiddleware)
    └── db/
        └── supabaseClient.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- npm or yarn

---

### 1. Clone the repository

```bash
git clone https://github.com/alferrr/Ronda.git
cd Ronda
```

---

### 2. Set up Supabase

Run the contents of `supabase_schema.sql` in your **Supabase SQL Editor**. This creates the `profiles` and `reports` tables, storage bucket, and disables RLS for the MVP.

---

### 3. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CLIENT_URL=http://localhost:5173
PORT=3000
```

Start the server:

```bash
npm run dev
```

The API will be running at `http://localhost:3000`.

---

### 4. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the dev server:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive session token |
| GET | `/api/auth/me` | Authenticated | Get current user profile |

### Reports
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/reports` | Resident | Submit a new report |
| GET | `/api/reports` | Authenticated | Get all reports (community feed) |
| GET | `/api/reports/my` | Resident | Get own reports |
| GET | `/api/reports/:id` | Authenticated | Get a single report |
| PATCH | `/api/reports/:id/status` | Official | Update report status |

---

## Incident Types

`fire` `medical` `crime` `flood` `accident` `disturbance` `infrastructure` `other`

## Report Statuses

`pending` → `in_progress` → `resolved`

---

## Deployment

### Backend — Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Set the root directory to `backend`
4. Set the build command to `npm install` and start command to `node index.js`
5. Add your environment variables under **Environment**

### Frontend — Vercel

1. Import your repository on [Vercel](https://vercel.com)
2. Set the root directory to `frontend`
3. Add the environment variable:
   ```
   VITE_API_URL=https://your-render-service.onrender.com/api
   ```
4. Deploy

---

## Environment Variables

### Backend
| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (keep secret) |
| `CLIENT_URL` | Frontend URL for CORS (no trailing slash) |
| `PORT` | Port for the Express server (default 3000) |

### Frontend
| Variable | Description |
|---|---|
| `VITE_API_URL` | Full base URL of the backend API |

---

## Roadmap

- [ ] SMS fallback for low-connectivity areas
- [ ] Offline report saving with sync on reconnect
- [ ] Push notifications for status updates
- [ ] Map view of active incidents
- [ ] Barangay-scoped report filtering

---

## Author

Built by [Alfer Mercado](https://github.com/alferrr) as a project prototype for **GE-TFL (Technology for Less)**, a General Education subject. The app addresses real community needs in Cebu City, Philippines, by making barangay incident reporting faster and more accessible.
