# GetVybz (Phase 1)

This is the Phase 1 scaffold with Splash, Welcome, Login, Signup, and backend auth stubs.

## 🚀 Quick Start

1. Extract the zip and open a terminal in the project folder
2. Install dependencies:
   ```bash
   npm run install:all
   ```
3. Start both Expo (mobile) + Backend:
   ```bash
   npm run dev
   ```
4. Scan QR code with Expo Go (on phone) or use emulator.

## ⚡ Notes
- On emulator: works out of the box with `localhost`.
- On physical device: edit `mobile/.env` and replace `API_URL` with your computer's LAN IP (e.g., `http://192.168.1.25:5000`).

## 🛠 Common Fixes
- Expo cache issues: `expo start -c`
- Port conflicts: `kill -9 $(lsof -t -i:5000)`
- Missing .env: copy from `backend/.env.example` to `backend/.env`
