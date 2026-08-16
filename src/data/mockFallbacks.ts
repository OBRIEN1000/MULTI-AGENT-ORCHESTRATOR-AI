import { AgentRole, FinalInvestmentMemo, BearBullDebate } from '../types';

export const getMockAgentOutput = (agentId: AgentRole, ticker: string, companyName: string) => {
  switch (agentId) {
    case 'orchestrator':
      return {
        thought: `Synthesizing baseline structural parameters for ${ticker}. Establishing initial research boundaries and dispatching directives across fundamental, strategic, adversarial, and quantitative desks.`,
        content: `**Initial Directives for Due Diligence Protocol on ${ticker} (${companyName}):**\n\n1. **Core Thesis Hypothesis:** Evaluate whether the current valuation reflects durable competitive advantages or cyclical peak margin expansion.\n2. **Critical Investigation Vectors:**\n   - Scrutinize customer concentration, free cash flow conversion efficiency, and return on invested capital (ROIC).\n   - Stress-test pricing power against emerging open/competing architectures.\n   - Model geopolitical and supply chain vulnerabilities.\n3. **Execution Pipeline:** Desks 1 through 10 will deliver forensic testimonies prior to final Investment Committee voting.`,
        keyMetrics: [
          { label: 'Pipeline Mandate', value: '11 Agents Dispatched', sentiment: 'neutral' as const },
          { label: 'Scope', value: 'Comprehensive Buy-Side Due Diligence', sentiment: 'positive' as const },
        ],
        confidenceScore: 95,
      };
    case 'fundamental':
      return {
        thought: `Forensic examination of P&L statements, operating margin trajectories, working capital requirements, and balance sheet solvency.`,
        content: `**Forensic Financial Statement Audit for ${ticker}:**\n\n- **Revenue Quality & Growth:** Strong top-line compounding supported by robust gross margins (>65%). Operating leverage remains positive with sales efficiency metrics exceeding industry medians.\n- **Cash Flow Conversion:** High conversion of net income to Free Cash Flow (FCF), demonstrating minimal reliance on aggressive accounting accruals.\n- **Balance Sheet Health:** Net debt/EBITDA remains well below the prudential 1.5x threshold, providing significant liquidity cushions to withstand macro contraction cycles.`,
        keyMetrics: [
          { label: 'FCF Yield', value: '3.8%', sentiment: 'positive' as const },
          { label: 'ROIC', value: '32.4%', sentiment: 'positive' as const },
          { label: 'Net Debt/EBITDA', value: '0.2x', sentiment: 'positive' as const },
        ],
        confidenceScore: 92,
      };
    case 'moat':
      return {
        thought: `Evaluating switching costs, proprietary IP, scale economies, and distribution network effects.`,
        content: `**Competitive Moat & Pricing Power Analysis for ${ticker}:**\n\n- **Switching Costs:** High ecosystem lock-in across enterprise workflows. Migration costs for enterprise clients represent significant engineering friction and operational risk.\n- **Pricing Power:** Demonstrated capacity to maintain premium gross margins through inflationary cycles without material customer churn.\n- **Threat of Substitutes:** Low in the near-to-medium term due to substantial proprietary developer ecosystems and proprietary manufacturing scale.`,
        keyMetrics: [
          { label: 'Moat Strength', value: 'Wide / Expanding', sentiment: 'positive' as const },
          { label: 'Pricing Power', value: 'High', sentiment: 'positive' as const },
          { label: 'Switching Costs', value: 'Very High', sentiment: 'positive' as const },
        ],
        confidenceScore: 89,
      };
    case 'macro':
      return {
        thought: `Analyzing monetary policy sensitivity, currency exposure, raw material inflation, and global regulatory headwinds.`,
        content: `**Global Macroeconomic & Geopolitical Impact Assessment:**\n\n- **Monetary Policy Sensitivity:** Resilient to higher-for-longer baseline rates due to cash-rich balance sheet generating net interest income.\n- **Geopolitical & Supply Chain Risk:** Moderate exposure to specialized Asian manufacturing bottlenecks and international export control regimes.\n- **Foreign Exchange (FX):** Balanced geographic revenue distribution provides partial natural hedging against dollar fluctuations.`,
        keyMetrics: [
          { label: 'Interest Rate Sensitivity', value: 'Low', sentiment: 'positive' as const },
          { label: 'Geopolitical Risk', value: 'Moderate', sentiment: 'negative' as const },
          { label: 'FX Headwind', value: '-1.2% Impact', sentiment: 'neutral' as const },
        ],
        confidenceScore: 86,
      };
    case 'sentiment':
      return {
        thought: `Scraping alternative datasets: retail message board sentiment, insider buying/selling, Glassdoor satisfaction scores, and option positioning.`,
        content: `**Alternative Data & Market Sentiment Synthesis:**\n\n- **Retail & Developer Buzz:** Net positive sentiment across developer communities and financial forums (+74% bullish mentions).\n- **Glassdoor & Talent Retention:** High engineering satisfaction ratings (4.3/5.0), indicating strong internal culture and talent acquisition retention.\n- **Options Flow:** Institutional call buying outpaces put volume (Put/Call ratio at 0.72), reflecting constructive medium-term institutional positioning.`,
        keyMetrics: [
          { label: 'Net Sentiment', value: '+74% Bullish', sentiment: 'positive' as const },
          { label: 'Put/Call Ratio', value: '0.72 (Bullish)', sentiment: 'positive' as const },
          { label: 'Talent Retention', value: '4.3 / 5.0', sentiment: 'positive' as const },
        ],
        confidenceScore: 88,
      };
    case 'bear':
      return {
        thought: `Formulating worst-case downside stress tests, customer concentration risks, and margin compression vectors.`,
        content: `**Chief Risk Officer (Bear Case) Downside Scrutiny:**\n\n- **Multiple Compression Risk:** Current valuation multiples price in near-flawless execution. Any guidance miss of >2% could trigger an immediate 15-20% multiple contraction.\n- **Capex Fatigue:** Major enterprise customers may moderate infrastructure capital expenditures over the next 4-6 quarters to digest existing capacity.\n- **Emerging Competition:** Open-source architectures and custom hyperscaler silicon are quietly chipping away at low-tier workloads.`,
        keyMetrics: [
          { label: 'Downside Target', value: '-22% Worst Case', sentiment: 'negative' as const },
          { label: 'Capex Cyclicality', value: 'High Risk', sentiment: 'negative' as const },
        ],
        confidenceScore: 91,
      };
    case 'bull':
      return {
        thought: `Uncovering unpriced TAM expansion, monetization inflection points, and operational leverage catalysts.`,
        content: `**Growth & Innovation Champion (Bull Case) Analysis:**\n\n- **Underestimated Total Addressable Market (TAM):** Enterprise AI monetization is only in Phase 1 (infrastructure buildout); Phase 2 (application layer software subscriptions) will unlock an additional $300B+ TAM.\n- **Product Cycle Monopoly:** Next-generation architecture cycles widen performance-per-watt lead by 2.5x over nearest competitors.\n- **Margin Expansion:** High-margin software runtime licenses and enterprise subscriptions will sustain 70%+ gross margins.`,
        keyMetrics: [
          { label: 'Upside Target', value: '+35% Bull Case', sentiment: 'positive' as const },
          { label: 'TAM Expansion', value: '+$320B', sentiment: 'positive' as const },
        ],
        confidenceScore: 90,
      };
    case 'esg':
      return {
        thought: `Auditing board governance, executive compensation alignment, carbon footprint, and regulatory compliance.`,
        content: `**Corporate Governance & ESG Compliance Audit:**\n\n- **Board Independence:** 82% independent board members with separate Chairman and CEO roles, meeting institutional best-practice governance standards.\n- **Executive Compensation Alignment:** Long-term performance share units (PSUs) are tied to relative Total Shareholder Return (TSR) and Return on Invested Capital (ROIC).\n- **Environmental & Regulatory Footprint:** Decarbonization roadmaps are on track with zero material ongoing SEC/DOJ non-compliance disclosures.`,
        keyMetrics: [
          { label: 'Governance Rating', value: 'Tier 1 (Leader)', sentiment: 'positive' as const },
          { label: 'ESG Risk Score', value: '14.2 (Low Risk)', sentiment: 'positive' as const },
        ],
        confidenceScore: 94,
      };
    case 'technical':
      return {
        thought: `Analyzing price momentum, 50/200 DMA support bands, RSI levels, and institutional accumulation volume.`,
        content: `**Quantitative & Technical Momentum Audit:**\n\n- **Moving Average Trends:** Price trades comfortably above both the 50-day ($128.40) and 200-day ($104.20) Exponential Moving Averages, confirming established primary bullish trend.\n- **Momentum Oscillators:** RSI sits at 58.4 (neutral-bullish zone, not overbought), leaving ample headroom for trend continuation.\n- **Volume & Institutional Accumulation:** On-Balance Volume (OBV) shows steady accumulation without signs of institutional distribution.`,
        keyMetrics: [
          { label: 'RSI (14)', value: '58.4 (Neutral-Bullish)', sentiment: 'positive' as const },
          { label: 'Trend Structure', value: 'Bullish Continuation', sentiment: 'positive' as const },
        ],
        confidenceScore: 89,
      };
    case 'valuation':
      return {
        thought: `Building 5-year Discounted Cash Flow (DCF) model and peer multiple valuation bands.`,
        content: `**Intrinsic DCF & Margin of Safety Valuation:**\n\n- **DCF Base Case Parameters:** 18% 5-year revenue CAGR, 9.2% WACC discount rate, 3.5% terminal growth rate.\n- **Intrinsic Fair Value Estimate:** DCF outputs a fair value of **$162.00 / share**, compared to current trading levels, implying an attractive entry margin of safety.\n- **Historical Multiple Bands:** Forward EV/EBITDA trading in the 45th historical percentile relative to projected earnings growth (PEG ratio: 1.15).`,
        keyMetrics: [
          { label: 'DCF Fair Value', value: '$162.00', sentiment: 'positive' as const },
          { label: 'WACC', value: '9.2%', sentiment: 'neutral' as const },
          { label: 'PEG Ratio', value: '1.15 (Attractive)', sentiment: 'positive' as const },
        ],
        confidenceScore: 93,
      };
    case 'memo_scribe':
      return {
        thought: `Synthesizing 10 specialized agent testimonies into the authoritative Investment Committee Memorandum.`,
        content: `**Definitive Investment Committee Consensus:**\n\nFollowing thorough cross-examination by our 10-agent panel, Aegis Capital votes to issue a **BUY** recommendation with an **88/100 Conviction Score**. Strong fundamental moats, robust cash generation, and disciplined governance outweigh cyclical multiple contraction risks.`,
        keyMetrics: [
          { label: 'Final Verdict', value: 'BUY', sentiment: 'positive' as const },
          { label: 'Conviction', value: '88 / 100', sentiment: 'positive' as const },
        ],
        confidenceScore: 96,
      };
  }
};

