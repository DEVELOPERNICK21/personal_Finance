"use client";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { useFinance } from "../context/FinanceProvider";
import { formatCurrency } from "../lib/format";
import type { InsurancePolicy } from "../types";

const TYPE_COLORS = {
  term: "text-accent-info",
  health: "text-accent-success",
  vehicle: "text-accent-warning",
};

function newPolicy(type: InsurancePolicy["type"]): InsurancePolicy {
  return {
    id: crypto.randomUUID(),
    type,
    name: "",
    policyNumber: "",
    coverage: 0,
    renewalDate: "",
    nominee: "",
  };
}

export function InsurancePage() {
  const { data, updateData } = useFinance();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-end">
        <Button onClick={() => updateData((d) => ({ ...d, insurance: [...d.insurance, newPolicy("term")] }))}>
          Add Term
        </Button>
        <Button onClick={() => updateData((d) => ({ ...d, insurance: [...d.insurance, newPolicy("health")] }))}>
          Add Health
        </Button>
        <Button onClick={() => updateData((d) => ({ ...d, insurance: [...d.insurance, newPolicy("vehicle")] }))}>
          Add Vehicle
        </Button>
      </div>

      <Card title="Protection & Insurance Matrix" icon="🛡️">
        <div className="space-y-6">
          {data.insurance.map((policy) => (
            <div key={policy.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
              <h3 className={`mb-4 text-sm font-medium ${TYPE_COLORS[policy.type]}`}>
                {policy.name || `${policy.type} insurance`}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Policy Name"
                  value={policy.name}
                  onChange={(v) =>
                    updateData((d) => ({
                      ...d,
                      insurance: d.insurance.map((p) =>
                        p.id === policy.id ? { ...p, name: v } : p
                      ),
                    }))
                  }
                />
                <Field
                  label="Policy Number"
                  value={policy.policyNumber}
                  placeholder="Policy ID"
                  onChange={(v) =>
                    updateData((d) => ({
                      ...d,
                      insurance: d.insurance.map((p) =>
                        p.id === policy.id ? { ...p, policyNumber: v } : p
                      ),
                    }))
                  }
                />
                <Field
                  label="Coverage (₹)"
                  value={policy.coverage}
                  type="number"
                  onChange={(v) =>
                    updateData((d) => ({
                      ...d,
                      insurance: d.insurance.map((p) =>
                        p.id === policy.id ? { ...p, coverage: Number(v) || 0 } : p
                      ),
                    }))
                  }
                />
                <Field
                  label="Renewal Date"
                  value={policy.renewalDate}
                  type="date"
                  onChange={(v) =>
                    updateData((d) => ({
                      ...d,
                      insurance: d.insurance.map((p) =>
                        p.id === policy.id ? { ...p, renewalDate: v } : p
                      ),
                    }))
                  }
                />
                <Field
                  label="Nominee"
                  value={policy.nominee}
                  placeholder="Name & relationship"
                  onChange={(v) =>
                    updateData((d) => ({
                      ...d,
                      insurance: d.insurance.map((p) =>
                        p.id === policy.id ? { ...p, nominee: v } : p
                      ),
                    }))
                  }
                />
                <div className="flex items-end">
                  <p className="text-sm text-muted">
                    Coverage: {formatCurrency(policy.coverage)}
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() =>
                  updateData((d) => ({
                    ...d,
                    insurance: d.insurance.filter((p) => p.id !== policy.id),
                  }))
                }
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Strategic Human Contacts" icon="👥">
        <div className="grid gap-4 sm:grid-cols-2">
          {data.contacts.map((contact) => (
            <Field
              key={contact.id}
              label={contact.role}
              value={contact.name ? `${contact.name}${contact.contact ? ` — ${contact.contact}` : ""}` : ""}
              placeholder="Name & Contact"
              onChange={(v) =>
                updateData((d) => ({
                  ...d,
                  contacts: d.contacts.map((c) =>
                    c.id === contact.id ? { ...c, name: v } : c
                  ),
                }))
              }
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
