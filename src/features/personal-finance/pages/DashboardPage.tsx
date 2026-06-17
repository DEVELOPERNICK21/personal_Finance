"use client";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { MetricCard } from "../components/ui/MetricCard";
import { AllocationBar, SimpleProgress } from "../components/ui/ProgressBar";
import { useFinance } from "../context/FinanceProvider";
import {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
  formatPercent,
  formatShortDate,
} from "../lib/format";

export function DashboardPage() {
  const { data, metrics, updateData, commitReview, toggleSosMode } = useFinance();
  const { assets, monthly, insurance, monthEndChecklist } = data;

  if (data.sosMode) {
    return (
      <div className="space-y-6">
        <Card title="SOS Emergency View" icon="🚨">
          <div className="space-y-4">
            <p className="text-sm text-zinc-400">
              Critical information for your family in an emergency.
            </p>
            <Field label="Salary Account" value={data.instructions.salaryAccount} readOnly />
            <Field
              label="Investment Locations"
              value={data.instructions.investmentLocations}
              readOnly
            />
            <Field
              label="How to Claim Insurance"
              value={data.instructions.insuranceClaimSteps}
              readOnly
            />
            <Field
              label="Contact First"
              value={data.instructions.firstContact}
              readOnly
            />
            <Field
              label="Emergency Cash"
              value={formatCurrency(assets.emergencyCash)}
              readOnly
            />
            <Field label="Vault Location" value={assets.vaultLocation} readOnly />
            <Button variant="secondary" onClick={toggleSosMode}>
              Exit SOS View
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const termPolicy = insurance.find((p) => p.type === "term");
  const healthPolicy = insurance.find((p) => p.type === "health");

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-400">
        Last Updated:{" "}
        <span className="text-zinc-200">{formatDate(data.lastUpdated)}</span>
        <span className="mx-3">·</span>
        Net Worth:{" "}
        <span className="text-white">{formatCompactCurrency(metrics.netWorth)}</span>
        <span className="mx-3">·</span>
        Emergency Fund:{" "}
        <span className="text-emerald-400">
          {formatPercent(metrics.emergencyFundProgress)}
        </span>
        <span className="mx-3">·</span>
        Savings Rate:{" "}
        <span className="text-emerald-400">{formatPercent(metrics.savingsRate)}</span>
        {metrics.nextInsuranceRenewal && (
          <>
            <span className="mx-3">·</span>
            Next Renewal:{" "}
            <span className="text-orange-400">
              {formatShortDate(metrics.nextInsuranceRenewal.date)}
            </span>
          </>
        )}
        {metrics.nextSipDate && (
          <>
            <span className="mx-3">·</span>
            Next SIP:{" "}
            <span className="text-blue-400">{formatShortDate(metrics.nextSipDate)}</span>
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <Card title="Asset Inventory" icon="💰">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Emergency Cash Balance (₹)"
                value={assets.emergencyCash}
                type="number"
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    assets: { ...d.assets, emergencyCash: Number(v) || 0 },
                  }))
                }
              />
              <Field
                label="Vault/Bank Location"
                value={assets.vaultLocation}
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    assets: { ...d.assets, vaultLocation: v },
                  }))
                }
              />
              <Field
                label="Provident Fund Balance (₹)"
                value={assets.providentFund}
                type="number"
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    assets: { ...d.assets, providentFund: Number(v) || 0 },
                  }))
                }
              />
              <Field
                label="UAN Number Reference"
                value={assets.uanNumber}
                placeholder="Add UAN"
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    assets: { ...d.assets, uanNumber: v },
                  }))
                }
              />
            </div>
          </Card>

          <Card title="Monthly Cash Pipeline" icon="📊">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="In-Hand Net Salary (₹)"
                value={monthly.income}
                type="number"
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    monthly: { ...d.monthly, income: Number(v) || 0 },
                  }))
                }
              />
              <Field
                label="Fixed Outflow: Mom (₹)"
                value={monthly.momSupport}
                type="number"
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    monthly: { ...d.monthly, momSupport: Number(v) || 0 },
                  }))
                }
              />
              <Field
                label="Core Rent & Utilities (₹)"
                value={monthly.rentUtilities}
                type="number"
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    monthly: { ...d.monthly, rentUtilities: Number(v) || 0 },
                  }))
                }
              />
              <Field
                label="Lifestyle Spending Cap (₹)"
                value={monthly.lifestyleCap}
                type="number"
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    monthly: { ...d.monthly, lifestyleCap: Number(v) || 0 },
                  }))
                }
              />
              <Field
                label="Emergency Fund Top-Up (₹)"
                value={monthly.emergencyTopUp}
                type="number"
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    monthly: { ...d.monthly, emergencyTopUp: Number(v) || 0 },
                  }))
                }
              />
              <Field
                label="Monthly SIP Capacity (₹)"
                value={monthly.sipCapacity}
                type="number"
                onChange={(v) =>
                  updateData((d) => ({
                    ...d,
                    monthly: { ...d.monthly, sipCapacity: Number(v) || 0 },
                  }))
                }
              />
            </div>
          </Card>

          <Card title="Protection & Insurance Matrix" icon="🛡️">
            <div className="space-y-4">
              {termPolicy && (
                <div>
                  <h3 className="mb-3 text-sm font-medium text-blue-400">
                    {termPolicy.name}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Policy Serial ID" value={termPolicy.policyNumber} readOnly />
                    <Field label="Assigned Policy Nominee" value={termPolicy.nominee} readOnly />
                  </div>
                </div>
              )}
              {healthPolicy && (
                <div>
                  <h3 className="mb-3 text-sm font-medium text-emerald-400">
                    {healthPolicy.name}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Health Policy ID"
                      value={healthPolicy.policyNumber}
                      placeholder="Policy ID"
                      onChange={(v) =>
                        updateData((d) => ({
                          ...d,
                          insurance: d.insurance.map((p) =>
                            p.id === healthPolicy.id ? { ...p, policyNumber: v } : p
                          ),
                        }))
                      }
                    />
                    <Field
                      label="Renewal Deadline"
                      value={healthPolicy.renewalDate}
                      type="date"
                      onChange={(v) =>
                        updateData((d) => ({
                          ...d,
                          insurance: d.insurance.map((p) =>
                            p.id === healthPolicy.id ? { ...p, renewalDate: v } : p
                          ),
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Live Intelligence System" icon="⚡">
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <MetricCard
                  label="Survival Runway"
                  value={`${metrics.survivalRunwayMonths.toFixed(1)} Mo.`}
                  variant="warning"
                />
                <MetricCard
                  label="Monthly Unallocated"
                  value={formatCurrency(metrics.monthlyRemaining)}
                  variant={metrics.monthlyRemaining >= 0 ? "success" : "warning"}
                />
              </div>

              <div>
                <p className="mb-2 text-[10px] tracking-wider text-zinc-500 uppercase">
                  Salary Allocation Mix
                </p>
                <AllocationBar
                  segments={[
                    {
                      label: "Fixed",
                      percent: metrics.salaryAllocation.fixed,
                      color: "bg-red-500",
                    },
                    {
                      label: "Wants",
                      percent: metrics.salaryAllocation.wants,
                      color: "bg-orange-500",
                    },
                    {
                      label: "Saved",
                      percent: metrics.salaryAllocation.saved,
                      color: "bg-emerald-500",
                    },
                  ]}
                />
              </div>

              <div>
                <p className="mb-2 text-[10px] tracking-wider text-zinc-500 uppercase">
                  Emergency Protection Pool
                </p>
                <SimpleProgress percent={metrics.emergencyFundProgress} />
                <p className="mt-2 text-xs text-zinc-400">
                  {metrics.emergencyFundDeficit > 0
                    ? `Deficit of ${formatCurrency(metrics.emergencyFundDeficit)}. At your present tracking pace, you are roughly ${metrics.emergencyFundMonthsToTarget} months away from total security.`
                    : "Emergency fund target reached. Great work!"}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <MetricCard
                  label="Net Worth"
                  value={formatCompactCurrency(metrics.netWorth)}
                />
                <MetricCard
                  label="Investment Value"
                  value={formatCompactCurrency(metrics.investmentValue)}
                />
              </div>
            </div>
          </Card>

          <Card title="Month-End Review Drill" icon="📅">
            <div className="space-y-4">
              <ul className="space-y-2 text-sm text-zinc-300">
                {[
                  { key: "verifyBankLogs", label: "Verify real-time bank asset logs" },
                  { key: "confirmSipClearance", label: "Confirm automated SIP clearance" },
                  { key: "verifyBurnUnder30k", label: "Verify monthly burn stayed under ₹30k" },
                  { key: "auditPolicyDates", label: "Audit protection policy dates" },
                ].map((item) => (
                  <li key={item.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={monthEndChecklist[item.key] ?? false}
                      onChange={(e) =>
                        updateData((d) => ({
                          ...d,
                          monthEndChecklist: {
                            ...d.monthEndChecklist,
                            [item.key]: e.target.checked,
                          },
                        }))
                      }
                      className="rounded border-zinc-600 bg-zinc-900"
                    />
                    {item.label}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Button onClick={commitReview}>Commit Review Layout</Button>
                <Button variant="secondary" onClick={toggleSosMode}>
                  Toggle SOS Emergency View
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
