import Dexie from 'dexie';

export const db = new Dexie('dailySpendDB');

db.version(1).stores({
  spending: '++id, date', // stores daily total spending
  budget: 'id',           // stores user budget settings (always id: 1)
  bills: '++id, dueDate, status', // stores upcoming bills
  ai_insights: '++id, month' // (optional) stores cached AI insight results
});

db.version(2).stores({
  spending: '++id, date, category', // now stores individual transactions
  budget: 'id'
}).upgrade(tx => {
  return tx.spending.clear();
});
