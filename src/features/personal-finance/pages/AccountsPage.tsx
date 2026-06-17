"use client";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { useFinance } from "../context/FinanceProvider";
import { formatCurrency } from "../lib/format";
import type { Account, AccountType } from "../types";

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: "bank", label: "Bank Account" },
  { value: "epf", label: "EPF" },
  { value: "ppf", label: "PPF" },
  { value: "nps", label: "NPS" },
  { value: "fd", label: "Fixed Deposit" },
  { value: "gold", label: "Gold" },
  { value: "real_estate", label: "Real Estate" },
];

function newAccount(): Account {
  return {
    id: crypto.randomUUID(),
    type: "bank",
    name: "",
    institution: "",
    accountNumber: "",
    currentValue: 0,
    nominee: "",
  };
}

export function AccountsPage() {
  const { data, updateData } = useFinance();
  const accounts = data.accounts.filter((a) =>
    ["bank", "epf", "ppf", "nps", "fd", "gold", "real_estate"].includes(a.type)
  );

  const total = accounts.reduce((sum, a) => sum + a.currentValue, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          Total Accounts Value:{" "}
          <span className="text-foreground font-medium">{formatCurrency(total)}</span>
        </p>
        <Button
          onClick={() =>
            updateData((d) => ({
              ...d,
              accounts: [...d.accounts, newAccount()],
            }))
          }
        >
          Add Account
        </Button>
      </div>

      <div className="grid gap-4">
        {accounts.map((account) => (
          <Card key={account.id} title={account.name || "New Account"} icon="💰">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-medium tracking-wider text-muted uppercase">
                  Type
                </label>
                <select
                  value={account.type}
                  onChange={(e) =>
                    updateData((d) => ({
                      ...d,
                      accounts: d.accounts.map((a) =>
                        a.id === account.id
                          ? { ...a, type: e.target.value as AccountType }
                          : a
                      ),
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-surface-input px-3 py-2.5 text-sm text-foreground"
                >
                  {ACCOUNT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label="Account Name"
                value={account.name}
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    accounts: d.accounts.map((a) =>
                      a.id === account.id ? { ...a, name: v } : a
                    ),
                  }))
                }
              />
              <Field
                label="Institution"
                value={account.institution}
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    accounts: d.accounts.map((a) =>
                      a.id === account.id ? { ...a, institution: v } : a
                    ),
                  }))
                }
              />
              <Field
                label="Account/Folio Number (masked)"
                value={account.accountNumber}
                placeholder="****1234"
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    accounts: d.accounts.map((a) =>
                      a.id === account.id ? { ...a, accountNumber: v } : a
                    ),
                  }))
                }
              />
              <Field
                label="Current Value (₹)"
                value={account.currentValue}
                type="number"
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    accounts: d.accounts.map((a) =>
                      a.id === account.id
                        ? { ...a, currentValue: Number(v) || 0 }
                        : a
                    ),
                  }))
                }
              />
              <Field
                label="Nominee"
                value={account.nominee}
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    accounts: d.accounts.map((a) =>
                      a.id === account.id ? { ...a, nominee: v } : a
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
                  accounts: d.accounts.filter((a) => a.id !== account.id),
                }))
              }
            >
              Remove
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
