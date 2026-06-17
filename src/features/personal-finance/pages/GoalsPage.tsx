"use client";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { SimpleProgress } from "../components/ui/ProgressBar";
import { useFinance } from "../context/FinanceProvider";
import { formatCurrency, formatPercent } from "../lib/format";
import type { Goal } from "../types";

function newGoal(): Goal {
  return {
    id: crypto.randomUUID(),
    name: "",
    target: 0,
    current: 0,
  };
}

export function GoalsPage() {
  const { data, updateData } = useFinance();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() =>
            updateData((d) => ({ ...d, goals: [...d.goals, newGoal()] }))
          }
        >
          Add Goal
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {data.goals.map((goal) => {
          const progress =
            goal.target > 0 ? Math.min(100, (goal.current / goal.target) * 100) : 0;
          return (
            <Card key={goal.id} title={goal.name || "New Goal"} icon="🎯">
              <div className="space-y-4">
                <Field
                  label="Goal Name"
                  value={goal.name}
                  onChange={(v) =>
                    updateData((d) => ({
                      ...d,
                      goals: d.goals.map((g) =>
                        g.id === goal.id ? { ...g, name: v } : g
                      ),
                    }))
                  }
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Target (₹)"
                    value={goal.target}
                    type="number"
                    onChange={(v) =>
                      updateData((d) => ({
                        ...d,
                        goals: d.goals.map((g) =>
                          g.id === goal.id ? { ...g, target: Number(v) || 0 } : g
                        ),
                      }))
                    }
                  />
                  <Field
                    label="Current Amount (₹)"
                    value={goal.current}
                    type="number"
                    onChange={(v) =>
                      updateData((d) => ({
                        ...d,
                        goals: d.goals.map((g) =>
                          g.id === goal.id ? { ...g, current: Number(v) || 0 } : g
                        ),
                      }))
                    }
                  />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-zinc-400">Progress</span>
                    <span className="text-emerald-400">{formatPercent(progress)}</span>
                  </div>
                  <SimpleProgress percent={progress} />
                  <p className="mt-1 text-xs text-zinc-500">
                    {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() =>
                    updateData((d) => ({
                      ...d,
                      goals: d.goals.filter((g) => g.id !== goal.id),
                    }))
                  }
                >
                  Remove
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
