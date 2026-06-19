import type { FinanceData } from "./types";

/** Blank slate for new users — no sample names, balances, or nominees. */
export function createEmptyFinanceData(): FinanceData {
  return {
    lastUpdated: new Date().toISOString(),
    assets: {
      emergencyCash: 0,
      vaultLocation: "",
      providentFund: 0,
      uanNumber: "",
    },
    monthly: {
      income: 0,
      fixedExpenses: 0,
      variableExpenses: 0,
      investments: 0,
      momSupport: 0,
      rentUtilities: 0,
      lifestyleCap: 0,
      emergencyTopUp: 0,
      sipCapacity: 0,
    },
    accounts: [],
    goals: [],
    insurance: [],
    documents: [],
    contacts: [],
    receivables: [],
    instructions: {
      salaryAccount: "",
      investmentLocations: "",
      insuranceClaimSteps: "",
      firstContact: "",
      additionalNotes: "",
    },
    monthEndChecklist: {
      verifyBankLogs: false,
      confirmSipClearance: false,
      verifyBurnUnder30k: false,
      auditPolicyDates: false,
    },
    sosMode: false,
  };
}

/** @deprecated Use createEmptyFinanceData() */
export const DEFAULT_FINANCE_DATA: FinanceData = createEmptyFinanceData();

/** Merge saved user data onto empty defaults (never injects demo/sample values). */
export function normalizeFinanceData(partial: Partial<FinanceData>): FinanceData {
  const empty = createEmptyFinanceData();
  return {
    ...empty,
    ...partial,
    lastUpdated: partial.lastUpdated ?? empty.lastUpdated,
    assets: { ...empty.assets, ...partial.assets },
    monthly: { ...empty.monthly, ...partial.monthly },
    instructions: { ...empty.instructions, ...partial.instructions },
    accounts: partial.accounts ?? empty.accounts,
    goals: partial.goals ?? empty.goals,
    insurance: partial.insurance ?? empty.insurance,
    documents: partial.documents ?? empty.documents,
    contacts: partial.contacts ?? empty.contacts,
    receivables: partial.receivables ?? empty.receivables,
    monthEndChecklist: {
      ...empty.monthEndChecklist,
      ...partial.monthEndChecklist,
    },
    sosMode: partial.sosMode ?? false,
  };
}
