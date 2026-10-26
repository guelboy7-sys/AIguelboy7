import React from 'react';
import { X, Bot, ShieldAlert, Sparkles, TrendingUp, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { renderFormattedContent } from '../utils/formatMarkdown';
import { BetSelection } from '../utils/betSlip';

interface BetAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisData: {
    totalOdds: number;
    potentialReturn: number;
    impliedProbability: number;
    riskLevel: 'Baixo' | 'Moderado' | 'Alto' | 'Extremo';
    analysis: string;
    model: string;
  } | null;
  loading: boolean;
  selections: BetSelection[];
  stake: number;
  onOpenInChat: (prompt: string) => void;
}

export function BetAnalysisModal({
  isOpen,
  onClose,
  analysisData,
  loading,
  selections,
  stake,
  onOpenInChat
}: BetAnalysisModalProps) {
  if (!isOpen) return null;

  const getRiskBadge = (level?: string) => {
    switch (level) {
      case 'Baixo':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Moderado':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Alto':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Extremo':
      default:
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#0b0f19] border border-blue-600/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="analysis-modal-title"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-blue-950/80 bg-[#070a12] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="analysis-modal-title" className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                  Auditoria de Bilhete com Guelboy AI
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  Sportsbook Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Avaliação profunda de probabilidade real, armadilhas e valor esperado (EV)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Fechar auditoria"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                <Bot className="w-7 h-7 text-blue-400 absolute inset-0 m-auto" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Guelboy AI está cruzando as odds...</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Analisando retrospecto tático, xG dos times, mandos de campo e margens de risco das casas de aposta.
                </p>
              </div>
            </div>
          ) : analysisData ? (
            <>
              {/* Top Stats Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#0f1524] border border-blue-900/40">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Cotação Total
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-blue-400">
                      {analysisData.totalOdds}x
                    </span>
                    <span className="text-[10px] text-slate-500">acumulada</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0f1524] border border-blue-900/40">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Retorno Simulado
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-emerald-400">
                      R$ {analysisData.potentialReturn}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0f1524] border border-blue-900/40">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Chance Calculada
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-cyan-400">
                      {analysisData.impliedProbability}%
                    </span>
                    <span className="text-[10px] text-slate-500">estimada</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0f1524] border border-blue-900/40">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Índice de Risco
                  </span>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold border ${getRiskBadge(analysisData.riskLevel)}`}>
                    {analysisData.riskLevel}
                  </span>
                </div>
              </div>

              {/* Selections Quick Pill List */}
              <div className="p-3 rounded-xl bg-[#070a12] border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">
                  Pernas do Bilhete ({selections.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {selections.map((s, idx) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0f1524] border border-slate-700/60 text-xs"
                    >
                      <span className="font-semibold text-slate-300">
                        {idx + 1}. {s.pickName}
                      </span>
                      <span className="font-mono font-bold text-blue-400 bg-blue-950/60 px-1 rounded text-[10px]">
                        @{s.odd.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Written Deep Analysis */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1524] border border-blue-900/40 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    Parecer Especialista do Guelboy AI
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Motor: {analysisData.model}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-200">
                  {renderFormattedContent(analysisData.analysis)}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <p>Nenhuma análise disponível. Tente novamente.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 pb-6 sm:pb-4 bg-[#070a12] border-t border-blue-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400 text-center sm:text-left">
            💡 Simulação analítica sem dinheiro real • Focado em valor matemático e tática.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {analysisData && (
              <button
                onClick={() => {
                  onClose();
                  onOpenInChat(`Guelboy AI, sobre o bilhete de Odd ${analysisData.totalOdds}x que analisamos: como você ajustaria as seleções para transformar em uma aposta mais segura de valor esperado positivo?`);
                }}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all"
              >
                <span>Debater no Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
