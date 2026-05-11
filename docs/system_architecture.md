# System Architecture - Daily Spending PWA

## Architecture Type
Standalone Offline-First PWA (Client-Only)

This app does not require any backend server.
All user data is stored locally on the device.

---

## Main Components

### 1. PWA Frontend
Responsibilities:
- UI pages (Dashboard, Add Spending, Bills, Summary).
- Input validation and calculations.
- Offline storage management.
- Service worker caching.
- Notifications.

---

### 2. Local Database (IndexedDB)
Responsibilities:
- Store daily spending records.
- Store budget settings.
- Store bills data.
- Store AI insights cache (optional).

Recommended library:
- Dexie.js (IndexedDB wrapper)

---

### 3. Optional AI Integration
AI can be implemented in 2 modes:

#### Mode A: Online AI (API)
- Calls OpenAI / Gemini API
- Requires internet connection
- Requires API key

#### Mode B: Offline AI (Local Model)
- Possible but heavy (not recommended for beginner)

---

## Data Flow

### Daily Input Flow
User enters spending -> stored in IndexedDB -> dashboard updates

### Monthly Summary Flow
User opens summary -> app reads IndexedDB -> calculates totals -> display charts

### Bill Reminder Flow
Bills stored locally -> service worker triggers notification

### AI Forecast Flow
App prepares monthly data -> send to AI API -> receives advice -> store insight locally