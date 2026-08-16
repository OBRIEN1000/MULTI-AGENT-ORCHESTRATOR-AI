import React, { useState, useRef } from 'react';
import {
  AgentRole,
  AgentStatus,
  MarketDataSummary,
  OrchestrationState,
  AgentMessage,
} from './types';
import { AGENT_ROSTER } from './data/agents';
import { PRESET_STOCKS } from './data/presets';
import { getMockAgentOutput, getMockDebate, getMockMemo } from './data/mockFallbacks';
import { Navbar } from './components/Navbar';
import { MarketStatsBar } from './components/MarketStatsBar';
import { OrchestrationDAG } from './components/OrchestrationDAG';
import { AgentChamberFeed } from './components/AgentChamberFeed';
import { BearBullDebateView } from './components/BearBullDebateView';
import { InvestmentMemoView } from './components/InvestmentMemoView';
import { AgentCardGrid } from './components/AgentCardGrid';
import { AgentDrawer } from './components/AgentDrawer';
import { AssetSelectorModal } from './components/AssetSelectorModal';
import {
  Layers,
  MessageSquare,
  Swords,
  FileText,
  Users,
} from 'lucide-react';

const AGENT_SEQUENCE: AgentRole[] = [
  'orchestrator',
  'fundamental',
  'moat',
  'macro',
  'sentiment',
  'bear',
  'bull',
  'esg',
  'technical',
  'valuation',
  'memo_scribe',
];

const INITIAL_AGENT_STATES = (): Record<AgentRole, { status: AgentStatus; progress: number }> => {
  const res = {} as Record<AgentRole, { status: AgentStatus; progress: number }>;
  for (const key of Object.keys(AGENT_ROSTER) as AgentRole[]) {
    res[key] = { status: 'idle', progress: 0 };
  }
  return res;
};

