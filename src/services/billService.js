import { db } from '../db/indexedDb';

export const billService = {
  // Add a new upcoming bill
  addBill: async (title, amount, dueDate, frequency = 'one-time') => {
    return await db.bills.add({
      title,
      amount,
      dueDate,
      frequency,
      status: 'unpaid',
      createdAt: new Date().toISOString(),
    });
  },

  // Get all bills
  getBills: async () => {
    return await db.bills.toArray();
  },

  // Mark a bill as paid
  markBillPaid: async (id) => {
    return await db.bills.update(id, { status: 'paid' });
  },

  // Get bills due within the next X days
  getBillsDueSoon: async (days = 3) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    const todayStr = today.toISOString().split('T')[0];
    const futureDateStr = futureDate.toISOString().split('T')[0];

    return await db.bills
      .where('dueDate')
      .between(todayStr, futureDateStr, true, true)
      .and(bill => bill.status === 'unpaid')
      .toArray();
  }
};
