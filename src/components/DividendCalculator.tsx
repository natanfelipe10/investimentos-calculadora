import React, { useState, useMemo, useRef } from 'react';
import {
  Calculator,
  RotateCcw,
  Search,
  TrendingUp,
  Coins,
  LineChart as LineChartIcon,
  Table as TableIcon,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { CurrencyInput } from './CurrencyInput';
import { DividendFaq } from './DividendFaq';
import {
  DividendParams,
  calculateDividendRequirements,
} from '../utils/dividendCalculator';
import { formatCurrencyBRL, formatCompactBRL } from '../utils/calculator';
import { searchLocalAssets, MarketAsset } from '../services/marketData';

const DEFAULT_DIVIDEND_PARAMS: DividendParams = {
  ticker: 'ATIVO11',
  assetName: 'Exemplo Didático de Ativo',
  desiredMonthlyIncome: 1000,
  currentPrice: 100,
  annualDividendPerShare: 6,
  referencePeriod: 'Últimos 12 meses',
  referenceDate: 'Informado manualmente',
  isManualEntry: true,
};

export const DividendCalculator: React.FC = () => {
  // Form State - Iniciar com campos limpos/zerados
  const [tickerQuery, setTickerQuery] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [desiredMonthlyIncome, setDesiredMonthlyIncome] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [annualDividendPerShare, setAnnualDividendPerShare] = useState<number>(0);
  const [isManualEntry, setIsManualEntry] = useState<boolean>(true);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Active calculated parameters
  const [calculatedParams, setCalculatedParams] = useState<DividendParams | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Search suggestions
  const searchResults = useMemo(() => {
    return searchLocalAssets(tickerQuery);
  }, [tickerQuery]);

  // Compute Results
  const results = useMemo(() => {
    if (!calculatedParams) return null;
    return calculateDividendRequirements(calculatedParams);
  }, [calculatedParams]);

  const handleSelectAsset = (asset: MarketAsset) => {
    setSelectedAsset(asset);
    setTickerQuery(asset.ticker);
    if (asset.referencePrice) setCurrentPrice(asset.referencePrice);
    if (asset.referenceD12) setAnnualDividendPerShare(asset.referenceD12);
    setIsManualEntry(false);
    setSearchDropdownOpen(false);
    setValidationError(null);
  };

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!tickerQuery.trim()) {
      setValidationError('Por favor, informe o código do ativo (ex.: BBDC4, MXRF11, TAEE11).');
      return;
    }
    if (desiredMonthlyIncome <= 0) {
      setValidationError('Informe uma renda mensal desejada maior que zero.');
      return;
    }
    if (currentPrice <= 0) {
      setValidationError('Informe o preço atual da cotação do ativo.');
      return;
    }
    if (annualDividendPerShare <= 0) {
      setValidationError('Informe o valor de dividendos pagos nos últimos 12 meses.');
      return;
    }

    setValidationError(null);

    const newParams: DividendParams = {
      ticker: tickerQuery.trim().toUpperCase(),
      assetName: selectedAsset?.name || 'Ativo informado pelo usuário',
      desiredMonthlyIncome,
      currentPrice,
      annualDividendPerShare,
      referencePeriod: 'Últimos 12 meses',
      referenceDate: selectedAsset?.lastUpdateDate || 'Informado manualmente',
      isManualEntry,
    };

    setCalculatedParams(newParams);
    setHasCalculated(true);

    // Smooth scroll to results on mobile
    if (resultsRef.current) {
      const topOffset = resultsRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  const handleClear = () => {
    setTickerQuery('');
    setSelectedAsset(null);
    setDesiredMonthlyIncome(0);
    setCurrentPrice(0);
    setAnnualDividendPerShare(0);
    setIsManualEntry(true);
    setSearchDropdownOpen(false);
    setValidationError(null);
    setHasCalculated(false);
    setCalculatedParams(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Container Principal */}
      <div className="bg-white border border-[#D1D5DB] rounded-md shadow-xs overflow-hidden">
        
        {/* CABEÇALHO DO SIMULADOR */}
        <div className="p-4 sm:p-6 border-b border-[#D1D5DB] bg-white">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#176B45] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              Planejamento de Renda Passiva
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#26313D] tracking-tight">
            Calculadora de Dividendos
          </h2>
          <p className="text-xs sm:text-sm text-[#536174] mt-1 leading-relaxed max-w-2xl">
            Descubra quanto dinheiro e quantas ações ou cotas você precisa investir para receber determinado valor mensal em dividendos.
          </p>
        </div>

        {/* SEÇÃO 1: FORMULÁRIO DE SIMULAÇÃO */}
        <section>
          <div className="bg-[#F7F7F7] border-b border-[#D1D5DB] px-4 sm:px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-[#26313D]" />
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#26313D]">
                Dados da Simulação
              </h3>
            </div>
            <span className="text-[11px] text-[#6B7280]">
              Informe o ativo e a meta de renda
            </span>
          </div>

          <form onSubmit={handleCalculate} className="p-4 sm:p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              
              {/* Campo 1: Ativo (Pesquisa / Ticker) */}
              <div className="flex flex-col relative">
                <div className="flex items-baseline justify-between mb-1.5">
                  <label htmlFor="tickerInput" className="text-xs font-semibold text-[#26313D] tracking-wide">
                    Informe o ativo que você quer simular
                  </label>
                  <span className="text-[11px] text-[#6B7280]">
                    Ticker ou código
                  </span>
                </div>

                <div className="h-11 flex rounded-md border border-[#D1D5DB] bg-white transition-colors focus-within:border-[#26313D] focus-within:ring-2 focus-within:ring-[#26313D]/15">
                  <div className="flex items-center justify-center px-3 bg-[#F7F7F7] border-r border-[#D1D5DB] shrink-0 text-[#536174]">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    id="tickerInput"
                    value={tickerQuery}
                    onChange={(e) => {
                      setTickerQuery(e.target.value);
                      setIsManualEntry(true);
                      setSearchDropdownOpen(true);
                      setValidationError(null);
                    }}
                    onFocus={() => setSearchDropdownOpen(true)}
                    placeholder="Ex: MXRF11, BBDC4, TAEE11"
                    className="w-full bg-transparent px-3 text-xs sm:text-sm font-semibold text-[#26313D] placeholder-[#9CA3AF] uppercase focus:outline-none"
                  />
                </div>

                {/* Dropdown de sugestões de busca rápida */}
                {searchDropdownOpen && searchResults.length > 0 && (
                  <div className="absolute top-[68px] left-0 right-0 z-30 bg-white border border-[#D1D5DB] rounded-md shadow-lg max-h-48 overflow-y-auto">
                    <div className="p-1.5 bg-[#F7F7F7] border-b border-[#D1D5DB] text-[10px] font-bold text-[#536174] uppercase tracking-wider flex items-center justify-between">
                      <span>Ativos de Referência B3</span>
                      <button
                        type="button"
                        onClick={() => setSearchDropdownOpen(false)}
                        className="text-[#536174] hover:text-[#26313D] font-normal"
                      >
                        Fechar &times;
                      </button>
                    </div>
                    {searchResults.map((asset) => (
                      <button
                        key={asset.ticker}
                        type="button"
                        onClick={() => handleSelectAsset(asset)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-[#F1F2F3] flex items-center justify-between border-b border-slate-100 last:border-b-0 cursor-pointer"
                      >
                        <div>
                          <strong className="text-[#26313D] mr-2">{asset.ticker}</strong>
                          <span className="text-[#536174]">{asset.name}</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-[#536174] font-medium">
                          {asset.type}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-1.5 text-[11px] text-[#6B7280]">
                  {selectedAsset ? (
                    <span className="text-[#176B45] font-medium flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Ativo selecionado: {selectedAsset.name} ({selectedAsset.type})
                    </span>
                  ) : (
                    <span>Informe o código de ações, FIIs ou ETFs (ex.: BBDC4, MXRF11, TAEE11)</span>
                  )}
                </div>
              </div>

              {/* Campo 2: Renda mensal desejada */}
              <CurrencyInput
                id="desiredIncome"
                label="Renda mensal desejada"
                helperText="Quanto você quer receber por mês de proventos?"
                value={desiredMonthlyIncome}
                onChange={(val) => {
                  setDesiredMonthlyIncome(val);
                  setValidationError(null);
                }}
                placeholder="0,00"
              />

              {/* Campo 3: Preço atual por ação ou cota */}
              <CurrencyInput
                id="currentPrice"
                label="Preço atual da cotação"
                helperText="Preço atual ou cotação de referência do ativo"
                value={currentPrice}
                onChange={(val) => {
                  setCurrentPrice(val);
                  setIsManualEntry(true);
                  setValidationError(null);
                }}
                placeholder="0,00"
              />

              {/* Campo 4: Dividendos por ação/cota nos últimos 12 meses */}
              <CurrencyInput
                id="annualDividend"
                label="Dividendos pagos nos últimos 12 meses"
                helperText="Total em proventos distribuídos por unidade nos últimos 12 meses"
                value={annualDividendPerShare}
                onChange={(val) => {
                  setAnnualDividendPerShare(val);
                  setIsManualEntry(true);
                  setValidationError(null);
                }}
                placeholder="0,00"
              />

            </div>

            {/* Identificação de dados manuais / referência */}
            <div className="p-3 bg-[#F1F2F3] border-l-2 border-[#176B45] text-xs text-[#536174] leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <strong>Fonte dos Dados Financeiros:</strong>{' '}
                {isManualEntry ? (
                  <span>Valores preenchidos manualmente pelo usuário.</span>
                ) : (
                  <span>Valores sugeridos com base em histórico público recente do ativo.</span>
                )}
              </div>
              <span className="text-[11px] text-[#6B7280] font-mono">
                Período: Últimos 12 meses
              </span>
            </div>

            {/* Validação de entrada */}
            {validationError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>{validationError}</span>
              </div>
            )}
            {results && !results.isValid && results.errorMessage && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>{results.errorMessage}</span>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-[#D1D5DB]/60">
              <button
                type="button"
                onClick={handleClear}
                className="h-11 px-5 rounded border border-[#D1D5DB] bg-white hover:bg-[#F7F7F7] text-xs font-semibold text-[#536174] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4 text-[#536174]" />
                <span>LIMPAR</span>
              </button>
              <button
                type="submit"
                className="h-11 px-7 rounded bg-[#176B45] hover:bg-[#125537] text-white text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <CheckCircle className="h-4 w-4" />
                <span>CALCULAR</span>
              </button>
            </div>
          </form>
        </section>

        {/* SEÇÃO 2: RESULTADOS OU ESTADO INICIAL VAZIO */}
        {!hasCalculated ? (
          <section className="border-t border-[#D1D5DB] bg-[#F7F7F7] p-8 text-center">
            <div className="max-w-md mx-auto flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-white border border-[#D1D5DB] flex items-center justify-center text-[#536174] mb-3 shadow-2xs">
                <Coins className="h-6 w-6 text-[#176B45]" />
              </div>
              <p className="text-sm font-semibold text-[#26313D] mb-1">
                Simulação Pronta para Início
              </p>
              <p className="text-xs text-[#536174] leading-relaxed">
                Preencha os campos acima e clique em Calcular para visualizar os resultados.
              </p>
            </div>
          </section>
        ) : results && results.isValid && calculatedParams ? (
          <>
            <section ref={resultsRef} className="border-t border-[#D1D5DB]">
            <div className="bg-[#F7F7F7] border-b border-[#D1D5DB] px-4 sm:px-6 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-[#26313D]" />
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#26313D]">
                  Resultados da Simulação
                </h3>
              </div>
              <span className="text-[11px] text-[#536174] font-medium">
                Ativo: {calculatedParams.ticker} &bull; DY: {results.dividendYieldPercent.toFixed(2)}% a.a.
              </span>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {/* 3 Cards Principais de Resultados */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                
                {/* Card 1: Patrimônio necessário (Destaque Principal) */}
                <div className="rounded-md border-2 border-[#176B45] bg-white p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#176B45] mb-1.5">
                    Patrimônio necessário
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#176B45] tracking-tight font-mono">
                    {formatCurrencyBRL(results.integerRequiredCapital)}
                  </span>
                  <span className="text-[11px] text-[#536174] mt-1">
                    Para comprar {results.integerSharesNeeded.toLocaleString('pt-BR')} unidades inteiras
                  </span>
                </div>

                {/* Card 2: Renda mensal estimada */}
                <div className="rounded-md border border-[#D1D5DB] bg-white p-4 sm:p-5 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#536174] mb-1.5">
                    Renda mensal estimada
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-[#26313D] font-mono">
                    {formatCurrencyBRL(results.effectiveMonthlyIncome)}
                  </span>
                  <span className="text-[11px] text-[#6B7280] mt-1">
                    Equivalente a {formatCurrencyBRL(results.effectiveAnnualIncome)} ao ano
                  </span>
                </div>

                {/* Card 3: Quantidade de ações ou cotas */}
                <div className="rounded-md border border-[#D1D5DB] bg-white p-4 sm:p-5 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#536174] mb-1.5">
                    Quantidade de ações ou cotas
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-[#26313D] font-mono">
                    {results.integerSharesNeeded.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-[11px] text-[#6B7280] mt-1">
                    Cotas inteiras (exato teórico: {results.theoreticalSharesNeeded.toFixed(2)})
                  </span>
                </div>

              </div>

              {/* Informações detalhadas do cálculo */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-[#F7F7F7] border border-[#D1D5DB] rounded-md text-xs">
                <div>
                  <span className="text-[#6B7280] block text-[11px]">Preço utilizado:</span>
                  <strong className="text-[#26313D] font-mono">{formatCurrencyBRL(calculatedParams.currentPrice)}</strong>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[11px]">Dividendos (12 meses):</span>
                  <strong className="text-[#176B45] font-mono">{formatCurrencyBRL(calculatedParams.annualDividendPerShare)}</strong>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[11px]">Dividend Yield Anual:</span>
                  <strong className="text-[#176B45] font-mono">{results.dividendYieldPercent.toFixed(2)}% a.a.</strong>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[11px]">Renda anual estimada:</span>
                  <strong className="text-[#26313D] font-mono">{formatCurrencyBRL(results.desiredAnnualIncome)}</strong>
                </div>
              </div>

              {/* Frase explicativa obrigatória */}
              <div className="rounded-md border border-[#D1D5DB] bg-[#F7F7F7] px-4 py-3 flex items-center gap-2.5 text-xs sm:text-sm text-[#26313D]">
                <CheckCircle className="h-4 w-4 text-[#176B45] shrink-0" />
                <p className="leading-relaxed">
                  Com base no preço e nos dividendos históricos informados, o patrimônio estimado necessário para buscar essa renda seria de <strong>{formatCurrencyBRL(results.integerRequiredCapital)}</strong>.
                </p>
              </div>

              <div className="text-[11px] text-[#6B7280] italic">
                * Estimativa matemática calculada com base no histórico recente de proventos. Não representa garantia ou promessa de pagamentos futuros.
              </div>
            </div>
          </section>

          {/* SEÇÃO 3: GRÁFICO DE RENDA COM DIVIDENDOS */}
          <section className="border-t border-[#D1D5DB]">
            <div className="bg-[#F7F7F7] border-b border-[#D1D5DB] px-4 sm:px-6 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChartIcon className="h-4 w-4 text-[#26313D]" />
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#26313D]">
                  Simulação de Renda com Dividendos
                </h3>
              </div>
              <span className="text-[11px] text-[#6B7280]">
                Relação entre Patrimônio Investido e Renda Mensal
              </span>
            </div>

            <div className="p-4 sm:p-6 bg-white">
              <div className="h-[250px] sm:h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={results.chartData}
                    margin={{ top: 10, right: 10, left: -5, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="dividendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#176B45" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#176B45" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                      dataKey="formattedCapital"
                      tickLine={false}
                      axisLine={{ stroke: '#D1D5DB' }}
                      tick={{ fill: '#6B7280', fontSize: 11 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#6B7280', fontSize: 11 }}
                      tickFormatter={(v) => formatCompactBRL(v)}
                      width={65}
                    />
                    <Tooltip
                      formatter={(val: any) => [formatCurrencyBRL(Number(val) || 0), 'Renda Mensal Estimada']}
                      labelFormatter={(label) => `Patrimônio: ${label}`}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="monthlyIncome"
                      name="Renda Mensal"
                      stroke="#176B45"
                      strokeWidth={2.5}
                      fill="url(#dividendGradient)"
                      activeDot={{ r: 5, stroke: '#176B45', strokeWidth: 2, fill: '#FFFFFF' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <p className="mt-3 text-xs text-[#536174] text-center">
                A curva ilustra a progressão linear da renda mensal gerada conforme o patrimônio investido aumenta a um Dividend Yield de <strong>{results.dividendYieldPercent.toFixed(2)}% ao ano</strong>.
              </p>
            </div>
          </section>

          {/* SEÇÃO 4: TABELA DE CENÁRIOS */}
          <section className="border-t border-[#D1D5DB]">
            <div className="bg-[#F7F7F7] border-b border-[#D1D5DB] px-4 sm:px-6 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TableIcon className="h-4 w-4 text-[#26313D]" />
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#26313D]">
                  Tabela de Cenários de Patrimônio
                </h3>
              </div>
              <span className="text-[11px] text-[#6B7280]">
                Evolução derivada do Dividend Yield ({results.dividendYieldPercent.toFixed(2)}% a.a.)
              </span>
            </div>

            <div className="overflow-x-auto bg-white">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F7F7F7] text-[#26313D] font-semibold border-b border-[#D1D5DB]">
                    <th scope="col" className="py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">
                      Cenário / Meta
                    </th>
                    <th scope="col" className="py-2.5 px-4 text-right font-semibold text-xs uppercase tracking-wider">
                      Patrimônio Investido
                    </th>
                    <th scope="col" className="py-2.5 px-4 text-right font-semibold text-xs uppercase tracking-wider">
                      Quantidade de Cotas
                    </th>
                    <th scope="col" className="py-2.5 px-4 text-right font-semibold text-xs uppercase tracking-wider">
                      Renda Mensal Estimada
                    </th>
                    <th scope="col" className="py-2.5 px-4 text-right font-semibold text-xs uppercase tracking-wider">
                      Renda Anual Estimada
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D1D5DB]/60">
                  {results.scenarios.map((scen, idx) => {
                    const isTarget = scen.label.includes('100%');
                    const isEven = idx % 2 === 1;
                    return (
                      <tr
                        key={scen.label}
                        className={`${
                          isTarget
                            ? 'bg-emerald-50/70 font-semibold'
                            : isEven
                            ? 'bg-[#F1F2F3]'
                            : 'bg-white'
                        } hover:bg-slate-200/50 transition-colors`}
                      >
                        <td className="py-2.5 px-4 whitespace-nowrap text-[#26313D]">
                          {scen.label}
                        </td>
                        <td className="py-2.5 px-4 text-right whitespace-nowrap font-mono text-xs sm:text-[13px] text-[#26313D]">
                          {formatCurrencyBRL(scen.investedCapital)}
                        </td>
                        <td className="py-2.5 px-4 text-right whitespace-nowrap font-mono text-xs sm:text-[13px] text-[#536174]">
                          {scen.sharesCount.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-2.5 px-4 text-right whitespace-nowrap font-mono text-xs sm:text-[13px] font-bold text-[#176B45]">
                          +{formatCurrencyBRL(scen.monthlyIncome)}
                        </td>
                        <td className="py-2.5 px-4 text-right whitespace-nowrap font-mono text-xs sm:text-[13px] text-[#536174]">
                          {formatCurrencyBRL(scen.annualIncome)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

        {/* SEÇÃO 5: GUIA EDUCATIVO COMPLETO */}
        <section className="border-t border-[#D1D5DB]">
          <div className="bg-[#F7F7F7] border-b border-[#D1D5DB] px-4 sm:px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#26313D]" />
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#26313D]">
                Guia sobre Renda com Dividendos
              </h3>
            </div>
            <span className="text-[11px] text-[#6B7280]">
              Educação Financeira
            </span>
          </div>

          <article className="p-4 sm:p-8 space-y-7 text-xs sm:text-sm text-[#536174] leading-relaxed">
            
            {/* O que é uma calculadora de dividendos? */}
            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-[#26313D]">
                Calculadora de Dividendos
              </h2>
              <p>
                A calculadora de dividendos é uma ferramenta que estima quanto patrimônio pode ser necessário para buscar determinada renda proveniente dos proventos distribuídos por ações, fundos imobiliários e outros ativos elegíveis.
              </p>
            </div>

            {/* Como funciona a calculadora? */}
            <div className="space-y-2 border-t border-[#D1D5DB]/60 pt-5">
              <h3 className="text-sm sm:text-base font-bold text-[#26313D]">
                Como funciona a calculadora?
              </h3>
              <p>
                O cálculo utiliza o preço do ativo ($P$), os dividendos históricos distribuídos por ação ou cota nos últimos 12 meses ($D12$) e a renda desejada ($R$):
              </p>
              <ul className="space-y-1.5 pl-4 list-disc text-xs sm:text-sm">
                <li><strong>Dividend Yield Anual:</strong> calculado pela divisão do dividendo dos últimos 12 meses pelo preço da cotação ($D12 \div P$).</li>
                <li><strong>Quantidade necessária:</strong> obtida dividindo a meta de renda anual pelos proventos pagos por unidade ($(R \times 12) \div D12$).</li>
                <li><strong>Patrimônio total:</strong> resulta da multiplicação da quantidade de ações ou cotas pelo preço unitário de mercado.</li>
              </ul>
            </div>

            {/* O que é Dividend Yield? */}
            <div className="space-y-2 border-t border-[#D1D5DB]/60 pt-5">
              <h3 className="text-sm sm:text-base font-bold text-[#26313D]">
                O que é Dividend Yield?
              </h3>
              <p>
                O Dividend Yield (DY) representa a relação entre os dividendos distribuídos por ação ou cota em determinado período e o preço utilizado no cálculo. Ele indica o retorno percentual que o investidor recebeu em dinheiro vivo em relação ao montante alocado na cotação analisada.
              </p>
              <div className="p-3 bg-[#F7F7F7] border border-[#D1D5DB] rounded-md text-xs font-mono">
                Dividend Yield (%) = (Dividendos pagos por ação em 12 meses &divide; Preço da ação) &times; 100
              </div>
            </div>

            {/* Como interpretar os resultados? */}
            <div className="space-y-3 border-t border-[#D1D5DB]/60 pt-5">
              <h3 className="text-sm sm:text-base font-bold text-[#26313D]">
                Como interpretar os resultados?
              </h3>
              <p>
                A calculadora apresenta três métricas essenciais para orientar o investidor:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 border border-[#D1D5DB] rounded-md bg-white">
                  <strong className="text-[#176B45] block mb-1">Patrimônio estimado</strong>
                  <p className="text-[#536174]">
                    Montante total que precisaria ser acumulado no ativo para gerar a renda alvo, considerando a cotação e proventos informados.
                  </p>
                </div>
                <div className="p-3 border border-[#D1D5DB] rounded-md bg-white">
                  <strong className="text-[#26313D] block mb-1">Renda mensal estimada</strong>
                  <p className="text-[#536174]">
                    Fluxo financeiro médio mensal projetado a partir da distribuição anual do lote de ações ou cotas inteiras.
                  </p>
                </div>
                <div className="p-3 border border-[#D1D5DB] rounded-md bg-white">
                  <strong className="text-[#26313D] block mb-1">Quantidade de cotas</strong>
                  <p className="text-[#536174]">
                    Volume total de unidades que o investidor deve manter em carteira para atingir a meta.
                  </p>
                </div>
              </div>
            </div>

            {/* Os dividendos são garantidos? */}
            <div className="space-y-2 border-t border-[#D1D5DB]/60 pt-5">
              <h3 className="text-sm sm:text-base font-bold text-[#26313D]">
                Os dividendos são garantidos?
              </h3>
              <p>
                Não. Dividendos e outros proventos decorrem do resultado financeiro das empresas e dos fundos, podendo sofrer variações sazonais, reduções ou até cancelamentos em cenários de crise econômica ou de retenção estratégica de lucros.
              </p>
              <p>
                O histórico de pagamentos passados <strong>não representa garantia de rentabilidade futura</strong>. Por isso, especialistas recomendam diversificação entre múltiplos setores e ativos em vez de concentrar todo o patrimônio em um único papel.
              </p>
            </div>

          </article>
        </section>

        {/* SEÇÃO 6: DÚVIDAS COMUNS (FAQ EXPANSÍVEL) */}
        <section className="border-t border-[#D1D5DB]">
          <DividendFaq />
        </section>

      </div>

      {/* Aviso legal discreto */}
      <div className="text-center text-[11px] text-[#6B7280]">
        Calculadora de Dividendos &bull; Ferramenta didática de análise e estimativa de proventos
      </div>
    </div>
  );
};
