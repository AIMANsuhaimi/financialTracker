import { db } from '../db/indexedDb';

export const budgetService = {
  getDailyBudget: async () => {
    return await db.budget.get(1);
  },

  setDailyBudget: async (dailyLimit, rollover = false, monthlyIncome = 0) => {
    const existing = await db.budget.get(1);
    await db.budget.put({ 
      id: 1, 
      dailyLimit, 
      rollover,
      monthlyIncome: existing && !monthlyIncome && monthlyIncome !== 0 ? existing.monthlyIncome : monthlyIncome,
      updatedAt: new Date().toISOString()
    });
  }
};
