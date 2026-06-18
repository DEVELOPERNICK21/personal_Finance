"use client";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { useFinance } from "../context/FinanceProvider";
import { exportFinanceData } from "../lib/storage";
import type { EmergencyContact } from "../types";

function newContact(): EmergencyContact {
  return {
    id: crypto.randomUUID(),
    role: "Contact",
    name: "",
    contact: "",
  };
}

export function EmergencyPage() {
  const { data, updateData } = useFinance();
  const { instructions, contacts } = data;

  const handleExport = () => {
    const blob = new Blob([exportFinanceData(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `personal-finance-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Card title="Final Instructions" icon="📝">
        <div className="grid gap-4">
          <Field
            label="Which bank account receives salary"
            value={instructions.salaryAccount}
            onChange={(v) =>
              updateData((d) => ({
                ...d,
                instructions: { ...d.instructions, salaryAccount: v },
              }))
            }
          />
          <Field
            label="Where investments are held"
            value={instructions.investmentLocations}
            onChange={(v) =>
              updateData((d) => ({
                ...d,
                instructions: { ...d.instructions, investmentLocations: v },
              }))
            }
          />
          <Field
            label="How to claim insurance"
            value={instructions.insuranceClaimSteps}
            onChange={(v) =>
              updateData((d) => ({
                ...d,
                instructions: { ...d.instructions, insuranceClaimSteps: v },
              }))
            }
          />
          <Field
            label="Who to contact first"
            value={instructions.firstContact}
            onChange={(v) =>
              updateData((d) => ({
                ...d,
                instructions: { ...d.instructions, firstContact: v },
              }))
            }
          />
          <Field
            label="Additional notes"
            value={instructions.additionalNotes}
            onChange={(v) =>
              updateData((d) => ({
                ...d,
                instructions: { ...d.instructions, additionalNotes: v },
              }))
            }
          />
        </div>
      </Card>

      <Card title="Strategic Human Contacts" icon="👥">
        <div className="mb-4 flex justify-end">
          <Button
            onClick={() =>
              updateData((d) => ({
                ...d,
                contacts: [...d.contacts, newContact()],
              }))
            }
          >
            Add Contact
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {contacts.map((contact) => (
            <div key={contact.id} className="space-y-3 rounded-2xl border border-border bg-[var(--finance-subtle)]/40 p-4">
              <Field
                label="Role"
                value={contact.role}
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    contacts: d.contacts.map((c) =>
                      c.id === contact.id ? { ...c, role: v } : c
                    ),
                  }))
                }
              />
              <Field
                label="Name"
                value={contact.name}
                placeholder="Name"
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    contacts: d.contacts.map((c) =>
                      c.id === contact.id ? { ...c, name: v } : c
                    ),
                  }))
                }
              />
              <Field
                label="Contact"
                value={contact.contact}
                placeholder="Phone / Email"
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    contacts: d.contacts.map((c) =>
                      c.id === contact.id ? { ...c, contact: v } : c
                    ),
                  }))
                }
              />
              <Button
                variant="secondary"
                onClick={() =>
                  updateData((d) => ({
                    ...d,
                    contacts: d.contacts.filter((c) => c.id !== contact.id),
                  }))
                }
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Data Backup" icon="💾">
        <p className="mb-4 text-sm text-muted">
          Export your finance data as JSON so your family can access everything in
          one file.
        </p>
        <Button onClick={handleExport}>Export Finance Data</Button>
      </Card>
    </div>
  );
}
