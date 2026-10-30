import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ChartPoint, formatCompactBRL, formatCurrencyBRL } from "../utils/calculator";
import { BarChart3 } from "lucide-react";

interface EvolutionChartProps {
  data: ChartPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const totalItem = payload.find((p) => p.dataKey === "total");
    const investedItem = payload.find((p) => p.dataKey === "invested");
    const totalVal = totalItem ? Number(totalItem.value) : 0;
    const investedVal = investedItem ? Number(investedItem.value) : 0;
    const interestVal = Math.max(0, totalVal - investedVal);

    return (
      <div className="rounded-[4px] border border-[#E4E7EC] bg-white p-3 shadow-md min-w-[210px] text-xs">
        <p className="font-bold text-[#202B38] border-b border-[#E4E7EC] pb-1.5 mb-2 font-sans">
          {label}
        </p>
        <div className="space-y-1.5 font-mono tabular-nums">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#667085] font-sans">
              <span className="h-2 w-2 rounded-[2px] bg-[#16804A] inline-block"></span>
              Patrimônio Total:
            </span>
            <span className="font-bold text-[#16804A]">
              {formatCurrencyBRL(totalVal)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#667085] font-sans">
              <span className="h-2 w-2 rounded-[2px] bg-[#202B38] inline-block"></span>
              Total Investido:
            </span>
            <span className="font-semibold text-[#202B38]">
              {formatCurrencyBRL(investedVal)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-[#E4E7EC] text-[11px]">
            <span className="text-[#667085] font-sans">Total em Juros:</span>
            <span className="font-bold text-[#16804A]">
              +{formatCurrencyBRL(interestVal)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const EvolutionChart: React.FC<EvolutionChartProps> = ({ data }) => {
  return (
    <div className="min-w-0 w-full bg-white border border-[#E4E7EC] rounded-[6px] overflow-hidden shadow-xs">
      {/* Barra de Título e Legenda da Seção Analítica */}
      <div className="bg-[#F8FAFC] border-b border-[#E4E7EC] px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#16804A]" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#202B38]">
            Gráfico de Evolução Patrimonial
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#667085]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-3.5 rounded-[2px] bg-[#202B38] inline-block"></span>
            <span className="font-medium text-[#202B38]">Total Investido</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-3.5 rounded-[2px] bg-[#16804A] inline-block"></span>
            <span className="font-bold text-[#16804A]">Patrimônio Total</span>
          </div>
        </div>
      </div>

      {/* Área do Gráfico */}
      <div className="p-3.5 sm:p-6 bg-white min-w-0 w-full">
        <div className="h-[250px] sm:h-[340px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 8, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="chartColorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16804A" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#16804A" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7EC" />
              <XAxis
                dataKey="shortLabel"
                tickLine={false}
                axisLine={{ stroke: "#E4E7EC" }}
                tick={{ fill: "#667085", fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#667085", fontSize: 10 }}
                tickFormatter={(v) => formatCompactBRL(v)}
                width={62}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="invested"
                name="Total Investido"
                stroke="#202B38"
                strokeWidth={2}
                fill="none"
              />
              <Area
                type="monotone"
                dataKey="total"
                name="Patrimônio Total"
                stroke="#16804A"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#chartColorTotal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
