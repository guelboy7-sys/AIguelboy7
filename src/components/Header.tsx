import { Activity, MessageSquare, Trophy, TableProperties, ShieldCheck, Sparkles, Ticket } from 'lucide-react';

interface HeaderProps {
  activeTab: 'chat' | 'matches' | 'standings';
  setActiveTab: (tab: 'chat' | 'matches' | 'standings') => void;
  onOpenDiagnosis: () => void;
  footballDataStatus?: { hasKey: boolean; status: string };
  betSlipCount?: number;
  onOpenBetSlip?: () => void;
}

export function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenDiagnosis, 
  footballDataStatus,
  betSlipCount,
  onOpenBetSlip
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-blue-950/60 bg-[#070a12]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 border border-blue-400/30 shadow-lg shadow-blue-600/30">
            <span className="text-xl select-none" role="img" aria-label="Futebol">⚽</span>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#070a12]" title="IA Operacional" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                GUELBOY <span className="text-blue-500">AI</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                <Sparkles className="w-2.5 h-2.5" />
                Gemini AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Inteligência Artificial & Estatísticas Táticas de Futebol
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-[#0c101c] rounded-xl border border-slate-800/80" aria-label="Navegação Principal">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat IA
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'matches'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Partidas & Resultados
          </button>

          <button
            onClick={() => setActiveTab('standings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'standings'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <TableProperties className="w-4 h-4" />
            Classificação
          </button>
        </nav>

        {/* Actions / Status Indicators */}
        <div className="flex items-center gap-2.5">
          {typeof betSlipCount === 'number' && betSlipCount > 0 && (
            <button
              onClick={onOpenBetSlip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all"
              title="Abrir bilhete de apostas"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Bilhete ({betSlipCount})</span>
            </button>
          )}

          <button
            onClick={onOpenDiagnosis}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#131b2e] border border-blue-900/50 text-slate-300 hover:text-white hover:border-blue-500/50 transition-colors"
            title="Abrir diagnóstico de chaves e APIs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Diagnóstico</span>
            {footballDataStatus?.hasKey ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Football-Data Conectado" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400" title="Football-Data em modo referência" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
