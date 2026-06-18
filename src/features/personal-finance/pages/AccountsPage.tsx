"use client";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field, financeInputClassName } from "../components/ui/Field";
import { useFinance } from "../context/FinanceProvider";
import { formatCurrency } from "../lib/format";
import type { Account, AccountType, MoneyReceivable } from "../types";

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

function newReceivable(): MoneyReceivable {
  return {
    id: crypto.randomUUID(),
    borrowerName: "",
    amount: 0,
    lentDate: new Date().toISOString().split("T")[0],
    expectedReturnDate: "",
    notes: "",
    repaid: false,
  };
}

export function AccountsPage() {
  const { data, metrics, updateData } = useFinance();
  const accounts = data.accounts.filter((a) =>
    ["bank", "epf", "ppf", "nps", "fd", "gold", "real_estate"].includes(a.type)
  );
  const receivables = data.receivables ?? [];
  const pendingReceivables = receivables.filter((r) => !r.repaid);

  const total = accounts.reduce((sum, a) => sum + a.currentValue, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <p>
            Accounts:{" "}
            <span className="font-medium text-foreground">{formatCurrency(total)}</span>
          </p>
          <p>
            Owed to you:{" "}
            <span className="font-medium text-foreground">
              {formatCurrency(metrics.totalReceivables)}
            </span>
          </p>
        </div>
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
                <label className="block text-sm font-medium text-muted">Type</label>
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
                  className={financeInputClassName}
                >
                  {ACCOUNT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label="Account name"
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
                label="Account / folio number"
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
                label="Current value (₹)"
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

      <Card title="Money lent to others" icon="🤝">
        <p className="mb-4 text-sm text-muted">
          Track who borrowed from you, how much, and when they plan to pay you back.
        </p>
        <div className="mb-4 flex justify-end">
          <Button
            onClick={() =>
              updateData((d) => ({
                ...d,
                receivables: [...(d.receivables ?? []), newReceivable()],
              }))
            }
          >
            Add loan
          </Button>
        </div>

        {pendingReceivables.length === 0 && receivables.length === 0 ? (
          <p className="rounded-2xl bg-[var(--finance-subtle)] px-4 py-6 text-center text-sm text-muted">
            No loans recorded yet. Add someone who owes you money.
          </p>
        ) : (
          <div className="grid gap-4">
            {receivables.map((loan) => (
              <div
                key={loan.id}
                className={`space-y-4 rounded-2xl border border-border p-4 ${
                  loan.repaid ? "opacity-60" : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {loan.borrowerName || "Unnamed borrower"}
                  </span>
                  <label className="flex items-center gap-2 text-xs text-muted">
                    <input
                      type="checkbox"
                      checked={loan.repaid}
                      onChange={(e) =>
                        updateData((d) => ({
                          ...d,
                          receivables: (d.receivables ?? []).map((r) =>
                            r.id === loan.id ? { ...r, repaid: e.target.checked } : r
                          ),
                        }))
                      }
                      className="rounded border-border"
                    />
                    Repaid
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field
                    label="Borrower name"
                    value={loan.borrowerName}
                    placeholder="Who borrowed?"
                    onChange={(v) =>
                      updateData((d) => ({
                        ...d,
                        receivables: (d.receivables ?? []).map((r) =>
                          r.id === loan.id ? { ...r, borrowerName: v } : r
                        ),
                      }))
                    }
                  />
                  <Field
                    label="Amount (₹)"
                    value={loan.amount}
                    type="number"
                    onChange={(v) =>
                      updateData((d) => ({
                        ...d,
                        receivables: (d.receivables ?? []).map((r) =>
                          r.id === loan.id ? { ...r, amount: Number(v) || 0 } : r
                        ),
                      }))
                    }
                  />
                  <Field
                    label="Date lent"
                    value={loan.lentDate}
                    type="date"
                    onChange={(v) =>
                      updateData((d) => ({
                        ...d,
                        receivables: (d.receivables ?? []).map((r) =>
                          r.id === loan.id ? { ...r, lentDate: v } : r
                        ),
                      }))
                    }
                  />
                  <Field
                    label="Expected return date"
                    value={loan.expectedReturnDate}
                    type="date"
                    onChange={(v) =>
                      updateData((d) => ({
                        ...d,
                        receivables: (d.receivables ?? []).map((r) =>
                          r.id === loan.id ? { ...r, expectedReturnDate: v } : r
                        ),
                      }))
                    }
                  />
                  <Field
                    label="Notes"
                    value={loan.notes}
                    placeholder="Optional context"
                    onChange={(v) =>
                      updateData((d) => ({
                        ...d,
                        receivables: (d.receivables ?? []).map((r) =>
                          r.id === loan.id ? { ...r, notes: v } : r
                        ),
                      }))
                    }
                  />
                </div>
                <Button
                  variant="secondary"
                  onClick={() =>
                    updateData((d) => ({
                      ...d,
                      receivables: (d.receivables ?? []).filter((r) => r.id !== loan.id),
                    }))
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
