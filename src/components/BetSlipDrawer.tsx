import React, { useState } from 'react';
import { 
  BetSelection, 
  calculateTotalOdds, 
  calculatePotentialReturn 
} from '../utils/betSlip';
import { 
  Ticket, 
  X, 
  Trash2, 
  Bot, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Coins 
} from 'lucide-react';

interface BetSlipDrawerProps {
  selections: BetSelection[];
  onRemoveSelection: (id: string) => void;
  onClearAll: () => void;
  onAnalyzeBet: (stake: number) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function BetSlipDrawer({
  selections,
  onRemoveSelection,
  onClearAll,
  onAnalyzeBet,
  isOpen,
  setIsOpen
}: BetSlipDrawerProps) {
  const [stake, setStake] = useState<number>(10);

  const totalOdds = calculateTotalOdds(selections);
  const potentialReturn = calculatePotentialReturn(stake, totalOdds);

  const quickStakes = [10, 20, 50, 100];

  if (selections.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop Floating Button Trigger (Hidden on mobile to never cover inputs) */}
      {!isOpen && (
        <div className="hidden md:flex fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom duration-200">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-600/40 border border-blue-400/30 hover:scale-105 active:scale-95 transition-transform"
          >
            <div className="relative">
              <Ticket className="w-5 h-5 text-white" />
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-[10px] font-black flex items-center justify-center text-slate-900 border border-white">
                {selections.length}
              </span>
            </div>

            <div className="text-left">
              <div className="text-xs font-bold leading-none">Bilhete Esportivo</div>
              <div className="text-[11px] text-blue-200 font-mono mt-0.5">
                Odd: <strong>{totalOdds}x</strong>
              </div>
            </div>

            <div className="ml-1 pl-2 border-l border-blue-400/30 text-xs font-semibold flex items-center gap-1">
              <span>Abrir</span>
              <ChevronUp className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* MOBILE SHEET & BACKDROP (Mobile < md) */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Bottom Sheet Modal */}
          <div 
            className="relative w-full max-h-[85vh] bg-[#0b0f19] border-t-2 border-blue-500/50 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden pb-6 z-50 animate-in slide-in-from-bottom duration-300"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-betslip-title"
          >
            {/* Grab Handle */}
            <div className="w-12 h-1 rounded-full bg-slate-700 mx-auto mt-2.5 mb-1" />

            {/* Header */}
            <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="mobile-betslip-title" className="text-sm font-bold text-white flex items-center gap-1.5">
                    Bilhete de Apostas
                    <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-[10px] text-white">
                      {selections.length}
                    </span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Odd Total: <strong className="text-blue-400 font-bold">{totalOdds}x</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClearAll}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Limpar bilhete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label="Fechar bilhete"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Selections List */}
            <div className="flex-1 overflow-y-auto min-h-0 max-h-[35vh] p-3 space-y-2 scrollbar-thin">
              {selections.map((sel) => (
                <div
                  key={sel.id}
                  className="relative p-2.5 rounded-xl bg-[#0f1524] border border-slate-800 text-xs flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-[10px] text-slate-400 truncate">
                      {sel.match.homeTeam.shortName || sel.match.homeTeam.name} vs{' '}
                      {sel.match.awayTeam.shortName || sel.match.awayTeam.name}
                    </div>
                    <div className="text-[11px] font-bold text-white truncate mt-0.5">
                      {sel.pickName}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="px-2 py-0.5 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30 font-mono font-bold text-xs">
                      {sel.odd.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemoveSelection(sel.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky Action Footer */}
            <div className="px-4 pt-2.5 pb-2 border-t border-slate-800/80 bg-[#070a12] space-y-2.5">
              {/* Quick stakes */}
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  Simulado:
                </span>
                <div className="flex items-center gap-1">
                  {quickStakes.map((val) => (
                    <button
                      key={val}
                      onClick={() => setStake(val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all border ${
                        stake === val
                          ? 'bg-blue-600 text-white border-blue-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700/60'
                      }`}
                    >
                      R${val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total & Return summary */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#0f1524] border border-blue-900/40 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Retorno Simulado
                  </span>
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    R$ {potentialReturn.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Odd Acumulada
                  </span>
                  <span className="text-sm font-black text-blue-400 font-mono">
                    {totalOdds.toFixed(2)}x
                  </span>
                </div>
              </div>

              {/* Big CTA Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onAnalyzeBet(stake);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 active:scale-95 transition-transform"
              >
                <Bot className="w-4 h-4 text-white" />
                <span>Analisar Bilhete com Guelboy AI</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP FLOATING DRAWER (Desktop >= md) */}
      {isOpen && (
        <div className="hidden md:flex fixed bottom-6 right-6 z-40 w-96 max-h-[600px] flex-col bg-[#0b0f19] border border-blue-900/60 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-3.5 bg-[#070a12] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  Bilhete de Apostas
                  <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-[10px] text-white">
                    {selections.length}
                  </span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  Multiplicador: <strong className="text-blue-400">{totalOdds}x</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onClearAll}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors text-xs"
                title="Limpar bilhete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Minimizar"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Selections Scroll List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-64 scrollbar-thin">
            {selections.map((sel) => (
              <div
                key={sel.id}
                className="group relative p-2.5 rounded-xl bg-[#0f1524] border border-slate-800 hover:border-blue-500/40 transition-all text-xs"
              >
                <button
                  onClick={() => onRemoveSelection(sel.id)}
                  className="absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                  title="Remover seleção"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="pr-6">
                  <div className="text-[10px] text-slate-400 truncate font-medium">
                    {sel.match.homeTeam.shortName || sel.match.homeTeam.name} vs{' '}
                    {sel.match.awayTeam.shortName || sel.match.awayTeam.name}
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{sel.marketName}</span>
                      <span className="font-bold text-white text-xs">{sel.pickName}</span>
                    </div>

                    <span className="px-2 py-0.5 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30 font-mono font-bold text-xs">
                      {sel.odd.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stake & Return */}
          <div className="p-3.5 bg-[#070a12] border-t border-slate-800/80 space-y-3">
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  Valor Simulado:
                </span>
                <span className="font-mono text-white font-bold">R$ {stake.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {quickStakes.map((val) => (
                  <button
                    key={val}
                    onClick={() => setStake(val)}
                    className={`py-1 rounded-lg text-xs font-semibold font-mono transition-all border ${
                      stake === val
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    R${val}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0f1524] border border-blue-900/40 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  Retorno Simulado
                </span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  R$ {potentialReturn.toFixed(2)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  Odd Acumulada
                </span>
                <span className="text-sm font-black text-blue-400 font-mono">
                  {totalOdds.toFixed(2)}x
                </span>
              </div>
            </div>

            <button
              onClick={() => onAnalyzeBet(stake)}
              className="w-full relative group flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Bot className="w-4 h-4 text-white group-hover:animate-bounce" />
              <span>Analisar Bilhete com Guelboy AI</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
