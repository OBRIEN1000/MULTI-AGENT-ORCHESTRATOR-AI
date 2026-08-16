import React, { useState } from 'react';
import { AgentMessage, AgentRole } from '../types';
import { AGENT_ROSTER } from '../data/agents';
import { Search, Terminal, Award } from 'lucide-react';

interface AgentChamberFeedProps {
  messages: AgentMessage[];
  onSelectAgent: (agentId: AgentRole) => void;
}

export const AgentChamberFeed: React.FC<AgentChamberFeedProps> = ({ messages, onSelectAgent }) => {
  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = messages.filter((msg) => {
    const matchesRole = filterRole === 'all' || msg.agentId === filterRole;
    const matchesSearch =
      msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.agentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="bg-[#0e0e11]/90 backdrop-blur-xs border border-neutral-800 rounded-lg p-4 sm:p-5 space-y-4 shadow-sm">
      {/* Editorial Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-yellow-400 rounded-xs"></div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
              Inter-Desk Deliberation Chamber
            </h3>
            <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
              Official forensic testimony logs, cross-examination findings, and quantitative audits
            </p>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex items-center gap-2">
          {/* Desk Filter */}
          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-[#141418] border border-neutral-800 px-2.5 py-1 text-xs font-mono text-neutral-200 focus:outline-none focus:border-yellow-400 cursor-pointer uppercase rounded-sm"
            >
              <option value="all">ALL DESKS ({messages.length})</option>
              {Object.values(AGENT_ROSTER).map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name.split('(')[0]} [{ag.department.toUpperCase()}]
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="FILTER LOGS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#141418] border border-neutral-800 pl-7 pr-2.5 py-1 text-xs font-mono text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-yellow-400 w-36 sm:w-44 uppercase rounded-sm"
            />
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
        {filteredMessages.length === 0 ? (
          <div className="py-14 text-center text-neutral-500 flex flex-col items-center justify-center border border-dashed border-neutral-800 rounded-md">
            <Terminal className="w-6 h-6 mb-2 text-neutral-600" />
            <p className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
              DELIBERATION CHAMBER STANDBY
            </p>
            <p className="text-[11px] text-neutral-400 mt-1 max-w-sm font-sans">
              Click &quot;Convene Committee&quot; in the navigation bar to initiate the multi-agent reasoning protocol.
            </p>
          </div>
        ) : (
          filteredMessages.map((msg, index) => {
            const agent = AGENT_ROSTER[msg.agentId];
            return (
              <div
                key={msg.id}
                className="bg-[#121216] border border-neutral-800 rounded-md p-4 transition-colors relative shadow-xs"
              >
                {/* Accent line on latest item */}
                {index === filteredMessages.length - 1 && (
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-yellow-400 rounded-l-md" />
                )}

                {/* Agent Header */}
                <div className="flex items-center justify-between gap-3 mb-2.5 pb-2.5 border-b border-neutral-800/70">
                  <div
                    onClick={() => onSelectAgent(msg.agentId)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    {agent?.avatarUrl && (
                      <img
                        src={agent.avatarUrl}
                        alt={msg.agentName}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-md object-cover border border-neutral-700 group-hover:border-yellow-400 transition-colors shrink-0"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-bold bg-neutral-900 text-yellow-400 border border-neutral-700 px-1.5 py-0.2 rounded-xs uppercase">
                          P{msg.phase} // {agent?.department}
                        </span>
                        <span className="text-xs font-bold text-white group-hover:text-yellow-400 transition-colors font-sans">
                          {msg.agentName}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                        {agent?.roleTitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    {msg.confidenceScore !== undefined && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-yellow-400 tabular-nums rounded-xs">
                        CONF: {msg.confidenceScore}%
                      </span>
                    )}
                    <span className="text-[10px] text-neutral-400">{msg.timestamp}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line font-sans pl-1">
                  {msg.content}
                </div>

                {/* Key Metrics Chips */}
                {msg.keyMetrics && msg.keyMetrics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-neutral-800/80 mt-3 pl-1">
                    {msg.keyMetrics.map((met, idx) => (
                      <div
                        key={idx}
                        className={`text-[10px] font-mono px-2 py-0.5 border rounded-xs ${
                          met.sentiment === 'positive'
                            ? 'bg-emerald-950/20 text-emerald-400 border-emerald-800/40'
                            : met.sentiment === 'negative'
                            ? 'bg-rose-950/20 text-rose-400 border-rose-800/40'
                            : 'bg-[#18181e] text-neutral-300 border-neutral-800'
                        }`}
                      >
                        <span className="text-neutral-400 uppercase">{met.label}:</span>{' '}
                        <span className="font-bold">{met.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
