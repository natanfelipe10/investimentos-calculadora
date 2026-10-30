/**
 * Emergency Fund Calculator Logic and Types
 */

export type WorkModel = 'clt' | 'public_servant' | 'autonomous' | 'entrepreneur';

export interface WorkModelOption {
  id: WorkModel;
  label: string;
  defaultMonths: number;
  description: string;
}

export const WORK_MODEL_OPTIONS: WorkModelOption[] = [
  {
    id: 'clt',
    label: 'CLT',
    defaultMonths: 6,
    description: 'Trabalhador com carteira assinada e seguro-desemprego',
  },
  {
    id: 'public_servant',
    label: 'Servidor público',
    defaultMonths: 3,
    description: 'Alta estabilidade funcional e previsibilidade de renda',
  },
  {
    id: 'autonomous',
    label: 'Autônomo ou profissional liberal',
    defaultMonths: 12,
    description: 'Renda variável sujeita a flutuações e sazonalidade',
  },
  {
    id: 'entrepreneur',
    label: 'MEI ou empreendedor',
    defaultMonths: 12,
    description: 'Maior exposição ao risco do negócio e receita oscilante',
  },
];

export interface EmergencyParams {
  workModel: WorkModel;
  monthlySalary: number;
  essentialMonthlyCost: number;
  monthlySavings: number;
  targetMonths: number;
  isMonthsCustomized: boolean;
}

export interface EmergencyResult {
  reserveTarget: number;
  monthlySavings: number;
  targetMonths: number;
  monthsToTarget: number | null; // null if undefined (savings <= 0 and reserve > 0)
  formattedDuration: string;
  isAlreadyAchieved: boolean;
  canAchieveInOneMonth: boolean;
  workModelDefaultMonths: number;
}

export function getDefaultMonthsForModel(model: WorkModel): number {
  const found = WORK_MODEL_OPTIONS.find((o) => o.id === model);
  return found ? found.defaultMonths : 6;
}

/**
 * Format duration into human readable string:
 * e.g. 18 -> "18 meses — 1 ano e 6 meses"
 * e.g. 12 -> "12 meses — 1 ano"
 * e.g. 6 -> "6 meses"
 */
export function formatMonthsDuration(totalMonths: number): string {
  if (totalMonths <= 0) return '0 meses';
  if (totalMonths === 1) return '1 mês';
  if (totalMonths < 12) return `${totalMonths} meses`;

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  const yearStr = years === 1 ? '1 ano' : `${years} anos`;
  if (remainingMonths === 0) {
    return `${totalMonths} meses — ${yearStr}`;
  }

  const monthStr = remainingMonths === 1 ? '1 mês' : `${remainingMonths} meses`;
  return `${totalMonths} meses — ${yearStr} e ${monthStr}`;
}

export function calculateEmergencyReserve(params: EmergencyParams): EmergencyResult {
  const essentialCost = Math.max(0, Number(params.essentialMonthlyCost) || 0);
  const savings = Math.max(0, Number(params.monthlySavings) || 0);
  const targetMonths = Math.max(1, Math.min(60, Number(params.targetMonths) || 6));
  const workModelDefaultMonths = getDefaultMonthsForModel(params.workModel);

  // Valor da reserva = custo essencial mensal * quantidade de meses escolhida
  const reserveTarget = essentialCost * targetMonths;

  // Case 1: Reserva é zero (custo essencial é 0)
  if (reserveTarget === 0) {
    return {
      reserveTarget: 0,
      monthlySavings: savings,
      targetMonths,
      monthsToTarget: 0,
      formattedDuration: 'Meta atendida (0 meses)',
      isAlreadyAchieved: true,
      canAchieveInOneMonth: false,
      workModelDefaultMonths,
    };
  }

  // Case 2: Poupança mensal é zero ou menor
  if (savings <= 0) {
    return {
      reserveTarget,
      monthlySavings: 0,
      targetMonths,
      monthsToTarget: null,
      formattedDuration: 'Indefinido (sem aportes mensais)',
      isAlreadyAchieved: false,
      canAchieveInOneMonth: false,
      workModelDefaultMonths,
    };
  }

  // Case 3: Poupança mensal é maior ou igual à reserva total
  if (savings >= reserveTarget) {
    return {
      reserveTarget,
      monthlySavings: savings,
      targetMonths,
      monthsToTarget: 1,
      formattedDuration: '1 mês (em até 1 mês)',
      isAlreadyAchieved: false,
      canAchieveInOneMonth: true,
      workModelDefaultMonths,
    };
  }

  // Case 4: Cálculo padrão: arredondamento para cima de (valor da reserva / valor guardado)
  const monthsNeeded = Math.ceil(reserveTarget / savings);
  const formattedDuration = formatMonthsDuration(monthsNeeded);

  return {
    reserveTarget,
    monthlySavings: savings,
    targetMonths,
    monthsToTarget: monthsNeeded,
    formattedDuration,
    isAlreadyAchieved: false,
    canAchieveInOneMonth: false,
    workModelDefaultMonths,
  };
}
