import React from 'react';
import { MarketDataSummary } from '../types';
import { TrendingUp, TrendingDown, Sparkles, Building2, MapPin } from 'lucide-react';

interface MarketStatsBarProps {
  marketData: MarketDataSummary | null;
  isLoading: boolean;
  onOpenAssetModal?: () => void;
}

export const MarketStatsBar: React.FC<MarketStatsBarProps> = ({
  marketData,
  isLoading,
  onOpenAssetModal,
}) => {
  if (isLoading) {
    return (
      <div className="bg-[#0c0c0e] border-b border-neutral-800 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between animate-pulse">
          <div className="h-4 bg-neutral-800 rounded-none w-40"></div>
          <div className="flex gap-4">
            <div className="h-4 bg-neutral-800 rounded-none w-20"></div>
            <div className="h-4 bg-neutral-800 rounded-none w-20"></div>
            <div className="h-4 bg-neutral-800 rounded-none w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!marketData) return null;

  const isPositive = marketData.changePercent >= 0;
  const isStartup = marketData.category === 'startup';

  return (
    <div className="bg-[#0c0c0e] border-b border-neutral-800 px-4 sm:px-6 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Ticker, Badge & Price Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-2">
            <button
              onClick={onOpenAssetModal}
              className="text-sm font-black font-mono text-yellow-400 tracking-wider hover:underline cursor-pointer flex items-center gap-1.5"
              title="Click to switch startup or stock"
            >
              <span>${marketData.ticker}</span>
            </button>
            <span className="text-xs text-neutral-300 font-medium truncate max-w-[180px] sm:max-w-xs">
              {marketData.companyName}
            </span>
          </div>

          {/* Startup / Public Badge */}
          {isStartup ? (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-amber-950/40 text-amber-300 border border-amber-800/50 px-2 py-0.5 rounded-xs uppercase">
              <Sparkles className="w-2.5 h-2.5" />
              {marketData.stage || 'UNICORN / STARTUP'}
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-blue-950/40 text-blue-300 border border-blue-800/50 px-2 py-0.5 rounded-xs uppercase">
              <Building2 className="w-2.5 h-2.5" />
              PUBLIC
            </span>
          )}

          {marketData.headquarters && (
            <span className="hidden lg:flex items-center gap-1 text-[10px] font-mono text-neutral-400">
              <MapPin className="w-2.5 h-2.5 text-neutral-500" />
              {marketData.headquarters}
            </span>
          )}

          <div className="h-3 w-px bg-neutral-800"></div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-xs font-bold text-white tabular-nums">
              ${marketData.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 border flex items-center gap-0.5 tabular-nums ${
                isPositive
                  ? 'bg-emerald-950/30 text-emerald-400 border-emerald-800/40'
                  : 'bg-rose-950/30 text-rose-400 border-rose-800/40'
              }`}
            >
              {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
              {isPositive ? '+' : ''}
              {marketData.changePercent}%
            </span>
          </div>
        </div>

        {/* Right: Key Fundamental Data Ribbon */}
        <div className="flex items-center gap-4 sm:gap-5 text-xs font-mono text-neutral-400 overflow-x-auto">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-neutral-400 text-[10px] uppercase tracking-wider">
              {isStartup ? 'VALUATION' : 'MCAP'}
            </span>
            <span className="text-white font-medium">{marketData.marketCap}</span>
          </div>

          <div className="h-2.5 w-px bg-neutral-800"></div>

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-neutral-400 text-[10px] uppercase tracking-wider">
              {isStartup ? 'MULTIPLE' : 'P/E'}
            </span>
            <span className="text-white font-medium">{marketData.peRatio}</span>
          </div>

          <div className="h-2.5 w-px bg-neutral-800"></div>

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-neutral-400 text-[10px] uppercase tracking-wider">CASH FLOW</span>
            <span className="text-white font-medium">{marketData.freeCashFlow}</span>
          </div>

          <div className="h-2.5 w-px bg-neutral-800"></div>

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-neutral-400 text-[10px] uppercase tracking-wider">GROWTH</span>
            <span className="text-yellow-400 font-medium">{marketData.revenueGrowthYoY}</span>
          </div>

          <div className="h-2.5 w-px bg-neutral-800 hidden md:block"></div>

          <div className="flex items-center gap-1.5 whitespace-nowrap hidden md:flex">
            <span className="text-neutral-400 text-[10px] uppercase tracking-wider">MARGIN</span>
            <span className="text-white font-medium">{marketData.grossMargin}</span>
          </div>

          {onOpenAssetModal && (
            <button
              onClick={onOpenAssetModal}
              className="ml-2 px-2 py-0.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-yellow-400 text-[10px] font-bold rounded-xs cursor-pointer uppercase transition-colors"
            >
              Change &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
