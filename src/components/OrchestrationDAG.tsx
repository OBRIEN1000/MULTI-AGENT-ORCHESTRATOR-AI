import React from 'react';
import { AgentRole, OrchestrationState } from '../types';
import { AGENT_ROSTER, PHASES } from '../data/agents';

interface OrchestrationDAGProps {
  state: OrchestrationState;
  onSelectAgent: (agentId: AgentRole) => void;
  selectedAgentId: AgentRole | null;
}

export const OrchestrationDAG: React.FC<OrchestrationDAGProps> = ({
  state,
  onSelectAgent,
  selectedAgentId,
}) => {
  const allAgents = Object.values(AGENT_ROSTER);

  const completedCount = allAgents.filter(
    (ag) => state.agentStates[ag.id]?.status === 'completed'
  ).length;

  return (
    <div className="bg-[#0e0e11]/90 backdrop-blur-xs border border-neutral-800 rounded-lg p-4 sm:p-5 space-y-4 shadow-sm">
      {/* Editorial Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-yellow-400 rounded-xs"></div>
          <div>
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
              Autonomous Multi-Agent DAG Pipeline
            </h2>
            <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
              Sequential context propagation and adversarial stress-testing across 5 structured phases
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-[#141418] px-2.5 py-1 border border-neutral-800 rounded-sm">
            <span className="text-neutral-400 text-[10px] uppercase">DELIBERATED:</span>
            <span className="text-yellow-400 font-bold tabular-nums">
              {completedCount}
            </span>
            <span className="text-neutral-400">/ 11 DESKS</span>
          </div>

          <span
            className={`text-[10px] font-mono font-bold uppercase px-2 py-1 border rounded-sm ${
              state.status === 'running'
                ? 'bg-yellow-400 text-black border-yellow-400'
                : state.status === 'completed'
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-700/50'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800'
            }`}
          >
            {state.status === 'running' ? '• ACTIVE RUN' : state.status === 'completed' ? '✓ PROTOCOL COMPLETE' : 'STANDBY'}
          </span>
        </div>
      </div>

      {/* 5 Phase Structured Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {PHASES.map((phase) => {
          const phaseAgents = allAgents.filter((a) => a.phase === phase.phase);
          const isPhaseActive = state.currentPhase === phase.phase && state.status === 'running';
          const isPhaseDone = phaseAgents.every(
            (a) => state.agentStates[a.id]?.status === 'completed'
          );

          return (
            <div
              key={phase.phase}
              className={`flex flex-col border rounded-md transition-all ${
                isPhaseActive
                  ? 'bg-[#14141a] border-yellow-400/90 shadow-md ring-1 ring-yellow-400/20'
                  : isPhaseDone
                  ? 'bg-[#101014] border-neutral-800'
                  : 'bg-[#0a0a0c] border-neutral-900'
              }`}
            >
              {/* Phase Header */}
              <div className="p-2.5 border-b border-neutral-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`w-4 h-4 text-[10px] font-mono font-bold flex items-center justify-center rounded-xs ${
                      isPhaseDone
                        ? 'bg-emerald-500 text-black'
                        : isPhaseActive
                        ? 'bg-yellow-400 text-black'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {isPhaseDone ? '✓' : `0${phase.phase}`}
                  </span>
                  <span className="text-[11px] font-bold text-white uppercase tracking-tight truncate font-mono">
                    {phase.title.split('&')[0]}
                  </span>
                </div>
              </div>

              {/* Agent Nodes */}
              <div className="p-2 space-y-2 flex-1">
                {phaseAgents.map((agent) => {
                  const agentState = state.agentStates[agent.id] || { status: 'idle', progress: 0 };
                  const isThinking = agentState.status === 'thinking';
                  const isCompleted = agentState.status === 'completed';
                  const isSelected = selectedAgentId === agent.id;

                  return (
                    <button
                      key={agent.id}
                      onClick={() => onSelectAgent(agent.id)}
                      className={`w-full text-left p-2 border rounded-sm transition-all cursor-pointer block ${
                        isSelected
                          ? 'bg-[#181822] border-yellow-400 text-white shadow-xs'
                          : isThinking
                          ? 'bg-yellow-950/30 border-yellow-500/80 text-yellow-300'
                          : isCompleted
                          ? 'bg-[#121216] hover:bg-[#18181e] border-neutral-800 text-neutral-200'
                          : 'bg-[#0c0c0e] hover:bg-[#121216] border-neutral-900 text-neutral-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        {/* Agent Unsplash Photo Avatar */}
                        <div className="relative shrink-0">
                          <img
                            src={agent.avatarUrl}
                            alt={agent.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-md object-cover border border-neutral-700"
                          />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-black ${
                              isCompleted
                                ? 'bg-emerald-400'
                                : isThinking
                                ? 'bg-yellow-400 animate-ping'
                                : 'bg-neutral-600'
                            }`}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-white truncate font-sans">
                              {agent.name.split('(')[0]}
                            </span>
                            {/* Status Marker */}
                            {isCompleted ? (
                              <span className="text-[8px] font-mono font-bold text-emerald-400">DONE</span>
                            ) : isThinking ? (
                              <span className="text-[8px] font-mono font-bold text-yellow-400 animate-pulse">RUN</span>
                            ) : (
                              <span className="text-[8px] font-mono text-neutral-400">WAIT</span>
                            )}
                          </div>
                          <div className="text-[10px] text-neutral-400 truncate">
                            {agent.roleTitle.split('&')[0]}
                          </div>
                        </div>
                      </div>

                      {/* Footer Badge */}
                      <div className="flex items-center justify-between text-[9px] font-mono pt-1 border-t border-neutral-800/60">
                        <span className="text-neutral-400 uppercase">{agent.department}</span>
                        {agentState.confidence !== undefined && (
                          <span className="text-yellow-400 font-bold tabular-nums">
                            {agentState.confidence}% CONF
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
