import { spendingService } from './spendingService';
import { budgetService } from './budgetService';
import { billService } from './billService';

export const aiService = {
  generateInsight: async () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const [transactions, budget, bills] = await Promise.all([
      spendingService.getMonthlyTransactions(currentMonth),
      budgetService.getDailyBudget(),
      billService.getBills()
    ]);

    const totalSpent = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const dailyLimit = budget?.dailyLimit || 0;
    const monthlyIncome = budget?.monthlyIncome || 0;
    
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const currentDay = today.getDate();
    const remainingDays = daysInMonth - currentDay + 1;

    const avgDailySpend = currentDay > 1 ? totalSpent / (currentDay - 1) : totalSpent;
    const forecastTotal = totalSpent + (avgDailySpend * remainingDays);
    
    const unpaidBillsTotal = bills
      .filter(b => b.status === 'unpaid')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const targetMonthlyBudget = monthlyIncome > 0 ? monthlyIncome : (dailyLimit * daysInMonth);
    const utilization = targetMonthlyBudget > 0 ? (totalSpent / targetMonthlyBudget) * 100 : 0;
    
    // Analyze Risk Level
    let riskLevel = 'LOW';
    if (forecastTotal > targetMonthlyBudget) {
      riskLevel = 'HIGH';
    } else if (forecastTotal + unpaidBillsTotal > targetMonthlyBudget * 0.9) {
      riskLevel = 'MEDIUM';
    }

    // Calculate Safe Daily Spend
    const remainingBudgetForMonth = targetMonthlyBudget - totalSpent - unpaidBillsTotal;
    const safeDailySpend = remainingDays > 0 ? Math.max(0, remainingBudgetForMonth / remainingDays) : 0;

    // Analyze Categories
    const categoryTotals = transactions.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});
    const sortedCategories = Object.entries(categoryTotals).sort((a,b) => b[1]-a[1]);
    const topCategory = sortedCategories[0];

    // Generate Insights & Recommendations
    const insights = [];
    const recommendations = [];

    if (totalSpent === 0) {
      insights.push("You haven't recorded any spending yet this month.");
      recommendations.push("Start tracking your daily expenses to get personalized insights.");
      return { riskLevel: 'LOW', forecastTotal: 0, safeDailySpend: dailyLimit, insights, recommendations, analytics: [] };
    }

    insights.push(`Based on your habits, you are projected to spend RM ${forecastTotal.toFixed(2)} this month.`);
    
    if (topCategory && topCategory[1] > 0) {
      const pct = ((topCategory[1] / totalSpent) * 100).toFixed(0);
      insights.push(`You spend ${pct}% of your money on ${topCategory[0]}.`);
    }

    if (unpaidBillsTotal > 0) {
      insights.push(`You have RM ${unpaidBillsTotal.toFixed(2)} in upcoming unpaid bills.`);
    }

    if (riskLevel === 'HIGH') {
      recommendations.push("You are pacing to exceed your monthly limit. Cut back immediately.");
      if (topCategory && topCategory[1] > 0) {
        recommendations.push(`Try reducing your ${topCategory[0]} expenses to stay on track.`);
      }
      recommendations.push(`Limit daily spending to RM ${safeDailySpend.toFixed(2)}.`);
    } else if (riskLevel === 'MEDIUM') {
      recommendations.push("You are close to your limits. Be mindful of your upcoming bills.");
    } else {
      recommendations.push("Great job! You are spending well within your means.");
      if (monthlyIncome > 0 && remainingBudgetForMonth > 0) {
        recommendations.push(`You are on track to save RM ${remainingBudgetForMonth.toFixed(2)} this month!`);
      }
    }

    // Prepare Analytical Data
    const analytics = [
      { label: "Budget Utilization", value: `${utilization.toFixed(1)}%` },
      { label: "Daily Average", value: `RM ${avgDailySpend.toFixed(2)}` },
      { label: "Top Expense", value: topCategory ? topCategory[0] : 'N/A' },
      { label: "Projected Savings", value: remainingBudgetForMonth > 0 ? `RM ${remainingBudgetForMonth.toFixed(2)}` : 'RM 0.00' }
    ];

    return {
      riskLevel,
      forecastTotal,
      safeDailySpend,
      insights,
      recommendations,
      analytics
    };
  }
};
