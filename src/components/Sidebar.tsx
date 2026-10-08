import React from 'react';
import { 
  Gamepad2, 
  Workflow, 
  Bot, 
  Cpu, 
  Package, 
  ShoppingBag, 
  Flame, 
  Users, 
  ShieldCheck, 
  LineChart, 
  Sparkles,
  MapPin,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import { Agent } from '../types';
import { playSound } from '../utils/audio';
import { useTheme } from '../hooks/useTheme';

export type NavTab = 
  | 'agent-0'
  | 'performance'
  | 'factory' 
  | 'lazy-button'
  | 'flowchart'
  | 'ultron'
  | 'multichannel'
  | 'product-lab' 
  | 'storefront' 
  | 'inventory' 
  | 'marketing' 
  | 'crm' 
  | 'compliance' 
  | 'whop-analysis';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  agents: Agent[];
  unreadTicketsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  agents,
  unreadTicketsCount
}) => {
  const { theme } = useTheme();

  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string | number; color: string }[] = [
    { id: 'agent-0', label: '👑 Agent 0: Cash Gate', icon: ShieldCheck, badge: 'GATEWAY', color: 'text-amber-400' },
    { id: 'performance', label: '📈 Performance Metrics', icon: TrendingUp, badge: 'RECHARTS', color: 'text-cyan-400' },
    { id: 'lazy-button', label: '🟣 The Lazy Button', icon: Sparkles, badge: 'AUTONOMOUS', color: 'text-purple-400' },
    { id: 'factory', label: '🎮 Factory Game Floor', icon: Gamepad2, badge: 'GAME', color: 'text-emerald-400' },
    { id: 'flowchart', label: '🗺️ Agent Flow Map', icon: Workflow, badge: 'BLUEPRINT', color: 'text-cyan-400' },
    { id: 'ultron', label: '🤖 Ultron Commander', icon: Bot, badge: 'MECH', color: 'text-lime-400' },
    { id: 'multichannel', label: '💳 Stripe & Etsy Hub', icon: CreditCard, badge: 'REAL API', color: 'text-indigo-400' },
    { id: 'storefront', label: '🛒 Store & Etsy Nexus', icon: ShoppingBag, color: 'text-blue-400' },
    { id: 'product-lab', label: '💡 AI Product Forge', icon: Cpu, badge: 'AUTO', color: 'text-fuchsia-400' },
    { id: 'inventory', label: '📦 Inventory & Vault', icon: Package, color: 'text-lime-400' },
    { id: 'marketing', label: '📢 Marketing Reactor', icon: Flame, color: 'text-amber-400' },
    { id: 'crm', label: '👥 Custom CRM & Kai', icon: Users, badge: unreadTicketsCount > 0 ? unreadTicketsCount : undefined, color: 'text-red-400' },
    { id: 'compliance', label: '⚖️ Permits & Legal', icon: ShieldCheck, color: 'text-emerald-400' },
    { id: 'whop-analysis', label: '🚀 Live Launch & 5 Pillars', icon: LineChart, badge: '5 PILLARS', color: 'text-purple-400' },
  ];

  return (
    <aside 
      className="w-64 flex-shrink-0 border-r flex flex-col justify-between select-none transition-colors duration-200"
      style={{
        backgroundColor: theme.bgSurface,
        borderColor: theme.borderTheme
      }}
    >
      {/* Primary Navigation Links */}
      <div className="p-3 space-y-1">
        {/* Official Brand Domain Header Badge */}
        <div 
          onClick={() => {
            playSound('click');
            onSelectTab('storefront');
          }}
          className="mb-2 p-2.5 rounded-xl border border-cyan-500/30 bg-slate-950/80 hover:border-cyan-400 cursor-pointer transition-all group flex items-center gap-2.5 shadow-sm"
        >
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-cyan-400/50 flex-shrink-0 relative">
            <img 
              src="/assets/neon_forge_logo.jpg" 
              alt="Neon Forge" 
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] font-mono font-bold text-white group-hover:text-cyan-300 truncate">
              NEON FORGE DIGITAL
            </div>
            <div className="text-[9px] font-mono text-cyan-400 truncate">
              neonforgedigital.net
            </div>
          </div>
        </div>

        <div className="px-3 py-2 text-[10px] font-mono tracking-widest uppercase text-slate-400 flex items-center justify-between">
          <span>GAME & FACTORY VIEWS</span>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.neonLime }} />
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                playSound('click');
                onSelectTab(item.id);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono transition-all duration-200 group text-left ${
                isActive
                  ? 'text-white border font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
              style={{
                backgroundColor: isActive ? theme.bgCard : undefined,
                borderColor: isActive ? theme.neonCyan : 'transparent',
                boxShadow: isActive ? `0 0 12px ${theme.borderGlow}` : undefined
              }}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon 
                  className="w-4 h-4 transition-transform group-hover:scale-110 flex-shrink-0" 
                  style={{ color: isActive ? theme.neonCyan : undefined }} 
                />
                <span className={`tracking-wide truncate ${isActive ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              </div>

              {item.badge && (
                <span 
                  className="px-1.5 py-0.5 text-[9px] font-mono rounded font-black flex-shrink-0 border"
                  style={{
                    backgroundColor: theme.bgVoid,
                    color: item.id === 'flowchart' ? theme.neonCyan : theme.neonLime,
                    borderColor: item.id === 'flowchart' ? theme.neonCyan : theme.neonLime
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Autonomous Agents Section */}
      <div 
        className="p-3 border-t"
        style={{
          backgroundColor: theme.bgVoid,
          borderColor: theme.borderTheme
        }}
      >
        <div className="flex items-center justify-between px-3 py-1.5 mb-1.5">
          <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
            TINY ROBOTS ONLINE (8)
          </span>
          <span className="flex h-2 w-2 relative">
            <span 
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: theme.neonLime }}
            />
            <span 
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: theme.neonLime }}
            />
          </span>
        </div>

        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {agents.map((agent) => {
            const dotColor = 
              agent.neonColor === 'cyan' ? theme.neonCyan :
              agent.neonColor === 'magenta' ? theme.neonMagenta :
              agent.neonColor === 'lime' ? theme.neonLime :
              agent.neonColor === 'amber' ? theme.neonAmber :
              agent.neonColor === 'purple' ? theme.neonPurple :
              agent.neonColor === 'blue' ? theme.neonBlue :
              agent.neonColor === 'red' ? theme.neonRed : theme.neonLime;

            return (
              <div
                key={agent.id}
                onClick={() => {
                  playSound('agent');
                  onSelectTab('flowchart');
                }}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-white/10 border text-[11px] font-mono transition-colors cursor-pointer group"
                style={{
                  backgroundColor: theme.bgCard,
                  borderColor: theme.borderTheme
                }}
                title={`${agent.name} (${agent.role}): ${agent.currentTask} - Click to view in Agent Flow Map`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span 
                    className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" 
                    style={{ backgroundColor: dotColor, boxShadow: `0 0 6px ${dotColor}` }}
                  />
                  <span className="font-semibold text-slate-200 group-hover:text-cyan-300 truncate">{agent.name}</span>
                </div>
                <span className="text-[10px] flex-shrink-0" style={{ color: agent.status === 'working' ? theme.neonCyan : theme.neonLime }}>
                  {agent.status === 'working' ? 'Patrolling' : 'Active'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
