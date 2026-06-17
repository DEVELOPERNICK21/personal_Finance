"use client";

import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { MetricCard } from "../components/ui/MetricCard";
import { useFinance } from "../context/FinanceProvider";
import { formatCurrency, formatPercent } from "../lib/format";

export function MonthlyMoneyPage() {
  const { data, metrics, updateData } = useFinance();
  const { monthly } = data;

  const updateMonthly = (key: keyof typeof monthly, value: string) => {
    updateData((d) => ({
      ...d,
      monthly: { ...d.monthly, [key]: Number(value) || 0 },
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Income" value={formatCurrency(metrics.monthlyIncome)} />
        <MetricCard
          label="Expenses"
          value={formatCurrency(metrics.monthlyExpenses)}
          variant="warning"
        />
        <MetricCard
          label="Investments"
          value={formatCurrency(metrics.monthlySavings)}
          variant="success"
        />
        <MetricCard
          label="Remaining Cash"
          value={formatCurrency(metrics.monthlyRemaining)}
          variant={metrics.monthlyRemaining >= 0 ? "success" : "warning"}
        />
      </div>

      <Card title="Income" icon="💵">
        <Field
          label="Monthly Income (₹)"
          value={monthly.income}
          type="number"
          onChange={(v) => updateMonthly("income", v)}
        />
      </Card>

      <Card title="Fixed Expenses" icon="🔒">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Mom Support (₹)"
            value={monthly.momSupport}
            type="number"
            onChange={(v) => updateMonthly("momSupport", v)}
          />
          <Field
            label="Rent & Utilities (₹)"
            value={monthly.rentUtilities}
            type="number"
            onChange={(v) => updateMonthly("rentUtilities", v)}
          />
          <Field
            label="Other Fixed (₹)"
            value={monthly.fixedExpenses}
            type="number"
            onChange={(v) => updateMonthly("fixedExpenses", v)}
          />
        </div>
      </Card>

      <Card title="Variable Expenses" icon="🛍️">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Lifestyle Cap (₹)"
            value={monthly.lifestyleCap}
            type="number"
            onChange={(v) => updateMonthly("lifestyleCap", v)}
          />
          <Field
            label="Other Variable (₹)"
            value={monthly.variableExpenses}
            type="number"
            onChange={(v) => updateMonthly("variableExpenses", v)}
          />
        </div>
      </Card>

      <Card title="SIPs & Investments" icon="📈">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Monthly SIP (₹)"
            value={monthly.sipCapacity}
            type="number"
            onChange={(v) => updateMonthly("sipCapacity", v)}
          />
          <Field
            label="Emergency Top-Up (₹)"
            value={monthly.emergencyTopUp}
            type="number"
            onChange={(v) => updateMonthly("emergencyTopUp", v)}
          />
          <Field
            label="Other Investments (₹)"
            value={monthly.investments}
            type="number"
            onChange={(v) => updateMonthly("investments", v)}
          />
        </div>
      </Card>

      <Card title="Monthly Formula" icon="🧮">
        <div className="rounded-lg border border-border bg-surface-input p-4 font-mono text-sm text-foreground">
          <p>Income − Expenses − Investments = Remaining</p>
          <p className="mt-2 text-foreground">
            {formatCurrency(monthly.income)} − {formatCurrency(metrics.monthlyExpenses)} −{" "}
            {formatCurrency(metrics.monthlySavings)} ={" "}
            <span
              className={
                metrics.monthlyRemaining >= 0 ? "text-accent-success" : "text-accent-warning"
              }
            >
              {formatCurrency(metrics.monthlyRemaining)}
            </span>
          </p>
          <p className="mt-2 text-muted">
            Savings rate: {formatPercent(metrics.savingsRate)}
          </p>
        </div>
      </Card>
    </div>
  );
}
