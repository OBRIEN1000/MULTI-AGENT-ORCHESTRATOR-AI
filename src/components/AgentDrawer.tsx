import React from 'react';
import { AgentRole, OrchestrationState } from '../types';
import { AGENT_ROSTER } from '../data/agents';
import { X, ArrowRight, Award } from 'lucide-react';

interface AgentDrawerProps {
  agentId: AgentRole | null;
  onClose: () => void;
  state: OrchestrationState;
  onRunSingleAgent?: (agentId: AgentRole) => void;
}

export const AgentDrawer: React.FC<AgentDrawerProps> = ({
  agentId,
  onClose,
  state,
}) => {
  if (!agentId) return null;

  const agent = AGENT_ROSTER[agentId];
  if (!agent) return null;

  const agentState = state.agentStates[agentId] || { status: 'idle', progress: 0 };
  const agentMessages = state.messages.filter((m) => m.agentId === agentId);
  const latestMessage = agentMessages[agentMessages.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0e0e11] border-l border-neutral-800 h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between text-neutral-100">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800">
            <div className="flex items-start gap-3.5">
              <img
                src={agent.avatarUrl}
                alt={agent.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-md object-cover border border-yellow-400/40 shadow-xs shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold bg-yellow-400 text-black px-1.5 py-0.2 rounded-xs uppercase">
                    PHASE 0{agent.phase}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">
                    [{agent.department}]
                  </span>
                </div>
                <h3 className="text-base font-bold text-white font-sans">{agent.name}</h3>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">{agent.roleTitle}</p>
                <div className="flex items-center gap-1 text-[9px] font-mono text-yellow-400 mt-1">
                  <Award className="w-3 h-3 text-yellow-400" />
                  <span>{agent.experience}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 bg-[#141418] hover:bg-[#1a1a20] text-neutral-400 hover:text-white border border-neutral-800 rounded-sm transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Status & Confidence Grid */}
          <div className="grid grid-cols-2 gap-2.5 font-mono">
            <div className="bg-[#121216] border border-neutral-800 p-3 rounded-md">
              <span className="text-[10px] font-bold text-neutral-400 uppercase block">DESK STATUS</span>
              <div className="mt-1">
                {agentState.status === 'completed' ? (
                  <span className="text-xs font-bold text-emerald-400 uppercase">
                    ✓ DELIBERATION COMPLETE
                  </span>
                ) : agentState.status === 'thinking' ? (
                  <span className="text-xs font-bold text-yellow-400 animate-pulse uppercase">
                    • ANALYZING...
                  </span>
                ) : (
                  <span className="text-xs text-neutral-400 uppercase">
                    QUEUED / STANDBY
                  </span>
                )}
              </div>
            </div>

            <div className="bg-[#121216] border border-neutral-800 p-3 rounded-md">
              <span className="text-[10px] font-bold text-neutral-400 uppercase block">CONFIDENCE INDEX</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-base font-black text-yellow-400 tabular-nums">
                  {agentState.confidence !== undefined ? `${agentState.confidence}%` : '--'}
                </span>
              </div>
            </div>
          </div>

          {/* Specialized Mandate */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-xs"></span>
              <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                Specialized Departmental Mandate
              </h4>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed bg-[#121216] p-3 border border-neutral-800 rounded-md font-sans">
              {agent.description}
            </p>
          </div>

          {/* DAG Dependencies */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-xs"></span>
              <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                DAG Input Dependencies
              </h4>
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono">
              {agent.dependencies.length === 0 ? (
                <span className="text-xs text-neutral-400 italic">None (Root entry point)</span>
              ) : (
                agent.dependencies.map((dep) => {
                  const depAgent = AGENT_ROSTER[dep];
                  return (
                    <span
                      key={dep}
                      className="text-xs px-2 py-0.5 bg-[#121216] border border-neutral-800 text-neutral-300 flex items-center gap-1 rounded-xs"
                    >
                      <ArrowRight className="w-2.5 h-2.5 text-yellow-400" />
                      {depAgent?.name || dep}
                    </span>
                  );
                })
              )}
            </div>
          </div>

          {/* System Directive */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-xs"></span>
              <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                Autonomous System Directive Prompt
              </h4>
            </div>
            <div className="bg-[#09090b] p-3 border border-neutral-800 rounded-md font-mono text-[11px] text-neutral-400 leading-relaxed max-h-36 overflow-y-auto">
              {agent.systemPrompt}
            </div>
          </div>

          {/* Latest Forensic Findings */}
          {latestMessage && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-xs"></span>
                <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                  Latest Testimony Findings
                </h4>
              </div>
              <div className="bg-[#121216] p-3 border border-neutral-800 rounded-md text-xs text-neutral-300 leading-relaxed whitespace-pre-line font-sans">
                {latestMessage.content}
              </div>

              {latestMessage.keyMetrics && latestMessage.keyMetrics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {latestMessage.keyMetrics.map((met, idx) => (
                    <div
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 bg-[#18181e] border border-neutral-800 rounded-xs text-neutral-300"
                    >
                      <span className="text-neutral-400 uppercase">{met.label}:</span>{' '}
                      <span className="font-bold text-yellow-400">{met.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-2 mt-4 font-mono">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold uppercase cursor-pointer rounded-xs"
          >
            CLOSE AUDIT PANEL
          </button>
        </div>
      </div>
    </div>
  );
};
