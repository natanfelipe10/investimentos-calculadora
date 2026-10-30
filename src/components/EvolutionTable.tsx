import React, { useState } from 'react';
import { TableRow, formatCurrencyBRL } from '../utils/calculator';
import { ChevronDown, ChevronUp, Table } from 'lucide-react';

interface EvolutionTableProps {
  rows: TableRow[];
}

export const EvolutionTable: React.FC<EvolutionTableProps> = ({ rows }) => {
  const [showAll, setShowAll] = useState(false);

  if (!rows || rows.length === 0) {
    return null;
  }

  // Display initial 12 rows, expand on click
  const INITIAL_ROWS = 12;
  const isExpandable = rows.length > INITIAL_ROWS;
  const displayedRows = isExpandable && !showAll ? rows.slice(0, INITIAL_ROWS) : rows;

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-[6px] overflow-hidden shadow-xs">
      {/* Cabeçalho Institucional do Relatório */}
      <div className="bg-[#F8FAFC] border-b border-[#E4E7EC] px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Table className="h-4 w-4 text-[#16804A]" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#202B38] truncate">
            Tabela de Evolução Mês a Mês
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-[#667085] bg-white px-2.5 py-1 rounded-[4px] border border-[#E4E7EC] shrink-0">
          {rows.length} períodos
        </span>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-[#F8FAFC] text-[#202B38] font-bold border-b border-[#E4E7EC]">
              <th scope="col" className="py-3 px-3.5 sm:px-4 font-bold text-xs uppercase tracking-wider text-[#202B38]">
                Período
              </th>
              <th scope="col" className="py-3 px-3.5 sm:px-4 text-right font-bold text-xs uppercase tracking-wider text-[#667085]">
                Total Investido
              </th>
              <th scope="col" className="py-3 px-3.5 sm:px-4 text-right font-bold text-xs uppercase tracking-wider text-[#16804A]">
                Total em Juros
              </th>
              <th scope="col" className="py-3 px-3.5 sm:px-4 text-right font-bold text-xs uppercase tracking-wider text-[#202B38]">
                Patrimônio Acumulado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E7EC] font-mono tabular-nums">
            {displayedRows.map((row, index) => {
              const isEven = index % 2 === 1;
              return (
                <tr
                  key={row.label}
                  className={`${isEven ? 'bg-[#F8FAFC]/60' : 'bg-white'} hover:bg-[#F2F5F8] transition-colors`}
                >
                  <td className="py-2.5 px-3.5 sm:px-4 font-semibold text-[#202B38] whitespace-nowrap font-sans">
                    {row.label}
                  </td>
                  <td className="py-2.5 px-3.5 sm:px-4 text-right text-[#667085] whitespace-nowrap text-xs sm:text-[13px]">
                    {formatCurrencyBRL(row.invested)}
                  </td>
                  <td className="py-2.5 px-3.5 sm:px-4 text-right text-[#16804A] font-semibold whitespace-nowrap text-xs sm:text-[13px]">
                    +{formatCurrencyBRL(row.interest)}
                  </td>
                  <td className="py-2.5 px-3.5 sm:px-4 text-right font-bold text-[#202B38] whitespace-nowrap text-xs sm:text-[13px]">
                    {formatCurrencyBRL(row.total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isExpandable && (
        <div className="p-3 bg-[#F8FAFC] border-t border-[#E4E7EC] flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 text-xs font-bold text-[#202B38] hover:text-[#16804A] py-2 px-6 rounded-[4px] border border-[#E4E7EC] bg-white hover:bg-[#F8FAFC] transition-colors cursor-pointer shadow-2xs"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>VER MENOS</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>VER TABELA COMPLETA ({rows.length} PERÍODOS)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
