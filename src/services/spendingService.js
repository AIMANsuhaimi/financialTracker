import { db } from '../db/indexedDb';

export const spendingService = {
  getDailyTransactions: async (date) => {
    return await db.spending.where('date').equals(date).toArray();
  },

  getDailyTotal: async (date) => {
    const tx = await db.spending.where('date').equals(date).toArray();
    return tx.reduce((acc, curr) => acc + curr.amount, 0);
  },

  getMonthlyTransactions: async (monthPrefix) => {
    // monthPrefix = "YYYY-MM"
    return await db.spending.where('date').startsWith(monthPrefix).toArray();
  },

  addTransaction: async (date, amount, category, note) => {
    return await db.spending.add({
      date,
      amount,
      category,
      note,
      timestamp: Date.now()
    });
  },

  deleteTransaction: async (id) => {
    return await db.spending.delete(id);
  }
};
