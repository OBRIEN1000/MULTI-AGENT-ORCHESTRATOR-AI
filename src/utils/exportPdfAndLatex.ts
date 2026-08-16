import { jsPDF } from 'jspdf';
import { FinalInvestmentMemo } from '../types';

export function generateLatexCode(memo: FinalInvestmentMemo): string {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{amsmath,amssymb}
\\usepackage{booktabs}
\\usepackage{xcolor}
\\usepackage{titlesec}
\\usepackage{fancyhdr}
\\usepackage{hyperref}

\\definecolor{aegisgold}{RGB}{234, 179, 8}
\\definecolor{aegisdark}{RGB}{14, 14, 17}
\\definecolor{aegisgray}{RGB}{113, 113, 122}

\\pagestyle{fancy}
\\fancyhf{}
\\rhead{\\textcolor{aegisgray}{\\small AEGIS CAPITAL MANAGEMENT $\\cdot$ CONFIDENTIAL}}
\\lhead{\\textcolor{aegisgold}{\\textbf{INVESTMENT COMMITTEE MEMORANDUM}}}
\\rfoot{\\small Page \\thepage}

\\titleformat{\\section}{\\large\\bfseries\\color{aegisdark}}{\\thesection}{1em}{}[{\\titlerule[0.8pt]}]
\\titleformat{\\subsection}{\\normalsize\\bfseries\\color{aegisdark}}{\\thesubsection}{1em}{}

\\begin{document}

\\begin{center}
    {\\LARGE \\textbf{AEGIS CAPITAL PARTNERS}}\\\\[4pt]
    {\\large \\textbf{INSTITUTIONAL DUE DILIGENCE \\& CAPITAL ALLOCATION MEMORANDUM}}\\\\[2pt]
    \\textcolor{aegisgray}{\\small MULTI-AGENT FIDUCIARY DELIBERATION PROTOCOL $\\cdot$ ${dateStr}}
\\end{center}

\\vspace{0.8em}
\\hrule height 1.5pt
\\vspace{1em}

\\begin{table}[h!]
\\centering
\\renewcommand{\\arraystretch}{1.3}
\\begin{tabular}{ll|ll}
\\textbf{Target Asset:} & \\textbf{${memo.companyName} (${memo.ticker})} & \\textbf{Final IC Verdict:} & \\textbf{\\textcolor{aegisgold}{${memo.verdict}}} \\\\
\\textbf{Current Price:} & \\$${memo.currentPrice} & \\textbf{12M Price Target:} & ${memo.targetPrice12M} (${memo.impliedUpside}) \\\\
\\textbf{Conviction Score:} & ${memo.convictionScore} / 100 & \\textbf{Portfolio Weighting:} & ${memo.portfolioWeighting} \\\\
\\textbf{Investment Horizon:} & ${memo.recommendedHorizon} & \\textbf{Auditing Desks:} & 11 Specialized Desks \\\\
\\end{tabular}
\\end{table}

\\vspace{0.5em}
\\section{Executive Summary \\& Deliberation Synthesis}
${memo.executiveSummary.replace(/&/g, '\\&').replace(/%/g, '\\%').replace(/\$/g, '\\$')}

\\vspace{0.8em}
\\section{Multi-Agent Quantitative Pillar Scorecard}
\\begin{table}[h!]
\\centering
\\small
\\renewcommand{\\arraystretch}{1.2}
\\begin{tabular}{lcr}
\\toprule
\\textbf{Evaluation Pillar} & \\textbf{Assigned Desk} & \\textbf{Consensus Score (0--100)} \\\\
\\midrule
Forensic Fundamentals & Dr. Elena Rostova & ${memo.consensusScoreByPillar.fundamentals} / 100 \\\\
Competitive Moat \\& Pricing Power & Arthur Sterling & ${memo.consensusScoreByPillar.moatCompetitive} / 100 \\\\
Global Macro \\& Geopolitical Exposure & Siddharth Patel & ${memo.consensusScoreByPillar.macroEnvironment} / 100 \\\\
Alternative Market Sentiment & Maya Lin & ${memo.consensusScoreByPillar.socialSentiment} / 100 \\\\
ESG \\& Governance Integrity & Claire Dupont & ${memo.consensusScoreByPillar.esgGovernance} / 100 \\\\
Technical Momentum \\& Order Flow & Kenji Takahashi & ${memo.consensusScoreByPillar.technicalMomentum} / 100 \\\\
DCF Intrinsic Valuation Margin & David Goldfarb & ${memo.consensusScoreByPillar.valuationMargin} / 100 \\\\
\\bottomrule
\\end{tabular}
\\end{table}

\\vspace{0.8em}
\\section{Core Investment Thesis Pillars}
${memo.keyPillars
  .map(
    (p, i) => `\\subsection{Pillar ${i + 1}: ${p.title.replace(/&/g, '\\&')} [${p.sentiment.toUpperCase()}]}
${p.description.replace(/&/g, '\\&').replace(/%/g, '\\%').replace(/\$/g, '\\$')}`
  )
  .join('\n\n')}

\\vspace{0.8em}
\\section{Key Risk Factors \\& Committee Mitigations}
\\begin{itemize}
${memo.riskFactors
  .map(
    (r) =>
      `  \\item \\textbf{[${r.severity.toUpperCase()} RISK]} ${r.risk.replace(/&/g, '\\&').replace(/%/g, '\\%').replace(/\$/g, '\\$')} \\\\
  \\textit{Committee Mitigation:} ${r.mitigation.replace(/&/g, '\\&').replace(/%/g, '\\%').replace(/\$/g, '\\$')}`
  )
  .join('\n')}
\\end{itemize}

\\vspace{0.8em}
\\section{Imminent Price Catalysts}
\\begin{enumerate}
${memo.keyCatalysts
  .map((c) => `  \\item ${c.replace(/&/g, '\\&').replace(/%/g, '\\%').replace(/\$/g, '\\$')}`)
  .join('\n')}
\\end{enumerate}

\\vspace{1.5em}
\\hrule
\\vspace{0.5em}
\\begin{flushleft}
\\tiny\\textcolor{aegisgray}{${memo.disclaimer.replace(/&/g, '\\&').replace(/%/g, '\\%').replace(/\$/g, '\\$')}}
\\end{flushleft}

\\end{document}`;
}

export function downloadLatexFile(memo: FinalInvestmentMemo) {
  const latexContent = generateLatexCode(memo);
  const blob = new Blob([latexContent], { type: 'text/x-tex;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AEGIS_IC_MEMO_${memo.ticker}_${Date.now()}.tex`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadPdfReport(memo: FinalInvestmentMemo) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  // Header Background bar
  doc.setFillColor(14, 14, 17);
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Gold accent strip
  doc.setFillColor(250, 204, 21);
  doc.rect(0, 32, pageWidth, 1.5, 'F');

  // Header Title
  doc.setTextColor(250, 204, 21);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('AEGIS CAPITAL PARTNERS', margin, 13);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('INVESTMENT COMMITTEE MEMORANDUM & FIDUCIARY ALLOCATION REPORT', margin, 20);

  doc.setTextColor(161, 161, 170);
  doc.setFontSize(7.5);
  doc.text(`DATE: ${new Date().toLocaleDateString()}  |  CLASSIFICATION: STRICTLY CONFIDENTIAL  |  11 DESKS AUDITED`, margin, 26);

  y = 42;

  // Asset Overview Box
  doc.setFillColor(244, 244, 245);
  doc.setDrawColor(212, 212, 216);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

  doc.setTextColor(9, 9, 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`${memo.companyName} (${memo.ticker})`, margin + 5, y + 8);

  // Key KPI Badges inside overview
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Current Market Price: $${memo.currentPrice}`, margin + 5, y + 16);
  doc.text(`12M Price Target: ${memo.targetPrice12M} (${memo.impliedUpside})`, margin + 5, y + 22);
  doc.text(`Recommended Sizing: ${memo.portfolioWeighting}`, margin + 5, y + 28);

  // Verdict pill on right side of overview
  doc.setFillColor(14, 14, 17);
  doc.roundedRect(pageWidth - margin - 58, y + 5, 52, 22, 2, 2, 'F');
  doc.setTextColor(250, 204, 21);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('IC VERDICT', pageWidth - margin - 52, y + 11);
  doc.setFontSize(12);
  doc.text(memo.verdict, pageWidth - margin - 52, y + 19);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text(`CONVICTION: ${memo.convictionScore}/100`, pageWidth - margin - 52, y + 24);

  y += 40;

  // Section 1: Executive Summary
  doc.setTextColor(9, 9, 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('1. EXECUTIVE SUMMARY & DELIBERATION SYNTHESIS', margin, y);
  y += 2;
  doc.setDrawColor(250, 204, 21);
  doc.setLineWidth(0.6);
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(39, 39, 42);
  const execSummaryLines = doc.splitTextToSize(memo.executiveSummary, contentWidth);
  doc.text(execSummaryLines, margin, y);
  y += execSummaryLines.length * 4.2 + 6;

  // Section 2: Pillar Scorecard
  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  doc.setTextColor(9, 9, 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('2. MULTI-AGENT QUANTITATIVE PILLAR SCORECARD', margin, y);
  y += 2;
  doc.setDrawColor(250, 204, 21);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  const pillars = [
    { name: 'Forensic Fundamentals', score: memo.consensusScoreByPillar.fundamentals },
    { name: 'Competitive Moat & Pricing Power', score: memo.consensusScoreByPillar.moatCompetitive },
    { name: 'Global Macro & Geopolitics', score: memo.consensusScoreByPillar.macroEnvironment },
    { name: 'Alternative Sentiment & Flow', score: memo.consensusScoreByPillar.socialSentiment },
    { name: 'ESG & Corporate Governance', score: memo.consensusScoreByPillar.esgGovernance },
    { name: 'Technical Momentum & Levels', score: memo.consensusScoreByPillar.technicalMomentum },
    { name: 'DCF Margin-of-Safety', score: memo.consensusScoreByPillar.valuationMargin },
  ];

  doc.setFontSize(8);
  pillars.forEach((p) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(63, 63, 70);
    doc.text(p.name, margin, y);

    // Score bar
    doc.setFillColor(228, 228, 231);
    doc.roundedRect(margin + 80, y - 3, 50, 3.5, 1, 1, 'F');

    doc.setFillColor(234, 179, 8);
    doc.roundedRect(margin + 80, y - 3, (p.score / 100) * 50, 3.5, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(9, 9, 11);
    doc.text(`${p.score} / 100`, margin + 138, y);
    y += 6;
  });

  y += 4;

  // Section 3: Thesis Pillars
  if (y > 210) {
    doc.addPage();
    y = 20;
  }

  doc.setTextColor(9, 9, 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('3. CORE INVESTMENT THESIS PILLARS', margin, y);
  y += 2;
  doc.setDrawColor(250, 204, 21);
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  memo.keyPillars.forEach((pillar) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(9, 9, 11);
    doc.text(`• ${pillar.title} [${pillar.sentiment.toUpperCase()}]`, margin, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(63, 63, 70);
    const descLines = doc.splitTextToSize(pillar.description, contentWidth - 4);
    doc.text(descLines, margin + 4, y);
    y += descLines.length * 3.8 + 3;
  });

  // Section 4: Risk Factors & Mitigation
  if (y > 210) {
    doc.addPage();
    y = 20;
  }

  y += 3;
  doc.setTextColor(9, 9, 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('4. RISK FACTORS & COMMITTEE MITIGATIONS', margin, y);
  y += 2;
  doc.setDrawColor(250, 204, 21);
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  memo.riskFactors.forEach((risk) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(185, 28, 28);
    doc.text(`[${risk.severity.toUpperCase()} RISK] ${risk.risk}`, margin, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(63, 63, 70);
    const mitLines = doc.splitTextToSize(`Mitigation Strategy: ${risk.mitigation}`, contentWidth - 4);
    doc.text(mitLines, margin + 4, y);
    y += mitLines.length * 3.8 + 3;
  });

  // Section 5: Catalysts & Disclaimer
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  y += 3;
  doc.setTextColor(9, 9, 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('5. IMMINENT VALUATION CATALYSTS', margin, y);
  y += 2;
  doc.setDrawColor(250, 204, 21);
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  memo.keyCatalysts.forEach((cat) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(39, 39, 42);
    doc.text(`•  ${cat}`, margin + 2, y);
    y += 4.5;
  });

  y += 6;
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  doc.setDrawColor(212, 212, 216);
  doc.line(margin, y, margin + contentWidth, y);
  y += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(113, 113, 122);
  const discLines = doc.splitTextToSize(memo.disclaimer, contentWidth);
  doc.text(discLines, margin, y);

  // Save the PDF
  doc.save(`AEGIS_CAPITAL_IC_MEMO_${memo.ticker}_${Date.now()}.pdf`);
}
