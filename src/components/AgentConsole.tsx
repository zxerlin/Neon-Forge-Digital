import React, { useState } from 'react';
import { Terminal, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { playSound } from '../utils/audio';

interface AgentConsoleProps {
  logs: { id: string; timestamp: string; agent: string; text: string; type: 'info' | 'success' | 'warn' }[];
  onClearLogs: () => void;
}

export const AgentConsole: React.FC<AgentConsoleProps> = ({ logs, onClearLogs }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-t border-slate-800 bg-[#06080e] transition-all">
      {/* Console Bar Header */}
      <div 
        onClick={() => {
          playSound('click');
          setIsExpanded(!isExpanded);
        }}
        className="px-4 py-2 flex items-center justify-between text-xs font-mono bg-slate-950/80 cursor-pointer hover:bg-slate-900 border-b border-slate-900 select-none"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-300 uppercase tracking-wider">
            AGENT CONSOLE ({logs.length} telemetry events)
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            · 8 Autonomous Micro-Agents Online
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClearLogs();
              playSound('click');
            }}
            className="text-slate-400 hover:text-slate-200 text-[11px] flex items-center gap-1"
            title="Clear Console Stream"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <span className="text-slate-400">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </span>
        </div>
      </div>

      {/* Collapsible Console Stream Content */}
      {isExpanded && (
        <div className="p-3 max-h-36 overflow-y-auto font-mono text-[11px] space-y-1 bg-[#05070c] scrollbar-thin">
          {logs.map((log) => {
            const agentColor = 
              log.agent === 'Nova' ? 'text-cyan-400' :
              log.agent === 'Aria' ? 'text-fuchsia-400' :
              log.agent === 'Rex' ? 'text-amber-400' :
              log.agent === 'Zed' ? 'text-lime-400' :
              log.agent === 'Maya' ? 'text-purple-400' :
              log.agent === 'Sage' ? 'text-blue-400' :
              log.agent === 'Leo' ? 'text-emerald-400' : 'text-red-400';

            return (
              <div key={log.id} className="flex items-start gap-2 hover:bg-slate-900/50 px-1.5 py-0.5 rounded">
                <span className="text-slate-400 flex-shrink-0">[{log.timestamp}]</span>
                <span className={`font-bold flex-shrink-0 ${agentColor}`}>[{log.agent}]</span>
                <span className="text-slate-200">{log.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
