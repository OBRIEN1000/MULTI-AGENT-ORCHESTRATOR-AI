import React from 'react';
import { BearBullDebate } from '../types';
import { AGENT_ROSTER } from '../data/agents';
import { TrendingDown, TrendingUp, Scale, Swords } from 'lucide-react';

interface BearBullDebateViewProps {
  debateData: BearBullDebate | null;
  ticker: string;
  companyName: string;
  isDebating: boolean;
}

export const BearBullDebateView: React.FC<BearBullDebateViewProps> = ({
  debateData,
  ticker,
  isDebating,
}) => {
  const bullAgent = AGENT_ROSTER.bull;
  const bearAgent = AGENT_ROSTER.bear;
  const cioAgent = AGENT_ROSTER.orchestrator;

  if (isDebating) {
    return (
      <div className="bg-[#0e0e11]/90 backdrop-blur-xs border border-neutral-800 rounded-lg p-10 text-center shadow-sm">
        <div className="w-10 h-10 mx-auto bg-yellow-400 text-black flex items-center justify-center mb-3 rounded-md shadow-xs">
          <Swords className="w-5 h-5" />
        </div>
        <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">
          Adversarial Chamber: Bull vs. Bear Cross-Examination in Progress
        </h3>
        <p className="text-xs text-neutral-400 max-w-md mx-auto font-sans">
          Victor Vance (Chief Risk Officer) and Chloe Thorne (Growth Bull) are cross-examining financial assumptions for ${ticker}.
        </p>
      </div>
    );
  }

  if (!debateData) {
    return (
      <div className="bg-[#0e0e11]/90 backdrop-blur-xs border border-dashed border-neutral-800 rounded-lg p-12 text-center text-neutral-500 shadow-sm">
        <Swords className="w-6 h-6 mx-auto mb-2 text-neutral-600" />
        <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
          Phase 03 Adversarial Debate Standby
        </h4>
        <p className="text-[11px] text-neutral-400 mt-1 max-w-md mx-auto font-sans">
          The Bull vs. Bear cross-examination triggers automatically once fundamental and strategic data ingestion completes.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0e0e11]/90 backdrop-blur-xs border border-neutral-800 rounded-lg p-4 sm:p-5 space-y-5 shadow-sm">
      {/* Editorial Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-yellow-400 rounded-xs"></div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
              Adversarial Thesis Cross-Examination
            </h3>
            <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
              Direct thesis clash: Downside Risk Realism vs. Unpriced Growth Potential
            </p>
          </div>
        </div>

        {/* Combatants Badges with Photos */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 px-2.5 py-1 border border-emerald-800/60 bg-emerald-950/30 text-emerald-300 text-[10px] font-bold uppercase rounded-md">
            <img
              src={bullAgent.avatarUrl}
              alt="Chloe Thorne"
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-full object-cover border border-emerald-500"
            />
            <span>CHLOE THORNE [BULL]</span>
          </div>
          <span className="text-neutral-400 text-xs font-bold font-mono">VS</span>
          <div className="flex items-center gap-2 px-2.5 py-1 border border-rose-800/60 bg-rose-950/30 text-rose-300 text-[10px] font-bold uppercase rounded-md">
            <img
              src={bearAgent.avatarUrl}
              alt="Victor Vance"
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-full object-cover border border-rose-500"
            />
            <span>VICTOR VANCE [BEAR]</span>
          </div>
        </div>
      </div>

      {/* Rounds Container */}
      <div className="space-y-4">
        {debateData.rounds.map((round) => (
          <div
            key={round.roundNumber}
            className="bg-[#121216] border border-neutral-800 rounded-md overflow-hidden shadow-xs"
          >
            {/* Round Title */}
            <div className="bg-[#16161c] px-4 py-2 border-b border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                <span className="w-4 h-4 bg-yellow-400 text-black flex items-center justify-center text-[10px] font-bold rounded-xs">
                  0{round.roundNumber}
                </span>
                ROUND {round.roundNumber}: {round.topic}
              </span>
            </div>

            {/* Clash Grid: Bull vs Bear */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-800 p-4 gap-4">
              {/* Bull Column */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  <img
                    src={bullAgent.avatarUrl}
                    alt="Bull"
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-md object-cover border border-emerald-500"
                  />
                  <span>THE BULL&apos;S THESIS</span>
                </div>
                <div className="text-xs text-neutral-200 leading-relaxed font-sans bg-[#0e0e11] p-3.5 border border-emerald-900/40 rounded-md">
                  &ldquo;{round.bullArgument}&rdquo;
                </div>
              </div>

              {/* Bear Column */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                  <img
                    src={bearAgent.avatarUrl}
                    alt="Bear"
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-md object-cover border border-rose-500"
                  />
                  <span>THE BEAR&apos;S REBUTTAL</span>
                </div>
                <div className="text-xs text-neutral-200 leading-relaxed font-sans bg-[#0e0e11] p-3.5 border border-rose-900/40 rounded-md">
                  &ldquo;{round.bearCounter}&rdquo;
                </div>
              </div>
            </div>

            {/* Moderator Synthesis */}
            <div className="bg-[#0b0b0e] px-4 py-3 border-t border-neutral-800 flex items-start gap-3 text-xs text-neutral-300">
              <img
                src={cioAgent.avatarUrl}
                alt="CIO Marcus Vance"
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-md object-cover border border-yellow-400 shrink-0 mt-0.5"
              />
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] font-bold text-yellow-400 uppercase tracking-wider">
                  CIO MARCUS VANCE SYNTHESIS:
                </span>
                <p className="text-neutral-300 text-xs font-sans italic leading-relaxed">
                  {round.moderatorCritique}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Verdict Banner */}
      <div className="p-4 bg-[#141418] border border-yellow-400/50 rounded-md flex items-start gap-3.5 shadow-sm">
        <div className="w-8 h-8 bg-yellow-400 text-black flex items-center justify-center shrink-0 text-xs font-black font-mono rounded-md shadow-xs">
          IC
        </div>
        <div>
          <div className="text-[10px] font-mono font-bold text-yellow-400 uppercase tracking-widest">
            ADVERSARIAL STRESS-TEST VERDICT
          </div>
          <p className="text-xs text-neutral-200 mt-1 font-editorial text-sm leading-relaxed">
            {debateData.verdict}
          </p>
        </div>
      </div>
    </div>
  );
};
