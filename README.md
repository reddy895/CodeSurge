# CODE SURGE 2K26 ⚡

> **Official College Hackathon Platform**  
> Powered by SynQ Initiative. Built with Node.js, Express, MongoDB (Mongoose), and Modern Cyberpunk Vanilla Web Technologies.

---

## 🚀 Features

- **Dual-Mode Registration**:
  - **Create Team (Leader)**: Generates a unique 6-character alphanumeric Team Code and creates a new team.
  - **Join Team (Member)**: Enter a valid 6-character Team Code to join an existing leader's team.
- **Team Leader Login**:
  - Fast, secure leader login using **Leader Email** and **College Name**.
- **Department Verification System (QR Code)**:
  - Generates a high-contrast Black & White QR Code inside the Team Space.
  - Hackathon Department / Registration Desk scans the QR code to open `verify.html` and verify live team details (Team Name, Code, College, Leader, and Roster).
- **Mobile Phone Dialer Direct Access**:
  - Direct `tel:` mobile dialer integration on organizer contact cards.
- **Node.js + MongoDB Backend**:
  - Express REST API with Mongoose schemas (`User`, `Team`).
  - JWT Bearer Authentication, error handling, CORS, and collision-free Team Code generator.

---

## 🛠️ Project Structure

```text
Code Surge/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   └── teamController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── Team.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   └── teamRoutes.js
│   │   ├── utils/
│   │   │   └── generateTeamCode.js
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── index.html       # Landing, Dual Registration & Leader Login
│   ├── invite.html      # Team Dashboard & Verification QR Code
│   ├── verify.html      # Department QR Scan Verification Portal
│   └── package.json
└── README.md
```

---

## 🏃 Getting Started

### 1. Start the Backend Server
```bash
cd backend
npm install
npm run dev
# Server running at http://localhost:5000
```

### 2. Start the Frontend Dev Server
```bash
cd frontend
npm install
npm run dev
# Frontend running at http://localhost:5173
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register/leader` | Register Leader & Create New Team |
| `POST` | `/api/auth/register/member` | Register Member & Join Team via Code |
| `POST` | `/api/auth/login/leader` | Login Leader via Email & College Name |
| `GET` | `/api/teams/my-team` | Get Current Authenticated User's Team & Roster |
| `GET` | `/api/teams/verify/:team_code` | Public Department QR Code Verification Endpoint |
| `GET` | `/api/admin/teams` | Admin: List All Teams & Members |
| `GET` | `/api/admin/teams/export` | Admin: Export All Teams to CSV |

---

&copy; 2026 CODE SURGE 2K26. All rights reserved.
