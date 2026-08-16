import React from 'react';
import { AgentRole, OrchestrationState } from '../types';
import { AGENT_ROSTER } from '../data/agents';
import { ArrowUpRight, Award } from 'lucide-react';

interface AgentCardGridProps {
  state: OrchestrationState;
  onSelectAgent: (agentId: AgentRole) => void;
}

export const AgentCardGrid: React.FC<AgentCardGridProps> = ({ state, onSelectAgent }) => {
  const agents = Object.values(AGENT_ROSTER);

  return (
    <div className="bg-[#0e0e11]/90 backdrop-blur-xs border border-neutral-800 rounded-lg p-4 sm:p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-yellow-400 rounded-xs"></div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
              11 Specialized Committee Desks
            </h3>
            <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
              Domain specialist personas, Wall Street pedigrees, and departmental mandates
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 11 Agents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {agents.map((agent) => {
          const agentState = state.agentStates[agent.id] || { status: 'idle', progress: 0 };
          const isCompleted = agentState.status === 'completed';
          const isThinking = agentState.status === 'thinking';

          return (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className="bg-[#121216] hover:bg-[#16161e] border border-neutral-800 hover:border-yellow-400/70 rounded-md p-3.5 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-md"
            >
              <div>
                {/* Agent Photo & Header */}
                <div className="flex items-start gap-3 mb-2.5 pb-2.5 border-b border-neutral-800/80">
                  <div className="relative shrink-0">
                    <img
                      src={agent.avatarUrl}
                      alt={agent.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-md object-cover border border-neutral-700 group-hover:border-yellow-400/60 transition-colors"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#121216] ${
                        isCompleted
                          ? 'bg-emerald-400'
                          : isThinking
                          ? 'bg-yellow-400 animate-ping'
                          : 'bg-neutral-600'
                      }`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[9px] font-mono font-bold bg-neutral-900 text-yellow-400 border border-neutral-700 px-1 py-0.2 rounded-xs uppercase">
                        PHASE 0{agent.phase}
                      </span>
                      {isCompleted ? (
                        <span className="text-[9px] font-mono font-bold text-emerald-400">DONE</span>
                      ) : isThinking ? (
                        <span className="text-[9px] font-mono font-bold text-yellow-400 animate-pulse">ACTIVE</span>
                      ) : (
                        <span className="text-[9px] font-mono text-neutral-400">STANDBY</span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-yellow-400 transition-colors truncate font-sans">
                      {agent.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 truncate">
                      {agent.department}
                    </p>
                  </div>
                </div>

                {/* Role Title */}
                <p className="text-[11px] font-mono font-semibold text-neutral-200 mb-1 line-clamp-1">
                  {agent.roleTitle}
                </p>

                {/* Specialty Pill */}
                <div className="flex items-center gap-1 text-[9px] font-mono text-yellow-400/90 bg-yellow-400/5 border border-yellow-400/20 px-1.5 py-0.5 rounded-xs mb-2">
                  <Award className="w-2.5 h-2.5 shrink-0 text-yellow-400" />
                  <span className="truncate">{agent.specialtyBadge}</span>
                </div>

                {/* Experience */}
                <p className="text-[10px] font-mono text-neutral-400 mb-2 truncate">
                  {agent.experience}
                </p>

                {/* Description */}
                <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed mb-3 font-sans">
                  {agent.description}
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-neutral-400 group-hover:text-yellow-400 transition-colors flex items-center gap-0.5">
                  VIEW DOSSIER <ArrowUpRight className="w-3 h-3" />
                </span>
                {agentState.confidence !== undefined && (
                  <span className="font-bold text-yellow-400 tabular-nums">
                    {agentState.confidence}% CONF
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
