import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Search,
  Shield,
  Cpu,
  Sparkles,
  ChevronDown,
  Building2,
} from 'lucide-react';
import { PRESET_STOCKS } from '../data/presets';

interface NavbarProps {
  currentTicker: string;
  isOrchestrating: boolean;
  onSelectTicker: (ticker: string) => void;
  onStartOrchestration: () => void;
  onPauseOrchestration: () => void;
  onReset: () => void;
  autoStep: boolean;
  setAutoStep: (auto: boolean) => void;
  progressPercent: number;
  onOpenAssetModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTicker,
  isOrchestrating,
  onSelectTicker,
  onStartOrchestration,
  onPauseOrchestration,
  onReset,
  progressPercent,
  onOpenAssetModal,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [showQuickDropdown, setShowQuickDropdown] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelectTicker(customInput.trim().toUpperCase());
      setCustomInput('');
    }
  };

  const isCompleted = progressPercent === 100;
  const currentAsset = PRESET_STOCKS[currentTicker];
  const isStartup = currentAsset?.category === 'startup';

  const quickStartups = ['MISTRAL', 'OPENAI', 'ANTHROPIC', 'SPACEX', 'STRIPE'];
  const quickPublic = ['NVDA', 'PLTR', 'TSLA', 'MSFT'];

  return (
    <header className="bg-[#09090b]/95 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-40 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-yellow-400 to-amber-600 p-0.5 flex items-center justify-center shadow-xs">
              <div className="w-full h-full bg-[#0d0d10] rounded-[5px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-sm tracking-wider text-white font-sans uppercase">
                  AEGIS
                </span>
                <span className="text-[10px] font-mono font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.2 border border-yellow-400/30">
                  CAPITAL
                </span>
              </div>
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block mt-0.5">
                Multi-Agent Fiduciary OS
              </span>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 pl-3 border-l border-neutral-800 text-[10px] font-mono text-neutral-400">
            <Cpu className="w-3 h-3 text-yellow-400" />
            <span>11 AUTONOMOUS DESKS</span>
          </div>
        </div>

        {/* Center: Startup / Stock Selector & Modal Trigger */}
        <div className="flex items-center gap-2">
          {/* Main "Browse Assets / Startups" Button */}
          <button
            onClick={onOpenAssetModal}
            disabled={isOrchestrating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141419] hover:bg-[#1a1a22] border border-yellow-400/50 hover:border-yellow-400 text-xs font-mono font-bold text-yellow-400 rounded-md transition-colors cursor-pointer shadow-xs"
            title="Browse all AI Startups, Unicorns & Public Giants"
          >
            {isStartup ? <Sparkles className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
            <span className="font-sans font-bold text-white">
              {currentAsset?.companyName || currentTicker}
            </span>
            <span className="text-[10px] bg-yellow-400 text-black px-1.5 py-0.2 rounded-xs font-mono font-bold">
              ${currentTicker}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 ml-0.5" />
          </button>

          {/* Quick Startup Ticker Chips */}
          <div className="hidden lg:flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-amber-400 font-bold uppercase flex items-center gap-0.5 pl-2">
              <Sparkles className="w-2.5 h-2.5" /> STARTUPS:
            </span>
            <div className="flex items-center bg-[#121216] border border-neutral-800 p-0.5 rounded-sm">
              {quickStartups.map((tkr) => (
                <button
                  key={tkr}
                  onClick={() => onSelectTicker(tkr)}
                  disabled={isOrchestrating}
                  className={`px-2 py-0.5 text-[11px] font-mono font-semibold transition-colors cursor-pointer rounded-xs ${
                    currentTicker === tkr
                      ? 'bg-yellow-400 text-black font-bold shadow-xs'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  } disabled:opacity-40`}
                >
                  {tkr}
                </button>
              ))}
            </div>

            <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase pl-1">
              PUBLIC:
            </span>
            <div className="flex items-center bg-[#121216] border border-neutral-800 p-0.5 rounded-sm">
              {quickPublic.map((tkr) => (
                <button
                  key={tkr}
                  onClick={() => onSelectTicker(tkr)}
                  disabled={isOrchestrating}
                  className={`px-2 py-0.5 text-[11px] font-mono font-semibold transition-colors cursor-pointer rounded-xs ${
                    currentTicker === tkr
                      ? 'bg-yellow-400 text-black font-bold shadow-xs'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  } disabled:opacity-40`}
                >
                  {tkr}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar for ANY startup / company */}
          <form onSubmit={handleCustomSubmit} className="relative hidden md:block">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="ANY STARTUP OR TICKER..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              disabled={isOrchestrating}
              className="bg-[#121216] border border-neutral-800 pl-7 pr-2.5 py-1 text-xs font-mono text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-400 w-28 focus:w-44 transition-all disabled:opacity-40 uppercase rounded-sm"
            />
          </form>
        </div>

        {/* Right: Pipeline Controls & Action Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Progress Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            <div className="w-16 bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-neutral-400 text-[11px] w-7 text-right tabular-nums">
              {Math.round(progressPercent)}%
            </span>
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            disabled={isOrchestrating && progressPercent === 0}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer disabled:opacity-30 rounded-sm"
            title="Reset Protocol"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Primary Action Button (Yellow high-impact CTA) */}
          {isOrchestrating ? (
            <button
              onClick={onPauseOrchestration}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-yellow-400 border border-yellow-400/40 font-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer rounded-sm"
            >
              <Pause className="w-3 h-3 fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onStartOrchestration}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs rounded-sm"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isCompleted ? 'Re-Run Protocol' : progressPercent > 0 ? 'Resume' : 'Convene Committee'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
