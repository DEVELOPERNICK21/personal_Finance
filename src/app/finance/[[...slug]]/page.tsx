import { PersonalFinanceMount } from "@/features/personal-finance";

interface FinanceCatchAllProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function FinanceCatchAllPage({ params }: FinanceCatchAllProps) {
  const { slug } = await params;
  return <PersonalFinanceMount slug={slug} config={{ basePath: "/finance" }} />;
}
