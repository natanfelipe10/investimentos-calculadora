import React, { useState, useEffect } from 'react';
import { InfoTooltip } from './InfoTooltip';

interface CurrencyInputProps {
  id: string;
  label: string;
  tooltip?: string;
  helperText?: string;
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  label,
  tooltip,
  helperText,
  value,
  onChange,
  placeholder = '0,00',
}) => {
  const [displayValue, setDisplayValue] = useState<string>(() => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  });

  useEffect(() => {
    const formatted = value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const numericFromDisplay = parseBRLToNumber(displayValue);
    if (Math.abs(numericFromDisplay - value) > 0.009) {
      setDisplayValue(formatted);
    }
  }, [value]);

  function parseBRLToNumber(str: string): number {
    const cleaned = str.replace(/[^\d]/g, '');
    if (!cleaned) return 0;
    return parseFloat(cleaned) / 100;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^\d]/g, '');
    if (!rawVal) {
      setDisplayValue('');
      onChange(0);
      return;
    }
    const num = parseFloat(rawVal) / 100;
    const formatted = num.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setDisplayValue(formatted);
    onChange(num);
  };

  const handleBlur = () => {
    if (!displayValue || displayValue === '0' || displayValue === '0,00') {
      setDisplayValue('0,00');
      onChange(0);
    } else {
      const num = parseBRLToNumber(displayValue);
      setDisplayValue(
        num.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 mb-1.5">
        <div className="flex items-center gap-1.5">
          <label htmlFor={id} className="text-xs font-semibold text-[#202B38] tracking-wide">
            {label}
          </label>
          {tooltip && <InfoTooltip content={tooltip} />}
        </div>
        {helperText && (
          <span className="text-[11px] text-[#667085] leading-tight">
            {helperText}
          </span>
        )}
      </div>

      <div className="h-11 sm:h-12 flex rounded-[4px] border border-[#E4E7EC] bg-white transition-all focus-within:border-[#16804A] focus-within:ring-2 focus-within:ring-[#16804A]/15 shadow-2xs">
        <div className="flex items-center justify-center min-w-[42px] px-2.5 sm:px-3 bg-[#F8FAFC] border-r border-[#E4E7EC] rounded-l-[3px] shrink-0">
          <span className="text-xs font-bold text-[#667085]">R$</span>
        </div>
        <input
          type="text"
          inputMode="numeric"
          id={id}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full bg-transparent px-3 text-base sm:text-sm font-semibold text-[#202B38] placeholder-[#98A2B3] focus:outline-none tabular-nums"
        />
      </div>
    </div>
  );
};
