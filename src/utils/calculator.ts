/**
 * Compound Interest Calculator Logic and Formatting Utilities
 */

export interface SimulationParams {
  initialAmount: number;
  monthlyContribution: number;
  interestRate: number; // e.g. 1 for 1%
  rateType: 'month' | 'year';
  period: number;
  periodType: 'years' | 'months';
}

export interface MonthlyRecord {
  month: number;
  yearNumber: number;
  monthInYear: number;
  invested: number;
  interest: number;
  total: number;
  monthlyInterestEarned: number;
  monthlyDeposit: number;
}

export interface TableRow {
  label: string; // "Ano 1", "Ano 2" or "Mês 1", "Mês 2"
  periodIndex: number;
  invested: number;
  interest: number;
  total: number;
  yearlyInterestEarned: number;
}

export interface ChartPoint {
  label: string;
  shortLabel: string;
  month: number;
  invested: number;
  total: number;
  interest: number;
}

export interface CalculationResult {
  finalAmount: number;
  totalInvested: number;
  totalInterest: number;
  totalMonths: number;
  effectiveMonthlyRatePercent: number;
  effectiveAnnualRatePercent: number;
  chartData: ChartPoint[];
  tableData: TableRow[];
}

export function calculateCompoundInterest(params: SimulationParams): CalculationResult {
  const initial = Math.max(0, Number(params.initialAmount) || 0);
  const monthly = Math.max(0, Number(params.monthlyContribution) || 0);
  const rateInput = Math.max(0, Number(params.interestRate) || 0);
  const rawPeriod = Math.max(0, Number(params.period) || 0);

  // Total months
  const totalMonths = params.periodType === 'years' 
    ? Math.round(rawPeriod * 12) 
    : Math.round(rawPeriod);

  // Monthly effective interest rate
  let monthlyRate = 0;
  if (rateInput > 0) {
    if (params.rateType === 'month') {
      monthlyRate = rateInput / 100;
    } else {
      // Annual to monthly: (1 + i_a)^(1/12) - 1
      monthlyRate = Math.pow(1 + rateInput / 100, 1 / 12) - 1;
    }
  }

  // Annual effective rate for display
  const annualRate = Math.pow(1 + monthlyRate, 12) - 1;

  if (totalMonths <= 0) {
    return {
      finalAmount: initial,
      totalInvested: initial,
      totalInterest: 0,
      totalMonths: 0,
      effectiveMonthlyRatePercent: monthlyRate * 100,
      effectiveAnnualRatePercent: annualRate * 100,
      chartData: [
        {
          label: 'Início',
          shortLabel: '0',
          month: 0,
          invested: initial,
          total: initial,
          interest: 0,
        },
      ],
      tableData: [],
    };
  }

  const monthlyRecords: MonthlyRecord[] = [];
  let currentBalance = initial;
  let runningInvested = initial;

  for (let m = 1; m <= totalMonths; m++) {
    // Interest earned in this month on accumulated balance
    const interestEarned = currentBalance * monthlyRate;
    // Balance grows with interest + monthly contribution at end of month
    currentBalance = currentBalance + interestEarned + monthly;
    runningInvested += monthly;

    const interestAccumulated = Math.max(0, currentBalance - runningInvested);

    monthlyRecords.push({
      month: m,
      yearNumber: Math.ceil(m / 12),
      monthInYear: ((m - 1) % 12) + 1,
      invested: runningInvested,
      interest: interestAccumulated,
      total: currentBalance,
      monthlyInterestEarned: interestEarned,
      monthlyDeposit: monthly,
    });
  }

  const lastRecord = monthlyRecords[monthlyRecords.length - 1];
  const finalAmount = lastRecord ? lastRecord.total : initial;
  const totalInvested = lastRecord ? lastRecord.invested : initial;
  const totalInterest = Math.max(0, finalAmount - totalInvested);

  // Prepare Chart Data
  // Include point 0 (Início)
  const chartData: ChartPoint[] = [
    {
      label: 'Início',
      shortLabel: '0',
      month: 0,
      invested: initial,
      total: initial,
      interest: 0,
    },
  ];

  if (totalMonths <= 24) {
    // For <= 24 months, show month by month or every 2 months
    monthlyRecords.forEach((rec) => {
      chartData.push({
        label: `Mês ${rec.month}`,
        shortLabel: `M${rec.month}`,
        month: rec.month,
        invested: Math.round(rec.invested * 100) / 100,
        total: Math.round(rec.total * 100) / 100,
        interest: Math.round(rec.interest * 100) / 100,
      });
    });
  } else {
    // For longer periods, add yearly points + final month if not at year boundary
    monthlyRecords.forEach((rec) => {
      const isYearEnd = rec.month % 12 === 0;
      const isFinal = rec.month === totalMonths;
      if (isYearEnd || isFinal) {
        const year = (rec.month / 12).toFixed(rec.month % 12 === 0 ? 0 : 1);
        chartData.push({
          label: rec.month % 12 === 0 ? `Ano ${rec.month / 12}` : `Mês ${rec.month} (${year} anos)`,
          shortLabel: rec.month % 12 === 0 ? `${rec.month / 12}a` : `M${rec.month}`,
          month: rec.month,
          invested: Math.round(rec.invested * 100) / 100,
          total: Math.round(rec.total * 100) / 100,
          interest: Math.round(rec.interest * 100) / 100,
        });
      }
    });
  }

  // Prepare Table Data
  // Requirement: "Mostre uma linha por ano. Para prazos menores que um ano, mostre os períodos mensais relevantes."
  const tableData: TableRow[] = [];

  if (totalMonths < 12) {
    // Show monthly
    monthlyRecords.forEach((rec) => {
      tableData.push({
        label: `Mês ${rec.month}`,
        periodIndex: rec.month,
        invested: rec.invested,
        interest: rec.interest,
        total: rec.total,
        yearlyInterestEarned: rec.monthlyInterestEarned,
      });
    });
  } else {
    // Show one row per year
    let previousYearBalance = initial;
    monthlyRecords.forEach((rec) => {
      const isYearEnd = rec.month % 12 === 0;
      const isFinalMonth = rec.month === totalMonths;

      if (isYearEnd) {
        const yearNum = rec.month / 12;
        tableData.push({
          label: `Ano ${yearNum}`,
          periodIndex: yearNum,
          invested: rec.invested,
          interest: rec.interest,
          total: rec.total,
          yearlyInterestEarned: rec.total - previousYearBalance - (12 * monthly),
        });
        previousYearBalance = rec.total;
      } else if (isFinalMonth) {
        // Partial last year (e.g. 18 months = 1.5 years)
        const remainingMonths = rec.month % 12;
        tableData.push({
          label: `Ano ${Math.floor(rec.month / 12)} + ${remainingMonths}m`,
          periodIndex: rec.month / 12,
          invested: rec.invested,
          interest: rec.interest,
          total: rec.total,
          yearlyInterestEarned: rec.total - previousYearBalance - (remainingMonths * monthly),
        });
      }
    });
  }

  return {
    finalAmount,
    totalInvested,
    totalInterest,
    totalMonths,
    effectiveMonthlyRatePercent: monthlyRate * 100,
    effectiveAnnualRatePercent: annualRate * 100,
    chartData,
    tableData,
  };
}

/**
 * Currency formatter for Brazilian Real (BRL)
 */
export function formatCurrencyBRL(value: number): string {
  if (isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Compact currency formatter for charts (e.g. R$ 50 mil, R$ 1,2 mi)
 */
export function formatCompactBRL(value: number): string {
  if (isNaN(value)) return 'R$ 0';
  if (value >= 1_000_000) {
    const formatted = (value / 1_000_000).toLocaleString('pt-BR', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    });
    return `R$ ${formatted} mi`;
  }
  if (value >= 1_000) {
    const formatted = (value / 1_000).toLocaleString('pt-BR', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    });
    return `R$ ${formatted} mil`;
  }
  return formatCurrencyBRL(value);
}

/**
 * Format decimal to Brazilian standard (e.g., 1.5 -> "1,5")
 */
export function formatNumberBR(value: number, decimals = 2): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}
