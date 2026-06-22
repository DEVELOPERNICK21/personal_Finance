"use client";

import { useFinance } from "../presentation/providers/FinanceProvider";
import { financeHref } from "../routes";
import { FinancialRoadmap } from "../components/vault/FinancialRoadmap";

export function RoadmapPage() {
  const { data, config } = useFinance();
  const base = config.basePath;

  return (
    <FinancialRoadmap
      data={data}
      basePath={base}
      backHref={financeHref(base, "")}
      showInsight
    />
  );
}
