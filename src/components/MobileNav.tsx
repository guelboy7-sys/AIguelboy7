import React from 'react';
import { MessageSquare, Trophy, TableProperties, ShieldCheck, Ticket } from 'lucide-react';

interface MobileNavProps {
  activeTab: 'chat' | 'matches' | 'standings';
  setActiveTab: (tab: 'chat' | 'matches' | 'standings') => void;
  onOpenDiagnosis: () => void;
  betSlipCount?: number;
  onOpenBetSlip?: () => void;
}

export function MobileNav({
  activeTab,
  setActiveTab,
  onOpenDiagnosis,
  betSlipCount,
  onOpenBetSlip
}: MobileNavProps) {
  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0e1a]/95 backdrop-blur-lg border-t border-blue-950/80 px-1 py-1.5 flex items-center justify-around"
      aria-label="Navegação Inferior Mobile"
    >
      <button
        onClick={() => setActiveTab('chat')}
        aria-label="Abrir Chat IA (Mobile)"
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
          activeTab === 'chat'
            ? 'text-blue-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className={`p-1 rounded-lg ${activeTab === 'chat' ? 'bg-blue-600/20' : ''}`}>
          <MessageSquare className="w-5 h-5" />
        </div>
        <span className="text-[10px]">Chat IA</span>
      </button>

      <button
        onClick={() => setActiveTab('matches')}
        aria-label="Abrir Partidas (Mobile)"
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
          activeTab === 'matches'
            ? 'text-blue-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className={`p-1 rounded-lg ${activeTab === 'matches' ? 'bg-blue-600/20' : ''}`}>
          <Trophy className="w-5 h-5" />
        </div>
        <span className="text-[10px]">Partidas</span>
      </button>

      {/* Mobile Bet Slip Tab with Badge */}
      <button
        onClick={onOpenBetSlip}
        aria-label="Abrir Bilhete (Mobile)"
        className="relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-slate-400 hover:text-slate-200 transition-all"
      >
        <div className={`relative p-1 rounded-lg ${betSlipCount && betSlipCount > 0 ? 'bg-blue-600/25 text-blue-400' : ''}`}>
          <Ticket className="w-5 h-5" />
          {betSlipCount && betSlipCount > 0 ? (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-[10px] font-black text-white flex items-center justify-center border-2 border-[#0a0e1a]">
              {betSlipCount}
            </span>
          ) : null}
        </div>
        <span className="text-[10px] font-medium">Bilhete</span>
      </button>

      <button
        onClick={() => setActiveTab('standings')}
        aria-label="Abrir Tabelas (Mobile)"
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
          activeTab === 'standings'
            ? 'text-blue-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className={`p-1 rounded-lg ${activeTab === 'standings' ? 'bg-blue-600/20' : ''}`}>
          <TableProperties className="w-5 h-5" />
        </div>
        <span className="text-[10px]">Tabelas</span>
      </button>

      <button
        onClick={onOpenDiagnosis}
        aria-label="Abrir Diagnóstico (Mobile)"
        className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-slate-400 hover:text-slate-200 transition-all"
      >
        <div className="p-1 rounded-lg">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
        </div>
        <span className="text-[10px]">Status</span>
      </button>
    </nav>
  );
}