export const getMockDebate = (ticker: string, companyName: string): BearBullDebate => ({
  rounds: [
    {
      roundNumber: 1,
      topic: 'Valuation Multiple vs. Long-Term Growth Runway',
      bullArgument: `The market is undervaluing ${ticker}'s generational transition. Trading at forward earnings multiples that do not capture explosive high-margin software revenues represents a classic market mispricing.`,
      bearCounter: `Paying a premium multiple during a peak hardware cycle leaves zero margin of safety. If hyperscaler capex growth cools from 40% to 15%, multiple compression will wipe out multiple quarters of earnings growth.`,
      moderatorCritique: `The Bull correctly identifies structural secular demand, but the Bear's warning regarding capex deceleration risk justifies a disciplined valuation entry band.`,
    },
    {
      roundNumber: 2,
      topic: 'Competitive Moat Erosion vs. Ecosystem Lock-In',
      bullArgument: `Proprietary developer APIs, decades of software optimization, and customer switching costs create an impenetrable moat that commoditized alternatives cannot replicate.`,
      bearCounter: `Hyperscalers are actively developing internal in-house ASICs to bypass third-party margins. Over a 3-5 year horizon, merchant silicon margins must inevitably contract.`,
      moderatorCritique: `Ecosystem inertia remains decisively in ${ticker}'s favor for tier-1 workloads, though custom silicon will capture lower-complexity inference over time.`,
    },
    {
      roundNumber: 3,
      topic: 'Downside Stress Test vs. Re-Rating Catalysts',
      bullArgument: `Imminent next-generation product rollouts and international sovereign AI initiatives will drive earnings beats and upward EPS revisions throughout the coming 12-18 months.`,
      bearCounter: `Supply chain concentration and potential trade export restrictions represent an unhedged geopolitical tail risk that standard DCF models fail to discount.`,
      moderatorCritique: `Catalysts remain asymmetric to the upside, while tail risks can be effectively managed through portfolio sizing limits and stop-loss protocols.`,
    },
  ],
  verdict: `Adversarial arbitration favors the Bull thesis on competitive durability and cash generation, while adopting the Bear's risk controls on portfolio sizing (max 4.0% allocation).`,
});

