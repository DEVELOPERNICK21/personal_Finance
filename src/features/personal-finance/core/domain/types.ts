export type AccountType =
  | "bank"
  | "epf"
  | "ppf"
  | "nps"
  | "mutual_fund"
  | "stock"
  | "fd"
  | "gold"
  | "real_estate";

export interface Account {
  id: string;
  type: AccountType;
  name: string;
  institution: string;
  accountNumber: string;
  currentValue: number;
  nominee: string;
}

export interface MonthlyMoney {
  income: number;
  fixedExpenses: number;
  variableExpenses: number;
  investments: number;
  momSupport: number;
  rentUtilities: number;
  lifestyleCap: number;
  emergencyTopUp: number;
  sipCapacity: number;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
}

export interface InsurancePolicy {
  id: string;
  type: "term" | "health" | "vehicle";
  name: string;
  policyNumber: string;
  coverage: number;
  renewalDate: string;
  nominee: string;
}

export interface Document {
  id: string;
  name: string;
  category: "pan" | "aadhaar" | "insurance" | "investment" | "property" | "will" | "other";
  url: string;
  notes: string;
}

export interface EmergencyContact {
  id: string;
  role: string;
  name: string;
  contact: string;
}

export interface AssetInventory {
  emergencyCash: number;
  vaultLocation: string;
  providentFund: number;
  uanNumber: string;
}

export interface MoneyReceivable {
  id: string;
  borrowerName: string;
  amount: number;
  lentDate: string;
  expectedReturnDate: string;
  notes: string;
  repaid: boolean;
}

export interface FinalInstructions {
  salaryAccount: string;
  investmentLocations: string;
  insuranceClaimSteps: string;
  firstContact: string;
  additionalNotes: string;
}

export interface FinanceData {
  lastUpdated: string;
  assets: AssetInventory;
  monthly: MonthlyMoney;
  accounts: Account[];
  goals: Goal[];
  insurance: InsurancePolicy[];
  documents: Document[];
  contacts: EmergencyContact[];
  receivables: MoneyReceivable[];
  instructions: FinalInstructions;
  monthEndChecklist: Record<string, boolean>;
  sosMode: boolean;
}

export interface FinanceConfig {
  basePath: string;
  currency: string;
  locale: string;
  emergencyFundTarget: number;
}

export interface FinanceMetrics {
  netWorth: number;
  cashAvailable: number;
  investmentValue: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  monthlyRemaining: number;
  savingsRate: number;
  emergencyFundProgress: number;
  emergencyFundDeficit: number;
  emergencyFundMonthsToTarget: number;
  survivalRunwayMonths: number;
  salaryAllocation: {
    fixed: number;
    wants: number;
    saved: number;
  };
  nextInsuranceRenewal: { name: string; date: string } | null;
  nextSipDate: string | null;
  totalReceivables: number;
  nextReceivableReturn: { borrowerName: string; date: string; amount: number } | null;
}
