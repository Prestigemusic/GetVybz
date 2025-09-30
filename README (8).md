# GetVybz Full Skeleton (Hybrid AI)

This is the **full project scaffold** with mobile app, backend, AI microservice, and admin dashboard.

## 🚀 Quick Start

### 1. Install all dependencies
```bash
npm run install:all
```

### 2. Start backend + mobile
```bash
npm run dev
```

- Mobile runs on Expo (scan QR code in Expo Go app).
- Backend API runs at `http://localhost:5000`.

### 3. Start AI microservice (Python)
```bash
cd ai-service
pip install -r requirements.txt
uvicorn src.index:app --reload --port 8000
```

### 4. Start Admin Dashboard
```bash
cd admin-dashboard
npm run dev
```

---

## ⚡ Architecture
- **Mobile (Expo React Native)** → user app (Splash, Welcome, Auth, Booking, Profile).  
- **Backend (Node.js + Express)** → core API, auth, booking, payments.  
- **AI-Service (Python FastAPI)** → heavy ML models, recommender, translator.  
- **Admin Dashboard (React)** → management portal.  

---

## 🛠 Common Fixes
- Expo cache issues: `expo start -c`
- Backend port conflicts: `kill -9 $(lsof -t -i:5000)`
- AI service port conflicts: `kill -9 $(lsof -t -i:8000)`

