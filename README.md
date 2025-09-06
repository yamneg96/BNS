# 🏥 Bed Notification & Assignment System (Without HIS Integration)

A **MERN-stack web application** designed to provide **real-time bed notifications and dynamic assignments** in hospitals.  
It helps **admins, nurses, residents, interns, and students** stay updated with **admission events** using **RBAC (role-based access control)**, push notifications, and audit logs.  

Unlike bulky HIS/EHR systems, this project is **lightweight, mobile-first, and easy to deploy**.

---

## ✨ Features
- 🔑 **User Authentication** (Register/Login with JWT)  
- 🛡 **Role-Based Access Control (RBAC)** (Admin, Nurse, Resident, Intern, Student)  
- 🛏 **Dynamic Bed Assignment** (claim or release beds in real time)  
- 🔔 **Real-Time Notifications** (manual admission triggers → instant alerts)  
- 📊 **Admin Dashboard** (audit logs, shift tracking, user management)  
- 📱 **Mobile-First UI** with **TailwindCSS**  

---

## 🖥 Tech Stack
### Frontend
- ⚡ [React + Vite](https://vitejs.dev/)  
- 🎨 [Tailwind CSS](https://tailwindcss.com/)  
- 🌐 Axios for API calls  
- 🔔 Service Worker (for future web push notifications)  

### Backend
- 🟢 [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)  
- 🍃 [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)  
- 🔑 JWT + bcrypt for authentication & security  
- 📡 REST API with role-based access  

---

## 📂 Project Structure
```plaintext
bed-notification-system/
│── backend/                # Node.js + Express API
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth & RBAC
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   └── server.js       # Entry point
│
│── frontend/               # React + Vite + Tailwind
│   ├── src/
│   │   ├── assets/         # Images, icons
│   │   ├── components/     # Navbar, Sidebar, etc.
│   │   ├── pages/          # Login, Dashboard, etc.
│   │   ├── context/        # AuthContext, NotificationContext
│   │   └── services/       # Axios API calls
│
└── README.md
```
---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/yamneg96/bed-notification-system.git
cd bed-notification-system
```

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Run backend:

```
npm run server
```

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🚀 API Endpoints

### Auth Routes

* `POST /api/auth/register` → Register user (with role)
* `POST /api/auth/login` → Login user & return JWT
* `GET /api/auth/profile` → Get current user (protected)
* `GET /api/auth/all` → Get all users (admin only)

---

## 🧪 Testing

Use **Postman** or **curl** to test API endpoints. Example:

```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Alice","email":"alice@example.com","password":"123456","role":"nurse"}'
```

---

## 📌 Roadmap

* ✅ Authentication + RBAC
* ✅ Bed assignment & notifications
* ⬜ Push notification service worker
* ⬜ Shift expiry automation
* ⬜ Admin dashboards & analytics

---

## 📜 License

MIT License © 2025.
