/**
 * Dividend Yield and Income Calculator Engine
 */

export interface DividendParams {
  ticker: string;
  assetName: string;
  desiredMonthlyIncome: number; // R
  currentPrice: number; // P
  annualDividendPerShare: number; // D12
  referencePeriod: string; // e.g. "Últimos 12 meses"
  referenceDate: string; // e.g. "26/10/2026"
  isManualEntry: boolean;
}

export interface ScenarioPoint {
  label: string;
  investedCapital: number;
  monthlyIncome: number;
  annualIncome: number;
  sharesCount: number;
}

export interface DividendResult {
  dividendYieldAnnual: number; // e.g. 0.06 for 6%
  dividendYieldPercent: number; // 6.00
  desiredAnnualIncome: number; // R * 12
  theoreticalSharesNeeded: number; // (R * 12) / D12
  integerSharesNeeded: number; // Math.ceil(theoreticalSharesNeeded)
  theoreticalRequiredCapital: number; // theoreticalSharesNeeded * P
  integerRequiredCapital: number; // integerSharesNeeded * P
  effectiveMonthlyIncome: number; // (integerSharesNeeded * D12) / 12
  effectiveAnnualIncome: number; // integerSharesNeeded * D12
  scenarios: ScenarioPoint[];
  chartData: Array<{
    capital: number;
    formattedCapital: string;
    monthlyIncome: number;
    shares: number;
  }>;
  isValid: boolean;
  errorMessage?: string;
}

export function calculateDividendRequirements(params: DividendParams): DividendResult {
  const P = Math.max(0, Number(params.currentPrice) || 0);
  const D12 = Math.max(0, Number(params.annualDividendPerShare) || 0);
  const R = Math.max(0, Number(params.desiredMonthlyIncome) || 0);

  // Validation
  if (P <= 0 && D12 <= 0) {
    return createEmptyResult('Informe o preço atual e o dividendo anual por ação/cota.');
  }
  if (P <= 0) {
    return createEmptyResult('Informe um preço atual por ação/cota maior que zero.');
  }
  if (D12 <= 0) {
    return createEmptyResult('O dividendo por ação/cota nos últimos 12 meses deve ser maior que zero para calcular a renda.');
  }
  if (R <= 0) {
    return createEmptyResult('Informe uma renda mensal desejada maior que zero.');
  }

  // Dividend Yield anual = D12 / P
  const dividendYieldAnnual = D12 / P;
  const dividendYieldPercent = dividendYieldAnnual * 100;

  // Renda anual desejada = R * 12
  const desiredAnnualIncome = R * 12;

  // Quantidade estimada = (R * 12) / D12
  const theoreticalSharesNeeded = desiredAnnualIncome / D12;
  const integerSharesNeeded = Math.ceil(theoreticalSharesNeeded);

  // Patrimônio estimado = quantidade * P
  const theoreticalRequiredCapital = theoreticalSharesNeeded * P;
  const integerRequiredCapital = integerSharesNeeded * P;

  // Renda real obtida com a quantidade inteira de ações
  const effectiveAnnualIncome = integerSharesNeeded * D12;
  const effectiveMonthlyIncome = effectiveAnnualIncome / 12;

  // Build scenarios for table & chart (e.g. 10%, 25%, 50%, 75%, 100%, 150%, 200% of target capital)
  const percentages = [0.1, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0];
  const scenarios: ScenarioPoint[] = percentages.map((pct) => {
    const capital = Math.round((integerRequiredCapital * pct) / 100) * 100;
    const shares = Math.floor(capital / P);
    const annualInc = shares * D12;
    const monthlyInc = annualInc / 12;
    const label = pct === 1.0 ? 'Meta desejada (100%)' : `${Math.round(pct * 100)}% da meta`;

    return {
      label,
      investedCapital: capital,
      monthlyIncome: monthlyInc,
      annualIncome: annualInc,
      sharesCount: shares,
    };
  });

  // Chart data: smooth points along capital range
  const chartPointsCount = 8;
  const maxCapital = integerRequiredCapital * 1.5;
  const stepCapital = maxCapital / (chartPointsCount - 1);
  const chartData = [];

  for (let i = 0; i < chartPointsCount; i++) {
    const cap = Math.round(i * stepCapital);
    const shares = Math.floor(cap / P);
    const monthlyInc = (shares * D12) / 12;
    chartData.push({
      capital: cap,
      formattedCapital: formatCompactK(cap),
      monthlyIncome: Math.round(monthlyInc * 100) / 100,
      shares,
    });
  }

  // Always include exact target in chart data if not already present
  chartData.push({
    capital: integerRequiredCapital,
    formattedCapital: formatCompactK(integerRequiredCapital),
    monthlyIncome: Math.round(effectiveMonthlyIncome * 100) / 100,
    shares: integerSharesNeeded,
  });
  chartData.sort((a, b) => a.capital - b.capital);

  return {
    dividendYieldAnnual,
    dividendYieldPercent,
    desiredAnnualIncome,
    theoreticalSharesNeeded,
    integerSharesNeeded,
    theoreticalRequiredCapital,
    integerRequiredCapital,
    effectiveMonthlyIncome,
    effectiveAnnualIncome,
    scenarios,
    chartData,
    isValid: true,
  };
}

function createEmptyResult(message?: string): DividendResult {
  return {
    dividendYieldAnnual: 0,
    dividendYieldPercent: 0,
    desiredAnnualIncome: 0,
    theoreticalSharesNeeded: 0,
    integerSharesNeeded: 0,
    theoreticalRequiredCapital: 0,
    integerRequiredCapital: 0,
    effectiveMonthlyIncome: 0,
    effectiveAnnualIncome: 0,
    scenarios: [],
    chartData: [],
    isValid: false,
    errorMessage: message,
  };
}

function formatCompactK(value: number): string {
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}M`;
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}k`;
  }
  return `R$ ${value}`;
}
