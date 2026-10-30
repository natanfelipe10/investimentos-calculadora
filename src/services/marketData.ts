/**
 * Market Data Service for Dividend Simulator
 * Decoupled layer for asset lookup and financial information
 */

export interface MarketAsset {
  ticker: string;
  name: string;
  type: 'Ação' | 'FII' | 'BDR' | 'ETF';
  exchange: string;
  referencePrice?: number;
  referenceD12?: number;
  referencePeriod: string;
  lastUpdateDate: string;
  isOfficialLiveFeed: boolean;
}

// Curated reference list of popular B3 assets for quick search assistance.
// Clearly identified as reference data, allowing manual editing by the user.
export const POPULAR_B3_ASSETS: MarketAsset[] = [
  {
    ticker: 'PETR4',
    name: 'Petrobras PN',
    type: 'Ação',
    exchange: 'B3',
    referencePrice: 38.50,
    referenceD12: 5.20,
    referencePeriod: 'Últimos 12 meses',
    lastUpdateDate: 'Referência recente',
    isOfficialLiveFeed: false,
  },
  {
    ticker: 'VALE3',
    name: 'Vale S.A. ON',
    type: 'Ação',
    exchange: 'B3',
    referencePrice: 62.80,
    referenceD12: 4.80,
    referencePeriod: 'Últimos 12 meses',
    lastUpdateDate: 'Referência recente',
    isOfficialLiveFeed: false,
  },
  {
    ticker: 'ITUB4',
    name: 'Itaú Unibanco PN',
    type: 'Ação',
    exchange: 'B3',
    referencePrice: 34.20,
    referenceD12: 2.70,
    referencePeriod: 'Últimos 12 meses',
    lastUpdateDate: 'Referência recente',
    isOfficialLiveFeed: false,
  },
  {
    ticker: 'BBAS3',
    name: 'Banco do Brasil ON',
    type: 'Ação',
    exchange: 'B3',
    referencePrice: 28.90,
    referenceD12: 2.85,
    referencePeriod: 'Últimos 12 meses',
    lastUpdateDate: 'Referência recente',
    isOfficialLiveFeed: false,
  },
  {
    ticker: 'BBSE3',
    name: 'BB Seguridade ON',
    type: 'Ação',
    exchange: 'B3',
    referencePrice: 36.40,
    referenceD12: 3.55,
    referencePeriod: 'Últimos 12 meses',
    lastUpdateDate: 'Referência recente',
    isOfficialLiveFeed: false,
  },
  {
    ticker: 'TAEE11',
    name: 'Taesa Unit',
    type: 'Ação',
    exchange: 'B3',
    referencePrice: 35.10,
    referenceD12: 3.40,
    referencePeriod: 'Últimos 12 meses',
    lastUpdateDate: 'Referência recente',
    isOfficialLiveFeed: false,
  },
  {
    ticker: 'MXRF11',
    name: 'Maxi Renda FII',
    type: 'FII',
    exchange: 'B3',
    referencePrice: 10.20,
    referenceD12: 1.15,
    referencePeriod: 'Últimos 12 meses',
    lastUpdateDate: 'Referência recente',
    isOfficialLiveFeed: false,
  },
  {
    ticker: 'HGLG11',
    name: 'CSHG Logística FII',
    type: 'FII',
    exchange: 'B3',
    referencePrice: 162.00,
    referenceD12: 13.20,
    referencePeriod: 'Últimos 12 meses',
    lastUpdateDate: 'Referência recente',
    isOfficialLiveFeed: false,
  },
  {
    ticker: 'XPML11',
    name: 'XP Malls FII',
    type: 'FII',
    exchange: 'B3',
    referencePrice: 112.50,
    referenceD12: 10.50,
    referencePeriod: 'Últimos 12 meses',
    lastUpdateDate: 'Referência recente',
    isOfficialLiveFeed: false,
  },
  {
    ticker: 'KNCR11',
    name: 'Kinea Rendimentos FII',
    type: 'FII',
    exchange: 'B3',
    referencePrice: 104.00,
    referenceD12: 12.10,
    referencePeriod: 'Últimos 12 meses',
    lastUpdateDate: 'Referência recente',
    isOfficialLiveFeed: false,
  },
];

export function searchLocalAssets(query: string): MarketAsset[] {
  const clean = query.trim().toUpperCase();
  if (!clean) return [];

  return POPULAR_B3_ASSETS.filter(
    (asset) =>
      asset.ticker.toUpperCase().includes(clean) ||
      asset.name.toUpperCase().includes(clean)
  );
}
