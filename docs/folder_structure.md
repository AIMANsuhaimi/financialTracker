# Folder Structure - Daily Spending PWA

dailyspend-pwa/
│
├── docs/
│   ├── project_overview.md
│   ├── system_architecture.md
│   ├── folder_structure.md
│   ├── implementation_plan.md
│   ├── module_specifications.md
│   ├── agent_flow.md
│   ├── api_documentation.md
│   └── database_schema.md
│
├── public/
│   ├── icons/
│   ├── manifest.json
│   └── service-worker.js
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── BudgetCard.jsx
│   │   ├── BillCard.jsx
│   │   └── ChartCard.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── AddSpending.jsx
│   │   ├── Bills.jsx
│   │   ├── Summary.jsx
│   │   └── Settings.jsx
│   │
│   ├── db/
│   │   ├── indexedDb.js
│   │   └── schema.js
│   │
│   ├── services/
│   │   ├── spendingService.js
│   │   ├── budgetService.js
│   │   ├── billService.js
│   │   └── aiService.js
│   │
│   ├── utils/
│   │   ├── dateUtils.js
│   │   ├── calcUtils.js
│   │   └── formatUtils.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── README.md