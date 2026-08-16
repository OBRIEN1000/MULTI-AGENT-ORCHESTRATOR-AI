import React, { useState } from 'react';
import { PRESET_STOCKS } from '../data/presets';
import { MarketDataSummary } from '../types';
import { Search, X, Sparkles, Building2, Rocket, ArrowRight, Check, Globe } from 'lucide-react';

interface AssetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTicker: string;
  onSelectTicker: (ticker: string) => void;
}

export const AssetSelectorModal: React.FC<AssetSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTicker,
  onSelectTicker,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'startup' | 'public'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customInput, setCustomInput] = useState('');

  if (!isOpen) return null;

  const allAssets = Object.values(PRESET_STOCKS);

  const filteredAssets = allAssets.filter((asset) => {
    const matchesCategory = filterCategory === 'all' || asset.category === filterCategory;
    const matchesSearch =
      asset.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.headquarters && asset.headquarters.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSelect = (ticker: string) => {
    onSelectTicker(ticker);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelectTicker(customInput.trim().toUpperCase());
      setCustomInput('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#0e0e12] border border-neutral-800 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between bg-[#131318]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-sans flex items-center gap-2">
                Select Asset for Due Diligence Audit
                <span className="text-[10px] font-mono font-bold bg-yellow-400 text-black px-2 py-0.5 rounded-xs uppercase">
                  11-Desk Ready
                </span>
              </h2>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                Choose an AI unicorn startup, public tech titan, or search any private/public company
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-4 sm:p-5 border-b border-neutral-800/80 bg-[#101015] flex flex-wrap items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center bg-[#18181f] p-1 rounded-md border border-neutral-800 font-mono text-xs">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-sm font-semibold transition-colors cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ALL ({allAssets.length})
            </button>
            <button
              onClick={() => setFilterCategory('startup')}
              className={`px-3 py-1 rounded-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'startup'
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>STARTUPS &amp; UNICORNS ({allAssets.filter((a) => a.category === 'startup').length})</span>
            </button>
            <button
              onClick={() => setFilterCategory('public')}
              className={`px-3 py-1 rounded-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'public'
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>PUBLIC GIANTS ({allAssets.filter((a) => a.category === 'public').length})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, sector, location (e.g. Mistral, Paris, OpenAI, SpaceX)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#16161c] border border-neutral-700/80 pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 rounded-md focus:outline-none focus:border-yellow-400 font-sans"
            />
          </div>
        </div>

        {/* Asset Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 max-h-[480px] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredAssets.map((asset) => {
              const isSelected = currentTicker === asset.ticker;
              const isStartup = asset.category === 'startup';

              return (
                <div
                  key={asset.ticker}
                  onClick={() => handleSelect(asset.ticker)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer relative group flex flex-col justify-between ${
                    isSelected
                      ? 'bg-yellow-400/10 border-yellow-400 ring-1 ring-yellow-400/50'
                      : 'bg-[#121217] hover:bg-[#16161e] border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {/* Top line: Badges & Ticker */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-yellow-400 bg-neutral-900 px-2 py-0.5 border border-neutral-700 rounded-xs">
                          ${asset.ticker}
                        </span>
                        <span className="font-bold text-white text-sm font-sans">
                          {asset.companyName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isStartup ? (
                          <span className="text-[10px] font-mono font-bold bg-amber-950/40 text-amber-300 border border-amber-800/50 px-2 py-0.5 rounded-xs uppercase flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            UNICORN
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-bold bg-blue-950/40 text-blue-300 border border-blue-800/50 px-2 py-0.5 rounded-xs uppercase flex items-center gap-1">
                            <Building2 className="w-2.5 h-2.5" />
                            PUBLIC
                          </span>
                        )}

                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-yellow-400 text-black flex items-center justify-center text-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stage & Location metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-neutral-400 mb-2">
                      {asset.stage && (
                        <span className="text-neutral-300 font-semibold">{asset.stage}</span>
                      )}
                      {asset.headquarters && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-neutral-400">
                            <Globe className="w-3 h-3 text-neutral-500" />
                            {asset.headquarters}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Summary */}
                    <p className="text-xs text-neutral-300 line-clamp-2 font-sans leading-relaxed">
                      {asset.summary}
                    </p>
                  </div>

                  {/* Financial Ribbon */}
                  <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block">Valuation</span>
                        <span className="font-bold text-white text-[11px]">{asset.marketCap}</span>
                      </div>
                      <div className="h-4 w-px bg-neutral-800"></div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block">Growth YoY</span>
                        <span className="font-bold text-emerald-400 text-[11px]">{asset.revenueGrowthYoY}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-yellow-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      AUDIT &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAssets.length === 0 && (
            <div className="py-12 text-center text-neutral-400 border border-dashed border-neutral-800 rounded-lg">
              <Search className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
              <p className="text-sm font-bold text-white">No preset matched &quot;{searchQuery}&quot;</p>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                You can audit any custom startup or ticker by entering it below.
              </p>
            </div>
          )}
        </div>

        {/* Custom Company / Startup Search Box */}
        <div className="p-4 sm:p-5 border-t border-neutral-800 bg-[#131318]">
          <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Or enter ANY custom startup or company (e.g. Groq, Cursor, Harvey, Helsing, Mistral)..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full bg-[#18181f] border border-neutral-700 px-3.5 py-2 text-xs font-mono text-white placeholder-neutral-500 rounded-md focus:outline-none focus:border-yellow-400 uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="w-full sm:w-auto px-4 py-2 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-md cursor-pointer flex items-center justify-center gap-2 shrink-0 transition-colors shadow-sm"
            >
              <span>AUDIT CUSTOM ASSET</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