export const getMockMemo = (ticker: string, companyName: string, currentPrice: number): FinalInvestmentMemo => ({
  ticker,
  companyName,
  verdict: 'BUY',
  convictionScore: 88,
  targetPrice12M: `$${(currentPrice * 1.24).toFixed(2)} (+24.0%)`,
  currentPrice: `$${currentPrice.toFixed(2)}`,
  impliedUpside: '+24.0%',
  recommendedHorizon: '12-18 Months',
  portfolioWeighting: '3.5% Core Long',
  executiveSummary: `Following exhaustive multi-agent due diligence spanning forensic financial statement audits, competitive moat benchmarking, adversarial risk interrogation, and DCF valuation modeling, the Investment Committee issues a high-conviction BUY rating on ${ticker} (${companyName}).\n\n${companyName} exhibits world-class Return on Invested Capital (ROIC > 30%), robust Free Cash Flow conversion, and an expansive developer moat that provides substantial pricing power through inflationary cycles. While near-term multiple volatility remains a valid consideration, the secular adoption trajectory and fortress balance sheet provide superior risk-adjusted return characteristics.\n\nWe recommend establishing a 3.5% core allocation, scaling opportunistically on technical retracements towards key 50-day moving average support zones.`,
  keyPillars: [
    {
      title: 'Structural Ecosystem Lock-In',
      description: 'Proprietary software runtimes and developer network effects create immense switching costs for enterprise customers.',
      sentiment: 'positive',
    },
    {
      title: 'Fortress Free Cash Flow Machine',
      description: 'Exceptional gross margins (>65%) convert into $30B+ in annualized free cash flow, supporting ongoing buybacks and R&D.',
      sentiment: 'positive',
    },
    {
      title: 'High-Integrity Corporate Governance',
      description: 'Independent board oversight with executive compensation strictly aligned to long-term ROIC and shareholder value.',
      sentiment: 'positive',
    },
    {
      title: 'Prudent Margin of Safety',
      description: 'DCF intrinsic fair value modeling suggests attractive upside potential from current market valuations.',
      sentiment: 'positive',
    },
  ],
  riskFactors: [
    {
      risk: 'Customer Concentration & Capex Cyclicality',
      severity: 'High',
      mitigation: 'Monitor quarterly capital expenditure commentary from top 5 cloud hyperscaler customers.',
    },
    {
      risk: 'Geopolitical Supply Chain Bottlenecks',
      severity: 'Medium',
      mitigation: 'Track geographic fab diversification and alternative packaging commitments.',
    },
    {
      risk: 'Valuation Multiple Volatility',
      severity: 'Medium',
      mitigation: 'Implement phased dollar-cost averaging entry strategy and dynamic stop-loss triggers.',
    },
  ],
  keyCatalysts: [
    'Next-generation product architecture commercial ramp',
    'Upcoming quarterly earnings release with revised full-year guidance',
    'Expansion of enterprise software and recurring subscription revenue mix',
    'International sovereign AI and enterprise datacenter cluster deployments',
  ],
  consensusScoreByPillar: {
    fundamentals: 92,
    moatCompetitive: 94,
    macroEnvironment: 78,
    socialSentiment: 86,
    esgGovernance: 91,
    technicalMomentum: 84,
    valuationMargin: 82,
  },
  disclaimer: 'This document constitutes an internal Investment Committee briefing prepared exclusively for fiduciary deliberation. Past performance is no guarantee of future results. All investments carry capital risk.',
});
