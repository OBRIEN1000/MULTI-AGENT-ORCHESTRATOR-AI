import React, { useState } from 'react';
import { FinalInvestmentMemo } from '../types';
import { AGENT_ROSTER } from '../data/agents';
import {
  Download,
  Copy,
  Check,
  FileText,
  Code,
  FileDown,
  Printer,
  Shield,
  Award,
} from 'lucide-react';
import { generateLatexCode, downloadLatexFile, downloadPdfReport } from '../utils/exportPdfAndLatex';

interface InvestmentMemoViewProps {
  memo: FinalInvestmentMemo | null;
  isGenerating: boolean;
  onExportMarkdown: () => void;
}

export const InvestmentMemoView: React.FC<InvestmentMemoViewProps> = ({
  memo,
  isGenerating,
  onExportMarkdown,
}) => {
  const [viewMode, setViewMode] = useState<'boardroom' | 'latex'>('boardroom');
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedLatex, setCopiedLatex] = useState(false);

  const scribeAgent = AGENT_ROSTER.memo_scribe;

  const handleCopyMd = () => {
    if (!memo) return;
    const text = `# INVESTMENT COMMITTEE MEMORANDUM: ${memo.ticker} (${memo.companyName})
Rating: ${memo.verdict} | Conviction Score: ${memo.convictionScore}/100
12M Target Price: ${memo.targetPrice12M} (Upside: ${memo.impliedUpside})
Portfolio Weighting: ${memo.portfolioWeighting} | Horizon: ${memo.recommendedHorizon}

## Executive Summary
${memo.executiveSummary}

## Key Investment Pillars
${memo.keyPillars.map((p) => `- **${p.title}** (${p.sentiment}): ${p.description}`).join('\n')}

## Risk Factors & Mitigation
${memo.riskFactors.map((r) => `- [${r.severity} Risk] ${r.risk} -> Mitigation: ${r.mitigation}`).join('\n')}

## Imminent Catalysts
${memo.keyCatalysts.map((c) => `- ${c}`).join('\n')}

---
${memo.disclaimer}`;

    navigator.clipboard.writeText(text);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleCopyLatex = () => {
    if (!memo) return;
    const latex = generateLatexCode(memo);
    navigator.clipboard.writeText(latex);
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 2000);
  };

  const handleDownloadPdf = () => {
    if (!memo) return;
    downloadPdfReport(memo);
  };

  const handleDownloadLatex = () => {
    if (!memo) return;
    downloadLatexFile(memo);
  };

  if (isGenerating) {
    return (
      <div className="bg-[#0e0e11]/90 backdrop-blur-xs border border-neutral-800 rounded-lg p-10 text-center shadow-sm">
        <div className="w-10 h-10 mx-auto bg-yellow-400 text-black flex items-center justify-center mb-3 animate-spin rounded-md shadow-xs">
          <FileText className="w-5 h-5" />
        </div>
        <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">
          Synthesizing Definitive Investment Committee Memo...
        </h3>
        <p className="text-xs text-neutral-400 max-w-md mx-auto font-sans">
          Victoria Hawthorne (Executive Scribe) is consolidating testimonies and cross-examination findings from all 11 specialized desks.
        </p>
      </div>
    );
  }

  if (!memo) {
    return (
      <div className="bg-[#0e0e11]/90 backdrop-blur-xs border border-dashed border-neutral-800 rounded-lg p-12 text-center text-neutral-500 shadow-sm">
        <FileText className="w-6 h-6 mx-auto mb-2 text-neutral-600" />
        <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
          Phase 05 Final Investment Memo Pending
        </h4>
        <p className="text-[11px] text-neutral-400 mt-1 max-w-md mx-auto font-sans">
          Run the full multi-agent protocol to generate the boardroom-grade Investment Committee Memorandum.
        </p>
      </div>
    );
  }

  const pillarScores = [
    { label: 'Fundamentals', score: memo.consensusScoreByPillar.fundamentals },
    { label: 'Competitive Moat', score: memo.consensusScoreByPillar.moatCompetitive },
    { label: 'Macro Tailwinds', score: memo.consensusScoreByPillar.macroEnvironment },
    { label: 'Market Sentiment', score: memo.consensusScoreByPillar.socialSentiment },
    { label: 'ESG & Governance', score: memo.consensusScoreByPillar.esgGovernance },
    { label: 'Technical Momentum', score: memo.consensusScoreByPillar.technicalMomentum },
    { label: 'Valuation Margin', score: memo.consensusScoreByPillar.valuationMargin },
  ];

  const latexCode = generateLatexCode(memo);

  return (
    <div className="bg-[#0e0e11]/95 backdrop-blur-xs border border-neutral-800 rounded-lg p-5 sm:p-7 space-y-6 shadow-md">
      {/* Letterhead Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-neutral-800">
        <div className="flex items-start gap-3.5">
          <img
            src={scribeAgent.avatarUrl}
            alt="Victoria Hawthorne"
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-md object-cover border border-yellow-400/50 shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 mb-1 font-mono text-[10px]">
              <span className="bg-yellow-400 text-black font-bold px-1.5 py-0.2 rounded-xs uppercase">
                OFFICIAL IC MEMORANDUM
              </span>
              <span className="text-neutral-400">•</span>
              <span className="text-neutral-400">11-DESK FIDUCIARY AUDIT</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight font-sans">
              {memo.companyName}{' '}
              <span className="text-yellow-400 font-mono font-bold ml-1">${memo.ticker}</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5 font-mono">
              Lead Scribe: Victoria Hawthorne • Managing Partner &amp; IC Chair
            </p>
          </div>
        </div>

        {/* Action buttons with PDF and LaTeX Export */}
        <div className="flex flex-wrap items-center gap-2 font-mono">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#121216] border border-neutral-800 rounded-sm p-0.5">
            <button
              onClick={() => setViewMode('boardroom')}
              className={`px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer rounded-xs flex items-center gap-1 ${
                viewMode === 'boardroom'
                  ? 'bg-yellow-400 text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>MEMO VIEW</span>
            </button>
            <button
              onClick={() => setViewMode('latex')}
              className={`px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer rounded-xs flex items-center gap-1 ${
                viewMode === 'latex'
                  ? 'bg-yellow-400 text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Code className="w-3 h-3" />
              <span>LATEX (.TEX)</span>
            </button>
          </div>

          {/* Download PDF (High Priority) */}
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold transition-colors cursor-pointer rounded-sm shadow-xs uppercase"
            title="Download Wall Street style PDF Report"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>DOWNLOAD PDF</span>
          </button>

          {/* Download LaTeX */}
          <button
            onClick={handleDownloadLatex}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141418] hover:bg-[#1a1a20] text-yellow-400 border border-yellow-400/40 text-xs font-bold transition-colors cursor-pointer rounded-sm uppercase"
            title="Download compilable LaTeX source code"
          >
            <Download className="w-3 h-3" />
            <span>.TEX FILE</span>
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMd}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#141418] hover:bg-[#1a1a20] text-neutral-300 border border-neutral-800 text-xs font-bold transition-colors cursor-pointer rounded-sm uppercase"
          >
            {copiedMd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedMd ? 'COPIED' : 'COPY MD'}</span>
          </button>
        </div>
      </div>

      {viewMode === 'latex' ? (
        /* LaTeX Source Code View */
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#121216] border border-neutral-800 p-3 rounded-md">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Formal Institutional LaTeX Source (Compliant with pdflatex / Overleaf / TeXLive)
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <button
                onClick={handleCopyLatex}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold rounded-xs cursor-pointer"
              >
                {copiedLatex ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLatex ? 'COPIED LATEX' : 'COPY LATEX'}</span>
              </button>
              <button
                onClick={handleDownloadLatex}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#18181f] text-yellow-400 border border-yellow-400/40 text-xs font-bold rounded-xs cursor-pointer hover:bg-[#20202a]"
              >
                <Download className="w-3 h-3" />
                <span>SAVE .TEX</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="bg-[#09090b] text-neutral-200 p-4 border border-neutral-800 rounded-md font-mono text-xs overflow-x-auto leading-relaxed max-h-[600px] select-all">
              <code>{latexCode}</code>
            </pre>
          </div>
        </div>
      ) : (
        /* Boardroom Executive Memo View */
        <>
          {/* Decision KPI Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#121216] border border-neutral-800 rounded-md p-3.5 shadow-xs">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                IC RECOMMENDATION
              </span>
              <div className="mt-1.5">
                <span className="text-xs font-mono font-black bg-yellow-400 text-black px-2 py-0.5 rounded-xs uppercase tracking-wide">
                  {memo.verdict}
                </span>
              </div>
            </div>

            <div className="bg-[#121216] border border-neutral-800 rounded-md p-3.5 shadow-xs">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                CONVICTION INDEX
              </span>
              <div className="flex items-baseline gap-1 mt-1 font-mono">
                <span className="text-lg font-black text-white tabular-nums">{memo.convictionScore}</span>
                <span className="text-xs text-neutral-400">/ 100</span>
              </div>
            </div>

            <div className="bg-[#121216] border border-neutral-800 rounded-md p-3.5 shadow-xs">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                12M TARGET PRICE
              </span>
              <div className="text-base font-bold font-mono text-yellow-400 mt-1 tabular-nums">
                {memo.targetPrice12M}
              </div>
            </div>

            <div className="bg-[#121216] border border-neutral-800 rounded-md p-3.5 shadow-xs">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                PORTFOLIO SIZING
              </span>
              <div className="text-xs font-bold font-mono text-white mt-1.5">
                {memo.portfolioWeighting}
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-xs"></span>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                01 // Executive Summary &amp; Deliberation Synthesis
              </h3>
            </div>
            <div className="bg-[#121216] border border-neutral-800 rounded-md p-4 shadow-xs">
              <p className="font-editorial text-sm sm:text-base text-neutral-200 leading-relaxed whitespace-pre-line">
                {memo.executiveSummary}
              </p>
            </div>
          </div>

          {/* Section 2: Multi-Agent Pillar Scorecard */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-xs"></span>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                02 // Quantitative Pillar Scorecard (100-Point Scale)
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {pillarScores.map((p, idx) => (
                <div key={idx} className="bg-[#121216] border border-neutral-800 rounded-md p-3 flex flex-col justify-between shadow-xs">
                  <span className="text-[10px] font-mono text-neutral-400 truncate uppercase">{p.label}</span>
                  <div className="flex items-baseline justify-between mt-1 font-mono">
                    <span className="text-sm font-black text-white tabular-nums">{p.score}</span>
                    <span className="text-[9px] text-neutral-400">/100</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${p.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3 & 4: Thesis Pillars & Risk Mitigation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Thesis Pillars */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-xs"></span>
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  03 // Core Investment Thesis Pillars
                </h3>
              </div>
              <div className="space-y-2">
                {memo.keyPillars.map((pillar, idx) => (
                  <div key={idx} className="bg-[#121216] border border-neutral-800 rounded-md p-3.5 space-y-1 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white uppercase font-mono">{pillar.title}</h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 rounded-xs uppercase">
                        {pillar.sentiment}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Mitigation */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-xs"></span>
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  04 // Risk Factors &amp; Committee Mitigations
                </h3>
              </div>
              <div className="space-y-2">
                {memo.riskFactors.map((r, idx) => (
                  <div key={idx} className="bg-[#121216] border border-neutral-800 rounded-md p-3.5 space-y-1 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-mono">{r.risk}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 uppercase border rounded-xs ${
                          r.severity === 'High'
                            ? 'bg-rose-950/40 text-rose-400 border-rose-800/40'
                            : 'bg-yellow-950/40 text-yellow-400 border-yellow-800/40'
                        }`}
                      >
                        {r.severity} RISK
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 font-sans">
                      <strong className="text-yellow-400 font-mono text-[10px] uppercase">Mitigation:</strong> {r.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 5: Imminent Catalysts */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-xs"></span>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                05 // Imminent Valuation Catalysts
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {memo.keyCatalysts.map((cat, idx) => (
                <div key={idx} className="bg-[#121216] border border-neutral-800 rounded-md p-3 text-xs text-neutral-200 flex items-center gap-2.5 font-mono shadow-xs">
                  <span className="w-1.5 h-1.5 bg-yellow-400 shrink-0 rounded-xs" />
                  <span>{cat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Disclaimer */}
          <div className="pt-3 border-t border-neutral-800 text-[10px] text-neutral-400 font-mono leading-relaxed">
            {memo.disclaimer}
          </div>
        </>
      )}
    </div>
  );
};
