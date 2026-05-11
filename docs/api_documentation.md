
---

# 📄 `api_documentation.md`

Since there is **no backend**, your "API" is just internal functions.

```md
# API Documentation - Daily Spending PWA (Local API)

## Overview
This project does not use a server backend.
All data operations are done through local database services (IndexedDB).

---

# Spending Service API

## addDailySpending(date, amount, note)
Adds a daily spending record.

Input:
- date: string (YYYY-MM-DD)
- amount: number
- note: string

Output:
- recordId

---

## getDailySpending(date)
Returns spending record for a given date.

---

## updateDailySpending(id, amount, note)
Updates an existing record.

---

## deleteDailySpending(id)
Deletes a record.

---

## getMonthlySpending(month)
Returns all daily spending records in the given month.

month format: YYYY-MM

---

# Budget Service API

## setDailyBudget(limit)
Stores daily budget limit.

## getDailyBudget()
Returns daily budget limit.

---

# Bills Service API

## addBill(title, amount, dueDate, frequency)
Adds upcoming bill.

## getBills()
Returns all bills.

## markBillPaid(id)
Updates bill status to paid.

## getBillsDueSoon(days)
Returns bills due within the next X days.

---

# AI Service API (Optional)

## generateAIInsight(month)
Sends monthly spending data to AI model API and returns advice.