export default function App() {
  const [ticker, setTicker] = useState<string>('NVDA');
  const [marketData, setMarketData] = useState<MarketDataSummary | null>(PRESET_STOCKS.NVDA);
  const [isLoadingMarket, setIsLoadingMarket] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'pipeline' | 'feed' | 'debate' | 'memo' | 'roster'>('pipeline');
  const [selectedAgentId, setSelectedAgentId] = useState<AgentRole | null>(null);
  const [autoStep, setAutoStep] = useState<boolean>(true);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState<boolean>(false);

  // Core Orchestration State
  const [state, setState] = useState<OrchestrationState>({
    ticker: 'NVDA',
    companyName: PRESET_STOCKS.NVDA.companyName,
    status: 'idle',
    currentPhase: 1,
    activeAgentId: null,
    agentStates: INITIAL_AGENT_STATES(),
    messages: [],
    marketData: PRESET_STOCKS.NVDA,
    debateData: null,
    finalMemo: null,
  });

  const [isDebating, setIsDebating] = useState(false);
  const [isGeneratingMemo, setIsGeneratingMemo] = useState(false);

  const isOrchestratingRef = useRef(false);
  const currentStepRef = useRef(0);

  // Handle Ticker Selection or Change
  const handleSelectTicker = async (selectedTicker: string) => {
    if (isOrchestratingRef.current) return;

    const upper = selectedTicker.toUpperCase();
    setTicker(upper);
    handleReset(upper);

    if (PRESET_STOCKS[upper]) {
      setMarketData(PRESET_STOCKS[upper]);
      setState((prev) => ({
        ...prev,
        ticker: upper,
        companyName: PRESET_STOCKS[upper].companyName,
        marketData: PRESET_STOCKS[upper],
      }));
      return;
    }

    // Otherwise fetch dynamic market info from backend
    setIsLoadingMarket(true);
    try {
      const response = await fetch('/api/market-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: upper }),
      });
      if (response.ok) {
        const data = await response.json();
        setMarketData(data);
        setState((prev) => ({
          ...prev,
          ticker: upper,
          companyName: data.companyName || upper,
          marketData: data,
        }));
      } else {
        const fallback: MarketDataSummary = {
          ticker: upper,
          companyName: `${upper} Corp`,
          currentPrice: 150.0,
          currency: 'USD',
          changePercent: 1.8,
          marketCap: '$250 Billion',
          peRatio: 32.0,
          forwardPE: 24.0,
          revenueGrowthYoY: '+18.0%',
          grossMargin: '62.0%',
          freeCashFlow: '$12.0 Billion',
          debtToEquity: '0.40',
          beta: 1.2,
          high52w: 180.0,
          low52w: 110.0,
          sector: 'Technology & Enterprise',
          industry: 'Software & Infrastructure',
          summary: `Leading market operator in enterprise software and technology infrastructure.`,
        };
        setMarketData(fallback);
        setState((prev) => ({
          ...prev,
          ticker: upper,
          companyName: fallback.companyName,
          marketData: fallback,
        }));
      }
    } catch (e) {
      console.error('Failed to load ticker data', e);
    } finally {
      setIsLoadingMarket(false);
    }
  };

  // Reset Pipeline
  const handleReset = (targetTicker = ticker) => {
    isOrchestratingRef.current = false;
    currentStepRef.current = 0;
    const currentMkt = PRESET_STOCKS[targetTicker] || marketData;
    setState({
      ticker: targetTicker,
      companyName: currentMkt?.companyName || targetTicker,
      status: 'idle',
      currentPhase: 1,
      activeAgentId: null,
      agentStates: INITIAL_AGENT_STATES(),
      messages: [],
      marketData: currentMkt,
      debateData: null,
      finalMemo: null,
    });
    setIsDebating(false);
    setIsGeneratingMemo(false);
  };

  // Run a single agent in sequence
  const runAgentStep = async (stepIndex: number, currentMessages: AgentMessage[]) => {
    if (stepIndex >= AGENT_SEQUENCE.length || !isOrchestratingRef.current) {
      setState((prev) => ({
        ...prev,
        status: 'completed',
        activeAgentId: null,
      }));
      isOrchestratingRef.current = false;
      return;
    }

    const agentId = AGENT_SEQUENCE[stepIndex];
    const agentDef = AGENT_ROSTER[agentId];

    // Set Agent to Thinking State
    setState((prev) => ({
      ...prev,
      status: 'running',
      currentPhase: agentDef.phase,
      activeAgentId: agentId,
      agentStates: {
        ...prev.agentStates,
        [agentId]: { status: 'thinking', progress: 50 },
      },
    }));

    let outputData: any = null;

    try {
      const res = await fetch('/api/orchestrate/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          agentDef,
          ticker,
          companyName: state.companyName,
          marketData,
          sharedMemory: currentMessages.slice(-4),
        }),
      });

      if (res.ok) {
        outputData = await res.json();
      }
    } catch (err) {
      console.warn(`[Agent ${agentId}] API call error, applying fallback:`, err);
    }

    if (!outputData || (!outputData.content && !outputData.thought)) {
      outputData = getMockAgentOutput(agentId, ticker, state.companyName);
    }

    const newMessage: AgentMessage = {
      id: `${agentId}-${Date.now()}`,
      agentId,
      agentName: agentDef.name,
      phase: agentDef.phase,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'finding',
      content: outputData.content || outputData.thought,
      keyMetrics: outputData.keyMetrics,
      confidenceScore: outputData.confidenceScore || 90,
    };

    const updatedMessages = [...currentMessages, newMessage];

    setState((prev) => ({
      ...prev,
      messages: updatedMessages,
      agentStates: {
        ...prev.agentStates,
        [agentId]: {
          status: 'completed',
          progress: 100,
          output: outputData.content,
          confidence: outputData.confidenceScore || 90,
        },
      },
    }));

    // Trigger Bull vs Bear Clash after Bull
    if (agentId === 'bull') {
      setIsDebating(true);
      try {
        const bearMsg = updatedMessages.find((m) => m.agentId === 'bear')?.content || '';
        const bullMsg = outputData.content || '';
        const debateRes = await fetch('/api/orchestrate/debate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticker,
            companyName: state.companyName,
            marketData,
            bearOutput: bearMsg,
            bullOutput: bullMsg,
          }),
        });

        if (debateRes.ok) {
          const deb = await debateRes.json();
          setState((prev) => ({ ...prev, debateData: deb }));
        } else {
          setState((prev) => ({ ...prev, debateData: getMockDebate(ticker, state.companyName) }));
        }
      } catch (err) {
        setState((prev) => ({ ...prev, debateData: getMockDebate(ticker, state.companyName) }));
      } finally {
        setIsDebating(false);
      }
    }

    // Trigger Final Investment Memo after memo_scribe
    if (agentId === 'memo_scribe') {
      setIsGeneratingMemo(true);
      try {
        const memoRes = await fetch('/api/orchestrate/memo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticker,
            companyName: state.companyName,
            marketData,
            allAgentOutputs: updatedMessages,
            debateData: state.debateData,
          }),
        });

        if (memoRes.ok) {
          const finalMem = await memoRes.json();
          setState((prev) => ({ ...prev, finalMemo: finalMem }));
        } else {
          setState((prev) => ({
            ...prev,
            finalMemo: getMockMemo(ticker, state.companyName, marketData?.currentPrice || 150),
          }));
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          finalMemo: getMockMemo(ticker, state.companyName, marketData?.currentPrice || 150),
        }));
      } finally {
        setIsGeneratingMemo(false);
      }
    }

    currentStepRef.current = stepIndex + 1;

    if (autoStep && isOrchestratingRef.current && stepIndex + 1 < AGENT_SEQUENCE.length) {
      setTimeout(() => {
        runAgentStep(stepIndex + 1, updatedMessages);
      }, 500);
    } else if (stepIndex + 1 >= AGENT_SEQUENCE.length) {
      setState((prev) => ({
        ...prev,
        status: 'completed',
        activeAgentId: null,
      }));
      isOrchestratingRef.current = false;
    }
  };

  // Start / Resume Orchestration
  const handleStartOrchestration = () => {
    isOrchestratingRef.current = true;
    setState((prev) => ({ ...prev, status: 'running' }));
    runAgentStep(currentStepRef.current, state.messages);
  };

  // Pause Orchestration
  const handlePauseOrchestration = () => {
    isOrchestratingRef.current = false;
    setState((prev) => ({
      ...prev,
      status: 'paused',
      activeAgentId: null,
    }));
  };

  const completedAgents = AGENT_SEQUENCE.filter((role) => state.agentStates[role]?.status === 'completed').length;
  const progressPercent = (completedAgents / AGENT_SEQUENCE.length) * 100;

  // Export Markdown Report
  const handleExportMarkdown = () => {
    if (!state.finalMemo) return;
    const memo = state.finalMemo;
    const content = `# AEGIS CAPITAL: INVESTMENT COMMITTEE DUE DILIGENCE REPORT
**Target Asset:** ${memo.companyName} (${memo.ticker})
**Date of Deliberation:** ${new Date().toLocaleDateString()}
**Rating:** ${memo.verdict} | **Conviction Index:** ${memo.convictionScore}/100
**12-Month Target Price:** ${memo.targetPrice12M} (Upside: ${memo.impliedUpside})
**Recommended Sizing:** ${memo.portfolioWeighting} | **Horizon:** ${memo.recommendedHorizon}

---

## 1. Executive Summary
${memo.executiveSummary}

## 2. Multi-Agent Pillar Scores
- Fundamentals: ${memo.consensusScoreByPillar.fundamentals}/100
- Competitive Moat: ${memo.consensusScoreByPillar.moatCompetitive}/100
- Macro Environment: ${memo.consensusScoreByPillar.macroEnvironment}/100
- Social Sentiment: ${memo.consensusScoreByPillar.socialSentiment}/100
- ESG & Governance: ${memo.consensusScoreByPillar.esgGovernance}/100
- Technical Momentum: ${memo.consensusScoreByPillar.technicalMomentum}/100
- Valuation Margin: ${memo.consensusScoreByPillar.valuationMargin}/100

## 3. Core Investment Thesis Pillars
${memo.keyPillars.map((p) => `### ${p.title} (${p.sentiment})\n${p.description}`).join('\n\n')}

## 4. Key Risk Factors & Mitigations
${memo.riskFactors.map((r) => `- **[${r.severity} Severity] ${r.risk}**\n  *Mitigation:* ${r.mitigation}`).join('\n')}

## 5. Imminent Price Catalysts
${memo.keyCatalysts.map((c, i) => `${i + 1}. ${c}`).join('\n')}

---
*${memo.disclaimer}*`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aegis_IC_Memo_${memo.ticker}_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeAgent = state.activeAgentId ? AGENT_ROSTER[state.activeAgentId] : null;

  return (
    <div className="min-h-screen text-neutral-100 flex flex-col font-sans selection:bg-yellow-400 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        currentTicker={ticker}
        isOrchestrating={state.status === 'running'}
        onSelectTicker={handleSelectTicker}
        onStartOrchestration={handleStartOrchestration}
        onPauseOrchestration={handlePauseOrchestration}
        onReset={() => handleReset()}
        autoStep={autoStep}
        setAutoStep={setAutoStep}
        progressPercent={progressPercent}
        onOpenAssetModal={() => setIsAssetModalOpen(true)}
      />

      {/* Financial Ticker Ribbon */}
      <MarketStatsBar
        marketData={marketData}
        isLoading={isLoadingMarket}
        onOpenAssetModal={() => setIsAssetModalOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 font-mono">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-md uppercase ${
                activeTab === 'pipeline'
                  ? 'bg-yellow-400 text-black shadow-xs'
                  : 'bg-[#121216]/90 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>DAG PIPELINE</span>
            </button>

            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-md uppercase ${
                activeTab === 'feed'
                  ? 'bg-yellow-400 text-black shadow-xs'
                  : 'bg-[#121216]/90 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>DELIBERATION LOGS</span>
              {state.messages.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-xs font-bold ${activeTab === 'feed' ? 'bg-black text-yellow-400' : 'bg-neutral-900 text-yellow-400 border border-neutral-700'}`}>
                  {state.messages.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('debate')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-md uppercase ${
                activeTab === 'debate'
                  ? 'bg-yellow-400 text-black shadow-xs'
                  : 'bg-[#121216]/90 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>ADVERSARIAL CLASH</span>
              {state.debateData && (
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('memo')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-md uppercase ${
                activeTab === 'memo'
                  ? 'bg-yellow-400 text-black shadow-xs'
                  : 'bg-[#121216]/90 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>FINAL IC MEMO</span>
              {state.finalMemo && (
                <span className="px-1.5 py-0.2 bg-black text-yellow-400 text-[9px] font-mono font-bold rounded-xs">
                  {state.finalMemo.verdict}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-md uppercase ${
                activeTab === 'roster'
                  ? 'bg-yellow-400 text-black shadow-xs'
                  : 'bg-[#121216]/90 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>11 DESKS ROSTER</span>
            </button>
          </div>

          {/* Active Agent Badge with Photo */}
          {activeAgent && (
            <div className="flex items-center gap-2 text-xs text-neutral-200 bg-[#121216] px-3 py-1 border border-yellow-400/50 rounded-md font-mono shadow-xs">
              <img
                src={activeAgent.avatarUrl}
                alt={activeAgent.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover border border-yellow-400"
              />
              <span className="text-yellow-400 text-[10px] uppercase font-bold">ACTIVE:</span>
              <span className="text-white font-bold uppercase truncate max-w-[160px]">
                {activeAgent.name}
              </span>
            </div>
          )}
        </div>

        {/* Tab 1: DAG Graph Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            <OrchestrationDAG
              state={state}
              onSelectAgent={(agentId) => setSelectedAgentId(agentId)}
              selectedAgentId={selectedAgentId}
            />

            {/* Quick Live Preview of Latest Finding with Agent Photo */}
            {state.messages.length > 0 && (
              <div className="bg-[#0e0e11]/90 backdrop-blur-xs border border-neutral-800 rounded-lg p-3.5 flex items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  {AGENT_ROSTER[state.messages[state.messages.length - 1].agentId]?.avatarUrl && (
                    <img
                      src={AGENT_ROSTER[state.messages[state.messages.length - 1].agentId].avatarUrl}
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-md object-cover border border-yellow-400 shrink-0"
                    />
                  )}
                  <div className="truncate text-xs">
                    <span className="text-yellow-400 font-mono text-[10px] font-bold uppercase">LATEST TESTIMONY // </span>
                    <strong className="text-white font-bold">{state.messages[state.messages.length - 1].agentName}:</strong>{' '}
                    <span className="text-neutral-300 font-sans">{state.messages[state.messages.length - 1].content.slice(0, 110)}...</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('feed')}
                  className="text-xs font-mono font-bold text-yellow-400 hover:text-yellow-300 shrink-0 cursor-pointer uppercase flex items-center gap-1 bg-[#141418] px-2.5 py-1 border border-neutral-800 rounded-sm"
                >
                  FULL LOGS &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Full Chamber Feed */}
        {activeTab === 'feed' && (
          <AgentChamberFeed
            messages={state.messages}
            onSelectAgent={(agentId) => setSelectedAgentId(agentId)}
          />
        )}

        {/* Tab 3: Bull vs. Bear Adversarial Arena */}
        {activeTab === 'debate' && (
          <BearBullDebateView
            debateData={state.debateData}
            ticker={ticker}
            companyName={state.companyName}
            isDebating={isDebating}
          />
        )}

        {/* Tab 4: Investment Committee Memorandum (with LaTeX & PDF download) */}
        {activeTab === 'memo' && (
          <InvestmentMemoView
            memo={state.finalMemo}
            isGenerating={isGeneratingMemo}
            onExportMarkdown={handleExportMarkdown}
          />
        )}

        {/* Tab 5: 11 Specialized Desks Roster */}
        {activeTab === 'roster' && (
          <AgentCardGrid
            state={state}
            onSelectAgent={(agentId) => setSelectedAgentId(agentId)}
          />
        )}
      </main>

      {/* Agent Inspector Modal / Drawer */}
      <AgentDrawer
        agentId={selectedAgentId}
        onClose={() => setSelectedAgentId(null)}
        state={state}
      />

      {/* Asset / Startup Selector Modal */}
      <AssetSelectorModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        currentTicker={ticker}
        onSelectTicker={handleSelectTicker}
      />

      {/* Clean Institutional Footer */}
      <footer className="border-t border-neutral-900 bg-[#070709]/90 py-3 text-center text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
        AEGIS CAPITAL PARTNERS // MULTI-AGENT FIDUCIARY DELIBERATION OS
      </footer>
    </div>
  );
}
