# 🏥 Bed Notification System (BNS) + Clinical RAG AI

A **MERN-stack web application** designed for real-time bed management and **AI-powered clinical decision support**. 

This project has evolved from a simple notification tool into a **Retrieval-Augmented Generation (RAG)** system. It allows hospital staff to leverage local medical guidelines (`.pdf`, `.docx`, `.txt`) to generate grounded diagnostic suggestions, ensuring AI advice is aligned with specific hospital protocols.

---

## ✨ Features
- 🧠 **Multi-Model AI RAG:** Diagnostic suggestions powered by **Google Gemini 2.0**, **Groq (Llama 3)**, and **OpenAI GPT-4o**.
- 📂 **Local Knowledge Base:** Automated parsing of local protocols (e.g., `BNS_RAG_TRAIN.pdf`) to ground AI responses in actual clinical data.
- 🛡 **Human-in-the-Loop:** A "Staging" UI where doctors review, **Accept**, or **Reject** AI suggestions before syncing to the patient registry.
- 🔴 **Dynamic Risk Assessment:** Automated categorization of patient risk (Low, Medium, High) with color-coded UI alerts.
- 🔑 **User Authentication:** Secure Login/Register with JWT.
- 🛡 **Role-Based Access Control (RBAC):** Permissions for C1, C2, Interns, and Admins.
- 🛏 **Bed Assignment:** Real-time self-assignment and patient admission/withdrawal tracking.
- 📱 **Mobile-First UI:** Responsive design built with **Tailwind CSS**.

---

## 🖥 Tech Stack
### Frontend
- ⚡ [React + Vite](https://vitejs.dev/)
- 🎨 [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- 🌐 Axios for API calls
- 🔔 React-Hot-Toast for real-time status feedback

### Backend (The RAG Engine)
- 🟢 [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- 🍃 [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- 🤖 **AI SDKs:** `@google/generative-ai`, `groq-sdk`, `openai`
- 📄 **Document Parsers:** `pdf-parse`, `mammoth` (for DOCX support)

---

## 📂 Project Structure
```plaintext
bed-notification-system/
│── backend/ 
│   ├── data/
│   │   └── medical_kb/      # 📄 Local PDF/DOCX guidelines (The Knowledge Base)
│   ├── src/
│   │   ├── controllers/     # logic for Gemini, Groq, and GPT-4o
│   │   ├── middleware/     # Auth & RBAC
│   │   ├── models/         # Mongoose schemas (Bed, User, Patient)
│   │   ├── routes/         # API endpoints including new /api/ai routes
│
│── frontend/
│   ├── src/
│   │   ├── components/     # WardBedContainer (with AI Review logic)
│   │   ├── services/       # aiService.js (Multi-provider routing)
│   │   └── context/        # AuthContext
🚀 AI Implementation (RAG)
1. Retrieval Logic
The system uses Simple RAG via keyword matching. When a "Chief Complaint" is entered, the backend:

Reads the local medical files in /data/medical_kb/.

Filters lines containing keywords from the complaint.

Injects the top relevant excerpts into the AI prompt as "Reference Data."

2. Model Redundancy
To bypass API rate limits and ensure 100% uptime, BNS supports three providers:

Gemini 2.0: Primary clinical reasoning engine.

Groq/Llama 3: High-speed backup engine.

GPT-4o Mini: Stable fallback for structured JSON responses.

⚙️ Installation & Setup
1️⃣ Clone & Install
Bash

git clone [https://github.com/yamneg96/bed-notification-system.git](https://github.com/yamneg96/bed-notification-system.git)
cd bed-notification-system
# Install backend deps
cd backend && npm install
# Install frontend deps
cd ../frontend && npm install
2️⃣ Environment Variables (backend/.env)
Code snippet

MONGO_URI=your_mongodb_uri
JWT_SECRET=supersecretkey
PORT=5000

# AI API Keys
GEMINI_API_KEY=your_key
GROQ_API_KEY=your_key
OPENAI_API_KEY=your_key
3️⃣ Run Development Servers
Backend: npm run dev (Port 5000)

Frontend: npm run dev (Port 5173)

🚀 API Endpoints
AI Service Routes
POST /api/ai/gemini_predict → Grounded diagnosis via Google Gemini.

POST /api/ai/groq_pedict → Fast diagnosis via Groq/Llama.

POST /api/ai/gbt_predict → Structured diagnosis via OpenAI.

Bed & Patient Routes
POST /api/beds/assign → Assign beds to user.

POST /api/notifications/admit/:bedId → Admit patient.

POST /api/notifications/withdraw/:bedId → Discharge patient.

📌 Roadmap
✅ RAG Phase 1: Simple keyword-based context retrieval.

✅ Multi-AI Support: Gemini, Groq, and OpenAI integration.

🔄 RAG Phase 2 (Future): Semantic Vector Search (using Embeddings) to replace keyword matching.

🔄 Source Citations: Displaying exact PDF page/line numbers for every AI suggestion.

📱 Push Notifications: Implementation of Service Workers for mobile alerts.

📜 License
MIT License © 2026.

Optimizing clinical workflows through intelligent automation.