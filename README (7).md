# GetVybz Phase 5 – Beta Build

## 🚀 Quick Start

### 1. Start Postgres
```bash
docker-compose up -d
```

### 2. Setup Environment
```bash
cp .env.example .env
```

### 3. Install & Run All
```bash
npm install
npm run dev
```
This starts:
- Backend API (http://localhost:5000)
- Mobile app (Expo, scan QR code)
- Admin dashboard (http://localhost:3000)

### 4. Demo Logins
- User: demo1@getvybz.com / password
- User: demo2@getvybz.com / password
- Admin: admin@getvybz.com / admin123

### 5. Deployment
- **Backend**: Deploy to Render/Heroku (uses DATABASE_URL)
- **Admin**: Deploy to Vercel/Netlify
- **Mobile**: Publish via Expo → TestFlight (iOS) / Play Store (Android)
