# Agent Flow - Daily Spending PWA

## Agent Name
DailySpend Advisor AI

## Goal
Analyze user's daily spending pattern and provide forecast + recommendations.

---

## Inputs
- daily spending records (current month)
- daily budget limit
- upcoming bills
- optional monthly income

---

## Processing Steps

### Step 1: Read Spending Data
- total spent this month
- average spending per day
- days remaining in month

### Step 2: Forecast
forecastTotal = avgDailySpend * totalDaysInMonth

### Step 3: Bill Risk Check
If upcoming bills > remaining balance -> raise risk level.

### Step 4: Recommendation
Generate suggestions:
- reduce daily spending
- highlight risky days
- suggest budget adjustment

---

## Output JSON
```json
{
  "riskLevel": "MEDIUM",
  "forecastTotal": 1200,
  "safeDailySpend": 25,
  "insights": [
    "You spend more on weekends."
  ],
  "recommendations": [
    "Try limiting spending to RM20/day."
  ]
}