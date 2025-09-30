# GetVybz Phase 3 – Bookings

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

### 4. Test Demo Users + Bookings
- demo1@getvybz.com / password  
- demo2@getvybz.com / password  

**Bookings:**  
- Demo1 booked Demo2 (pending)  
- Demo2 booked Demo1 (confirmed)  

Go to Bookings screen → view, create new, confirm bookings! 🎉
