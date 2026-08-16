export type AgentRole =
  | 'orchestrator'
  | 'fundamental'
  | 'moat'
  | 'macro'
  | 'sentiment'
  | 'bear'
  | 'bull'
  | 'esg'
  | 'technical'
  | 'valuation'
  | 'memo_scribe';

export type AgentStatus = 'idle' | 'queued' | 'thinking' | 'debating' | 'completed' | 'failed';

export interface AgentDefinition {
  id: AgentRole;
  name: string;
  roleTitle: string;
  department: 'Leadership' | 'Quantitative' | 'Strategy' | 'Risk & ESG' | 'Execution';
  phase: 1 | 2 | 3 | 4 | 5;
  icon: string;
  color: string;
  avatarUrl: string;
  specialtyBadge: string;
  experience: string;
  description: string;
  systemPrompt: string;
  dependencies: AgentRole[];
}

export interface AgentMessage {
  id: string;
  agentId: AgentRole;
  agentName: string;
  phase: number;
  timestamp: string;
  type: 'thought' | 'finding' | 'critique' | 'debate' | 'decision';
  content: string;
  keyMetrics?: { label: string; value: string; sentiment?: 'positive' | 'negative' | 'neutral' }[];
  confidenceScore?: number; // 0-100
}

export interface MarketDataSummary {
  ticker: string;
  companyName: string;
  currentPrice: number;
  currency: string;
  changePercent: number;
  marketCap: string;
  peRatio: number | string;
  forwardPE: number | string;
  revenueGrowthYoY: string;
  grossMargin: string;
  freeCashFlow: string;
  debtToEquity: string;
  beta: number;
  high52w: number;
  low52w: number;
  sector: string;
  industry: string;
  summary: string;
  category?: 'startup' | 'public';
  stage?: string;
  headquarters?: string;
  fundingRaised?: string;
  tagline?: string;
}

export interface BearBullDebate {
  rounds: {
    roundNumber: number;
    topic: string;
    bullArgument: string;
    bearCounter: string;
    moderatorCritique: string;
  }[];
  verdict: string;
}

export interface FinalInvestmentMemo {
  ticker: string;
  companyName: string;
  verdict: 'STRONG BUY' | 'BUY' | 'HOLD' | 'REDUCE' | 'SELL' | 'AVOID';
  convictionScore: number; // 0-100
  targetPrice12M: string;
  currentPrice: string;
  impliedUpside: string;
  recommendedHorizon: string;
  portfolioWeighting: string;
  executiveSummary: string;
  keyPillars: {
    title: string;
    description: string;
    sentiment: 'positive' | 'negative' | 'neutral';
  }[];
  riskFactors: {
    risk: string;
    severity: 'High' | 'Medium' | 'Low';
    mitigation: string;
  }[];
  keyCatalysts: string[];
  consensusScoreByPillar: {
    fundamentals: number;
    moatCompetitive: number;
    macroEnvironment: number;
    socialSentiment: number;
    esgGovernance: number;
    technicalMomentum: number;
    valuationMargin: number;
  };
  disclaimer: string;
}

export interface OrchestrationState {
  ticker: string;
  companyName: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  currentPhase: number;
  activeAgentId: AgentRole | null;
  agentStates: Record<AgentRole, {
    status: AgentStatus;
    progress: number;
    output?: string;
    confidence?: number;
    executionTimeMs?: number;
  }>;
  messages: AgentMessage[];
  marketData: MarketDataSummary | null;
  debateData: BearBullDebate | null;
  finalMemo: FinalInvestmentMemo | null;
  error?: string;
}
