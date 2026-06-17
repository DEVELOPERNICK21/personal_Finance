import type { FinanceData, FinanceMetrics } from "./types";

export function calculateMetrics(
  data: FinanceData,
  emergencyFundTarget = 250000
): FinanceMetrics {
  const cashAvailable = data.assets.emergencyCash;
  const investmentValue =
    data.accounts
      .filter((a) => a.type !== "bank")
      .reduce((sum, a) => sum + a.currentValue, 0) + data.assets.providentFund;

  const bankValue = data.accounts
    .filter((a) => a.type === "bank")
    .reduce((sum, a) => sum + a.currentValue, 0);

  const netWorth = bankValue + investmentValue + cashAvailable;

  const monthlyIncome = data.monthly.income;
  const monthlyExpenses =
    data.monthly.momSupport +
    data.monthly.rentUtilities +
    data.monthly.lifestyleCap +
    data.monthly.fixedExpenses +
    data.monthly.variableExpenses;
  const monthlySavings =
    data.monthly.emergencyTopUp + data.monthly.sipCapacity + data.monthly.investments;
  const monthlyRemaining = monthlyIncome - monthlyExpenses - monthlySavings;
  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

  const emergencyGoal = data.goals.find((g) =>
    g.name.toLowerCase().includes("emergency")
  );
  const emergencyCurrent = emergencyGoal?.current ?? data.assets.emergencyCash;
  const emergencyFundProgress = Math.min(
    100,
    (emergencyCurrent / emergencyFundTarget) * 100
  );
  const emergencyFundDeficit = Math.max(0, emergencyFundTarget - emergencyCurrent);
  const monthlyEmergencyPace = data.monthly.emergencyTopUp || 5000;
  const emergencyFundMonthsToTarget =
    emergencyFundDeficit > 0 ? Math.ceil(emergencyFundDeficit / monthlyEmergencyPace) : 0;

  const monthlyBurn = monthlyExpenses;
  const survivalRunwayMonths =
    monthlyBurn > 0 ? (cashAvailable + bankValue) / monthlyBurn : 0;

  const totalAllocated = monthlyExpenses + monthlySavings;
  const salaryAllocation = {
    fixed: totalAllocated > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 0,
    wants: totalAllocated > 0 ? (data.monthly.lifestyleCap / monthlyIncome) * 100 : 0,
    saved: totalAllocated > 0 ? (monthlySavings / monthlyIncome) * 100 : 0,
  };

  const upcomingInsurance = data.insurance
    .filter((p) => p.renewalDate)
    .map((p) => ({ name: p.name, date: p.renewalDate }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextInsuranceRenewal = upcomingInsurance[0] ?? null;

  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 5);
  const nextSipDate = nextMonth.toISOString().split("T")[0];

  return {
    netWorth,
    cashAvailable,
    investmentValue,
    monthlyIncome,
    monthlyExpenses,
    monthlySavings,
    monthlyRemaining,
    savingsRate,
    emergencyFundProgress,
    emergencyFundDeficit,
    emergencyFundMonthsToTarget,
    survivalRunwayMonths,
    salaryAllocation,
    nextInsuranceRenewal,
    nextSipDate,
  };
}
