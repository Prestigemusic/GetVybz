# GetVybz Phase 2 – Profiles + Database

## 🚀 Quick Start

### 1. Start Postgres
```bash
docker-compose up -d
```

### 2. Migrate & Seed DB
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 3. Run Backend + Mobile
```bash
npm run dev
```

- Backend → http://localhost:5000  
- Mobile → Expo QR / emulator  

### 4. Test Demo Users
- demo1@getvybz.com / password  
- demo2@getvybz.com / password  

Go to Profile screen → Edit → Save → changes persist in Postgres! 🎉
