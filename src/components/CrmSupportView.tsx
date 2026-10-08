import React, { useState } from 'react';
import { 
  Users, 
  BotMessageSquare, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  MessageSquare, 
  UserCheck, 
  Award,
  RefreshCw
} from 'lucide-react';
import { Customer, SupportTicket } from '../types';
import { generateSupportResolution } from '../services/geminiService';
import { playSound } from '../utils/audio';

interface CrmSupportViewProps {
  customers: Customer[];
  tickets: SupportTicket[];
  apiKey: string;
  onResolveTicket: (ticketId: string, replyText: string) => void;
}

export const CrmSupportView: React.FC<CrmSupportViewProps> = ({
  customers,
  tickets,
  apiKey,
  onResolveTicket
}) => {
  const [activeTab, setActiveTab] = useState<'crm' | 'tickets'>('crm');
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [replyDraft, setReplyDraft] = useState<string>(tickets[0]?.aiDraftReply || '');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  const handleSelectTicket = (t: SupportTicket) => {
    setSelectedTicketId(t.id);
    setReplyDraft(t.aiDraftReply);
    playSound('click');
  };

  const handleRegenerateReply = async () => {
    if (!selectedTicket) return;
    setIsRegenerating(true);
    playSound('agent');
    try {
      const generated = await generateSupportResolution(
        selectedTicket.customerName,
        selectedTicket.issueType,
        selectedTicket.customerMessage,
        selectedTicket.productTitle,
        apiKey
      );
      setReplyDraft(generated);
      playSound('success');
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSendResolution = () => {
    if (!selectedTicket) return;
    onResolveTicket(selectedTicket.id, replyDraft);
    playSound('success');
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-red-400" />
            <h2 className="font-mono text-lg font-bold uppercase text-white tracking-wide">
              CUSTOM CYBER CRM & KAI SUPPORT AI
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Automated customer relationship manager tracking Lifetime Value (LTV), VIP buyer tiers, and autonomous support desk resolving buyer inquiries in under 4 minutes.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('crm');
            }}
            className={`px-3 py-1.5 rounded-md font-mono text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'crm'
                ? 'bg-red-500/20 text-red-300 border border-red-400/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-red-400" />
            <span>Buyer CRM Directory ({customers.length})</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setActiveTab('tickets');
            }}
            className={`px-3 py-1.5 rounded-md font-mono text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'tickets'
                ? 'bg-red-500/20 text-red-300 border border-red-400/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BotMessageSquare className="w-3.5 h-3.5 text-red-400" />
            <span>Kai Support Desk ({tickets.filter(t => t.status !== 'Resolved').length} Active)</span>
          </button>
        </div>
      </div>

      {activeTab === 'crm' ? (
        /* CRM Directory Table */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-red-500/30 bg-[#090d18] glow-magenta">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Tracked Buyers</span>
              <div className="text-2xl font-mono font-bold text-white mt-1">{customers.length} Accounts</div>
              <span className="text-[11px] text-emerald-400 font-mono">100% Verified Digital Purchase</span>
            </div>

            <div className="p-4 rounded-xl border border-cyan-500/30 bg-[#090d18] glow-cyan">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Average Customer LTV</span>
              <div className="text-2xl font-mono font-bold text-cyan-400 mt-1">
                ${(customers.reduce((acc, c) => acc + c.totalSpend, 0) / (customers.length || 1)).toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-300 font-mono">Repeat Order Rate: 34.2%</span>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/30 bg-[#090d18] glow-amber">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Obsidian VIP Buyers</span>
              <div className="text-2xl font-mono font-bold text-amber-400 mt-1">
                {customers.filter(c => c.vipTier === 'Obsidian VIP' || c.vipTier === 'Cyber Gold').length} Creators
              </div>
              <span className="text-[11px] text-amber-300 font-mono">Eligible for Automated Bundle Upsells</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#090d18] overflow-hidden">
            <div className="p-3 bg-slate-900/80 border-b border-slate-800 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Customer Intelligence Records</span>
              <span className="text-slate-400 font-normal">Real-Time Event Stream</span>
            </div>

            <div className="divide-y divide-slate-800">
              {customers.map((c, idx) => (
                <div key={`${c.id}-${idx}`} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <img 
                      src={c.avatar} 
                      alt={c.name}
                      className="w-10 h-10 rounded-full border border-slate-700 object-cover" 
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">{c.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          c.vipTier === 'Obsidian VIP' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' :
                          c.vipTier === 'Cyber Gold' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                          'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {c.vipTier}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">{c.email} · {c.location}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase">Total Spent</span>
                      <span className="text-emerald-400 font-bold">${c.totalSpend.toFixed(2)}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase">Orders</span>
                      <span className="text-cyan-400 font-bold">{c.ordersCount}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase">Last Activity</span>
                      <span className="text-slate-300">{c.lastOrderDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Kai Autonomous Support Inbox */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Ticket List */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-[#090d18] p-3">
            <div className="text-xs font-mono font-bold uppercase text-slate-300 px-2 py-1 mb-1">
              Active Inbound Tickets
            </div>
            {tickets.map((t, idx) => {
              const isSelected = t.id === selectedTicket?.id;
              return (
                <div
                  key={`${t.id}-${idx}`}
                  onClick={() => handleSelectTicket(t)}
                  className={`p-3 rounded-lg border text-xs font-mono cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-red-950/40 border-red-500/50 text-white glow-magenta'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white truncate max-w-[140px]">{t.customerName}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      t.status === 'Resolved' ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{t.subject}</div>
                  <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                    <span>{t.issueType}</span>
                    <span>{t.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ticket Resolution Workspace */}
          {selectedTicket && (
            <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#090d18] p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 uppercase font-bold">
                    TICKET {selectedTicket.id} · {selectedTicket.issueType}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{selectedTicket.timestamp}</span>
                </div>
                <h3 className="font-mono text-base font-bold text-white mt-1">
                  {selectedTicket.subject}
                </h3>
                <div className="text-xs text-slate-400 font-mono">
                  From: {selectedTicket.customerName} ({selectedTicket.customerEmail}) · Product: {selectedTicket.productTitle}
                </div>
              </div>

              {/* Customer message box */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200">
                <div className="text-[10px] uppercase text-slate-400 mb-1 font-bold">Customer Inquiry:</div>
                <p className="leading-relaxed">{selectedTicket.customerMessage}</p>
              </div>

              {/* Kai AI Draft Reply Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-red-400 font-bold">
                    <Sparkles className="w-4 h-4 text-red-400" />
                    <span>Kai AI Drafted Resolution:</span>
                  </div>

                  <button
                    onClick={handleRegenerateReply}
                    disabled={isRegenerating}
                    className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
                    <span>Regenerate with Gemini</span>
                  </button>
                </div>

                <textarea
                  rows={6}
                  value={replyDraft}
                  onChange={(e) => setReplyDraft(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 focus:border-red-400 rounded-lg text-xs font-mono text-slate-100 outline-none leading-relaxed"
                />
              </div>

              {/* Resolution Action Bar */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download token reset & commercial license warranty attached</span>
                </div>

                <button
                  onClick={handleSendResolution}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-fuchsia-600 hover:from-red-400 hover:to-fuchsia-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>Dispatch Resolution & Close Ticket</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
