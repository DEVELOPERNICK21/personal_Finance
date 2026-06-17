"use client";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { useFinance } from "../context/FinanceProvider";
import type { Document } from "../types";

const CATEGORIES: { value: Document["category"]; label: string }[] = [
  { value: "pan", label: "PAN" },
  { value: "aadhaar", label: "Aadhaar" },
  { value: "insurance", label: "Insurance Policy" },
  { value: "investment", label: "Investment Statement" },
  { value: "property", label: "Property Papers" },
  { value: "will", label: "Will" },
  { value: "other", label: "Other" },
];

function newDocument(): Document {
  return {
    id: crypto.randomUUID(),
    name: "",
    category: "other",
    url: "",
    notes: "",
  };
}

export function DocumentsPage() {
  const { data, updateData } = useFinance();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() =>
            updateData((d) => ({
              ...d,
              documents: [...d.documents, newDocument()],
            }))
          }
        >
          Add Document
        </Button>
      </div>

      {data.documents.length === 0 ? (
        <Card title="Important Documents" icon="📄">
          <p className="text-sm text-zinc-500">
            No documents yet. Add links to PAN, Aadhaar, insurance policies,
            investment statements, property papers, or your will.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.documents.map((doc) => (
            <Card key={doc.id} title={doc.name || "New Document"} icon="📄">
              <div className="space-y-4">
                <Field
                  label="Document Name"
                  value={doc.name}
                  onChange={(v) =>
                    updateData((d) => ({
                      ...d,
                      documents: d.documents.map((x) =>
                        x.id === doc.id ? { ...x, name: v } : x
                      ),
                    }))
                  }
                />
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-medium tracking-wider text-zinc-500 uppercase">
                    Category
                  </label>
                  <select
                    value={doc.category}
                    onChange={(e) =>
                      updateData((d) => ({
                        ...d,
                        documents: d.documents.map((x) =>
                          x.id === doc.id
                            ? { ...x, category: e.target.value as Document["category"] }
                            : x
                        ),
                      }))
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Field
                  label="URL or File Link"
                  value={doc.url}
                  placeholder="https://..."
                  onChange={(v) =>
                    updateData((d) => ({
                      ...d,
                      documents: d.documents.map((x) =>
                        x.id === doc.id ? { ...x, url: v } : x
                      ),
                    }))
                  }
                />
                <Field
                  label="Notes"
                  value={doc.notes}
                  onChange={(v) =>
                    updateData((d) => ({
                      ...d,
                      documents: d.documents.map((x) =>
                        x.id === doc.id ? { ...x, notes: v } : x
                      ),
                    }))
                  }
                />
                {doc.url && (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:underline"
                  >
                    Open document →
                  </a>
                )}
                <Button
                  variant="secondary"
                  onClick={() =>
                    updateData((d) => ({
                      ...d,
                      documents: d.documents.filter((x) => x.id !== doc.id),
                    }))
                  }
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
