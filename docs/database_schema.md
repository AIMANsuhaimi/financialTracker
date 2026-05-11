# Database Schema - Daily Spending PWA (IndexedDB)

## Database Name
dailySpendDB

Recommended library:
- Dexie.js

---

# Tables

## 1. spending
Stores daily total spending.

| Field | Type | Notes |
|------|------|------|
| id | auto-increment | Primary Key |
| date | string | YYYY-MM-DD unique |
| totalAmount | number | required |
| note | string | optional |
| createdAt | datetime | auto |

Index:
- date

---

## 2. budget
Stores user budget settings.

| Field | Type | Notes |
|------|------|------|
| id | number | always 1 |
| dailyLimit | number | required |
| rollover | boolean | optional |
| updatedAt | datetime | auto |

---

## 3. bills
Stores upcoming bills.

| Field | Type | Notes |
|------|------|------|
| id | auto-increment | Primary Key |
| title | string | required |
| amount | number | required |
| dueDate | string | YYYY-MM-DD |
| frequency | string | one-time/weekly/monthly/yearly |
| status | string | paid/unpaid |
| createdAt | datetime | auto |

Index:
- dueDate
- status

---

## 4. ai_insights (optional)
Stores cached AI insight results.

| Field | Type | Notes |
|------|------|------|
| id | auto-increment | Primary Key |
| month | string | YYYY-MM |
| riskLevel | string | LOW/MEDIUM/HIGH |
| forecastTotal | number | predicted |
| safeDailySpend | number | recommended |
| insights | array/json | stored |
| recommendations | array/json | stored |
| createdAt | datetime | auto |