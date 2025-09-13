# 🏥 Bed Notification System (BNS) – Without HIS Integration

A **MERN-stack web application** designed to provide **real-time bed notifications and dynamic assignments** in hospitals.  
It helps **C1 students, C2 students, interns, and admins** stay updated with **bed responsibilities and patient admission/withdrawal events** using **RBAC (role-based access control)**, in-app notifications, and a lightweight admin panel.  

Unlike bulky HIS/EHR systems, this project is **lightweight, mobile-first, and easy to deploy**.

---

## ✨ Features
- 🔑 **User Authentication** (Register/Login with JWT)  
- 🛡 **Role-Based Access Control (RBAC)** (C1, C2, Intern, Admin)  
- 🛏 **Bed Assignment** (users assign themselves to beds daily)  
- 🔔 **Notification Panel** (Dept → Ward → Beds → Notify responsible person)  
- ➕ **Patient Admitted / Patient Withdrawn** actions beside notifications  
- 👤 **Profile Section** (“Hello [Name]” → profile with user info + bed assignments)  
- 📊 **Admin Panel** (update actual beds, wards, available/rejected counts for all departments)  
- 📱 **Mobile-First UI** with **TailwindCSS**  

---

## 🖥 Tech Stack
### Frontend
- ⚡ [React + Vite](https://vitejs.dev/)  
- 🎨 [Tailwind CSS](https://tailwindcss.com/)  
- 🌐 Axios for API calls  
- 🔔 Service Worker (future push notifications)  

### Backend
- 🟢 [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)  
- 🍃 [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)  
- 🔑 JWT + bcrypt for authentication & RBAC  
- 📡 REST API for communication  

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
│   │   ├── components/     # Navbar, Cards, Modal, etc.
│   │   ├── pages/          # Home, Dashboard, Assignments, Notifications, Profile, Admin
│   │   ├── context/        # AuthContext
│   │   └── services/       # Axios API calls (auth, beds, notifications, admin)
│
└── README.md
````

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yamneg96/bed-notification-system.git
cd bed-notification-system
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/bns
JWT_SECRET=supersecretkey
PORT=5000
```

Run backend:

```bash
npm run dev
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

* `POST /api/auth/register` → Register user (role: C1, C2, Intern, Admin)
* `POST /api/auth/login` → Login user & return JWT
* `GET /api/auth/profile` → Get current user (protected)

### Bed Routes

* `POST /api/beds/assign` → Assign beds for the logged-in user
* `GET /api/beds/my` → Get logged-in user’s bed assignments

### Notification Routes

* `GET /api/notifications` → Get notifications
* `POST /api/notifications/admit/:bedId` → Admit patient to a bed
* `POST /api/notifications/withdraw/:bedId` → Withdraw patient from a bed

### Admin Routes

* `GET /api/admin/stats` → Get system-wide stats (beds, wards, available, rejected)
* `POST /api/admin/update` → Update system-wide data

---

## 🧪 Testing

Use **Postman** or **curl** to test API endpoints. Example:

---

## 📌 Roadmap

* ✅ Authentication + RBAC (C1, C2, Intern, Admin)
* ✅ Bed assignment & notifications
* ✅ Patient admitted/withdrawn actions
* ⬜ Push notification service worker
* ⬜ Shift expiry automation
* ⬜ Advanced analytics dashboards

---

## 📜 License

MIT License © 2025.
Developed for real-time hospital communication efficiency.
