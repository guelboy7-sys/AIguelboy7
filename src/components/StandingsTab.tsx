import React from 'react';
import { Competition, StandingPosition, SUPPORTED_COMPETITIONS } from '../utils/football';
import { RefreshCw, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface StandingsTabProps {
  competitions: Competition[];
  selectedCompetition: string;
  onSelectCompetition: (code: string) => void;
  standings: StandingPosition[];
  loading: boolean;
  dataSource: 'live' | 'fallback';
  dataReason?: string;
  onRefresh: () => void;
  onAskGuelboyAboutStandings: () => void;
}

export function StandingsTab({
  competitions,
  selectedCompetition,
  onSelectCompetition,
  standings,
  loading,
  dataSource,
  dataReason,
  onRefresh,
  onAskGuelboyAboutStandings
}: StandingsTabProps) {
  const currentComp = (competitions.length > 0 ? competitions : SUPPORTED_COMPETITIONS).find(
    (c) => c.code === selectedCompetition
  );

  const getPositionStyle = (pos: number) => {
    if (selectedCompetition === 'BSA') {
      if (pos <= 4) return 'border-l-4 border-l-blue-500 bg-blue-500/5'; // Libertadores Direta
      if (pos <= 6) return 'border-l-4 border-l-cyan-500 bg-cyan-500/5'; // Pré-Libertadores
      if (pos >= 17) return 'border-l-4 border-l-rose-500 bg-rose-500/5'; // Rebaixamento
    } else {
      if (pos <= 4) return 'border-l-4 border-l-blue-500 bg-blue-500/5'; // Champions League
      if (pos <= 6) return 'border-l-4 border-l-cyan-500 bg-cyan-500/5'; // Europa League
      if (pos >= 18) return 'border-l-4 border-l-rose-500 bg-rose-500/5'; // Rebaixamento
    }
    return '';
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 pb-20 md:pb-8 space-y-5">
      
      {/* Top Banner / Data Source Indicator */}
      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs ${
        dataSource === 'live'
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
          : 'bg-[#131b2e] border-blue-900/40 text-slate-300'
      }`}>
        <div className="flex items-center gap-2">
          {dataSource === 'live' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          )}
          <span>
            {dataSource === 'live'
              ? 'Tabela oficial sincronizada via football-data.org v4'
              : dataReason || 'Modo de referência ativo. Adicione FOOTBALL_DATA_API_KEY no servidor para dados 100% ao vivo.'}
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onAskGuelboyAboutStandings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Analisar Tabela com IA
          </button>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      {/* Competition Selector Bar */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Campeonato:
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {(competitions.length > 0 ? competitions : SUPPORTED_COMPETITIONS).map((comp) => {
            const isSelected = selectedCompetition === comp.code;
            return (
              <button
                key={comp.code}
                onClick={() => onSelectCompetition(comp.code)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                    : 'bg-[#0c101c] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span>{comp.flag}</span>
                <span>{comp.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Standings Table Container */}
      <div className="bg-[#0c101c] border border-blue-950/60 rounded-2xl shadow-xl overflow-hidden">
        
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{currentComp?.flag}</span>
              <span>Tabela de Classificação • {currentComp?.name}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pontos corridos • Atualização em tempo real
            </p>
          </div>

          {/* Legend */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Fase Principal
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              Qualificação
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Zona de Risco
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-500" />
            <p className="text-sm">Carregando classificação oficial...</p>
          </div>
        ) : standings.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="text-sm">Nenhum dado de classificação disponível para este torneio no momento.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#070a12] text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-3 w-10 text-center">Pos</th>
                  <th className="py-3 px-4 min-w-[160px]">Clube</th>
                  <th className="py-3 px-3 text-center font-bold text-slate-200">PTS</th>
                  <th className="py-3 px-3 text-center">J</th>
                  <th className="py-3 px-3 text-center">V</th>
                  <th className="py-3 px-3 text-center">E</th>
                  <th className="py-3 px-3 text-center">D</th>
                  <th className="py-3 px-3 text-center hidden sm:table-cell">GP</th>
                  <th className="py-3 px-3 text-center hidden sm:table-cell">GC</th>
                  <th className="py-3 px-3 text-center font-semibold text-slate-300">SG</th>
                  <th className="py-3 px-4 text-center hidden md:table-cell">Últimos Jogos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {standings.map((row) => (
                  <tr
                    key={row.position}
                    className={`hover:bg-blue-900/10 transition-colors ${getPositionStyle(row.position)}`}
                  >
                    <td className="py-3 px-3 text-center font-bold text-slate-300">
                      {row.position}º
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-800/80 p-0.5">
                          {row.team.crest ? (
                            <img
                              src={row.team.crest}
                              alt={row.team.name}
                              className="w-4 h-4 object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-[10px]">⚽</span>
                          )}
                        </div>
                        <span className="text-slate-100 font-bold truncate">
                          {row.team.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-black text-sm text-blue-400">
                      {row.points}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-300">{row.playedGames}</td>
                    <td className="py-3 px-3 text-center text-slate-300">{row.won}</td>
                    <td className="py-3 px-3 text-center text-slate-300">{row.draw}</td>
                    <td className="py-3 px-3 text-center text-slate-300">{row.lost}</td>
                    <td className="py-3 px-3 text-center text-slate-400 hidden sm:table-cell">{row.goalsFor}</td>
                    <td className="py-3 px-3 text-center text-slate-400 hidden sm:table-cell">{row.goalsAgainst}</td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-200">
                      {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                    </td>
                    <td className="py-3 px-4 text-center hidden md:table-cell">
                      {row.form ? (
                        <div className="flex items-center justify-center gap-1">
                          {row.form.split(',').map((letter, i) => {
                            const trimmed = letter.trim().toUpperCase();
                            const isWin = trimmed === 'V' || trimmed === 'W';
                            const isDraw = trimmed === 'E' || trimmed === 'D';
                            const isLoss = trimmed === 'L' || (trimmed === 'D' && letter === 'L');
                            
                            let bg = 'bg-slate-700 text-slate-300';
                            if (isWin) bg = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
                            else if (trimmed === 'E') bg = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
                            else bg = 'bg-rose-500/20 text-rose-400 border border-rose-500/30';

                            return (
                              <span
                                key={i}
                                className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${bg}`}
                                title={trimmed}
                              >
                                {trimmed}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
