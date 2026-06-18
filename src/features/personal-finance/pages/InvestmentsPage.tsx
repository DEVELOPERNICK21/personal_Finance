"use client";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { SimpleProgress } from "../components/ui/ProgressBar";
import { useFinance } from "../context/FinanceProvider";
import { formatCurrency } from "../lib/format";
import type { Account, AccountType } from "../types";

const INVESTMENT_TYPES: { value: AccountType; label: string }[] = [
  { value: "mutual_fund", label: "Mutual Fund" },
  { value: "stock", label: "Stocks" },
  { value: "nps", label: "NPS" },
  { value: "ppf", label: "PPF" },
  { value: "gold", label: "Gold" },
];

function newInvestment(): Account {
  return {
    id: crypto.randomUUID(),
    type: "mutual_fund",
    name: "",
    institution: "",
    accountNumber: "",
    currentValue: 0,
    nominee: "",
  };
}

export function InvestmentsPage() {
  const { data, metrics, updateData } = useFinance();
  const investments = data.accounts.filter((a) =>
    ["mutual_fund", "stock", "nps", "ppf", "gold"].includes(a.type)
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-surface/50 px-4 py-3">
        <p className="text-sm text-muted">
          Total Investment Value:{" "}
          <span className="text-accent-success font-medium">
            {formatCurrency(metrics.investmentValue)}
          </span>
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() =>
            updateData((d) => ({
              ...d,
              accounts: [...d.accounts, newInvestment()],
            }))
          }
        >
          Add Investment
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {investments.map((inv) => (
          <Card key={inv.id} title={inv.name || "New Investment"} icon="📈">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-medium tracking-wider text-muted uppercase">
                  Type
                </label>
                <select
                  value={inv.type}
                  onChange={(e) =>
                    updateData((d) => ({
                      ...d,
                      accounts: d.accounts.map((a) =>
                        a.id === inv.id
                          ? { ...a, type: e.target.value as AccountType }
                          : a
                      ),
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-surface-input px-3 py-2.5 text-sm text-foreground"
                >
                  {INVESTMENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label="Name"
                value={inv.name}
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    accounts: d.accounts.map((a) =>
                      a.id === inv.id ? { ...a, name: v } : a
                    ),
                  }))
                }
              />
              <Field
                label="Institution / Platform"
                value={inv.institution}
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    accounts: d.accounts.map((a) =>
                      a.id === inv.id ? { ...a, institution: v } : a
                    ),
                  }))
                }
              />
              <Field
                label="Folio Number (masked)"
                value={inv.accountNumber}
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    accounts: d.accounts.map((a) =>
                      a.id === inv.id ? { ...a, accountNumber: v } : a
                    ),
                  }))
                }
              />
              <Field
                label="Current Value (₹)"
                value={inv.currentValue ?? 0}
                type="number"
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    accounts: d.accounts.map((a) =>
                      a.id === inv.id
                        ? { ...a, currentValue: v === "" ? 0 : Number(v) || 0 }
                        : a
                    ),
                  }))
                }
              />
              <Field
                label="Nominee"
                value={inv.nominee}
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    accounts: d.accounts.map((a) =>
                      a.id === inv.id ? { ...a, nominee: v } : a
                    ),
                  }))
                }
              />
            </div>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() =>
                updateData((d) => ({
                  ...d,
                  accounts: d.accounts.filter((a) => a.id !== inv.id),
                }))
              }
            >
              Remove
            </Button>
          </Card>
        ))}
      </div>

      {investments.length > 0 && (
        <Card title="Portfolio Mix" icon="📊">
          <div className="space-y-3">
            {investments.map((inv) => {
              const share =
                metrics.investmentValue > 0
                  ? (inv.currentValue / metrics.investmentValue) * 100
                  : 0;
              return (
                <div key={inv.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-foreground">{inv.name || inv.type}</span>
                    <span className="text-muted">{Math.round(share)}%</span>
                  </div>
                  <SimpleProgress percent={share} color="bg-accent-info" />
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
