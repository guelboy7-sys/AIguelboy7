import React, { useState } from 'react';
import { 
  Competition, 
  Match, 
  SUPPORTED_COMPETITIONS, 
  getStatusBadgeInfo, 
  formatMatchScore, 
  formatKickoffTime, 
  formatMatchDate 
} from '../utils/football';
import { 
  BetSelection, 
  BetMarketType, 
  calculateMatchOdds 
} from '../utils/betSlip';
import { 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Check, 
  Ticket,
  Flame,
  TrendingUp
} from 'lucide-react';

interface MatchesTabProps {
  competitions: Competition[];
  selectedCompetition: string;
  onSelectCompetition: (code: string) => void;
  matches: Match[];
  loading: boolean;
  dataSource: 'live' | 'fallback';
  dataReason?: string;
  onRefresh: () => void;
  onAskGuelboyAboutMatch: (match: Match) => void;
  betSelections: BetSelection[];
  onToggleBetSelection: (selection: BetSelection) => void;
  onOpenBetSlip: () => void;
}

export function MatchesTab({
  competitions,
  selectedCompetition,
  onSelectCompetition,
  matches,
  loading,
  dataSource,
  dataReason,
  onRefresh,
  onAskGuelboyAboutMatch,
  betSelections,
  onToggleBetSelection,
  onOpenBetSlip
}: MatchesTabProps) {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIVE' | 'FINISHED' | 'SCHEDULED'>('ALL');
  const [activeMarket, setActiveMarket] = useState<BetMarketType>('1X2');

  const filteredMatches = matches.filter((m) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'LIVE') return m.status === 'IN_PLAY' || m.status === 'LIVE' || m.status === 'PAUSED';
    if (statusFilter === 'FINISHED') return m.status === 'FINISHED';
    if (statusFilter === 'SCHEDULED') return m.status === 'SCHEDULED' || m.status === 'TIMED';
    return true;
  });

  const currentComp = (competitions.length > 0 ? competitions : SUPPORTED_COMPETITIONS).find(
    (c) => c.code === selectedCompetition
  );

  const isSelected = (selectionId: string) => {
    return betSelections.some((s) => s.id === selectionId);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 pb-28 md:pb-12 space-y-5">
      
      {/* Top Banner / Live Data & Sportsbook Mode Indicator */}
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
              ? 'Odds e partidas sincronizadas em tempo real com football-data.org v4'
              : dataReason || 'Modo de referência ativo. Monte seu bilhete e clique em "Analisar com IA".'}
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {betSelections.length > 0 && (
            <button
              onClick={onOpenBetSlip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-600/30"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Ver Bilhete ({betSelections.length})</span>
            </button>
          )}

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

      {/* Sportsbook Header Callout */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/80 via-[#0c1222] to-slate-900 border border-blue-800/40 p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                Sportsbook AI Hub
              </span>
              <span className="text-xs text-slate-400">• Sem dinheiro real</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Monte seu Bilhete & Descubra as Chances com a IA
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Clique nas cotações (Odds) de qualquer partida para adicionar ao seu bilhete. O <strong>Guelboy AI</strong> vai calcular a probabilidade matemática real, identificar armadilhas das casas e dar o parecer tático de cada jogo.
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-3 bg-[#070a12]/80 border border-blue-900/50 rounded-xl p-3">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Bilhete Atual</div>
              <div className="text-sm font-extrabold text-white">
                {betSelections.length} {betSelections.length === 1 ? 'Seleção' : 'Seleções'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Competition Selector Chips */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Campeonatos:
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {(competitions.length > 0 ? competitions : SUPPORTED_COMPETITIONS).map((comp) => {
            const isSelectedComp = selectedCompetition === comp.code;
            return (
              <button
                key={comp.code}
                onClick={() => onSelectCompetition(comp.code)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelectedComp
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

      {/* Sportsbook Markets Filter & Status Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        
        {/* Market Category Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setActiveMarket('1X2')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeMarket === '1X2'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                : 'bg-[#0c101c] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            1X2 (Vencedor)
          </button>

          <button
            onClick={() => setActiveMarket('BTTS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeMarket === 'BTTS'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                : 'bg-[#0c101c] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Ambas Marcam (BTTS)
          </button>

          <button
            onClick={() => setActiveMarket('OVER_UNDER_25')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeMarket === 'OVER_UNDER_25'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                : 'bg-[#0c101c] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Total de Gols (+/- 2.5)
          </button>

          <button
            onClick={() => setActiveMarket('DOUBLE_CHANCE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeMarket === 'DOUBLE_CHANCE'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                : 'bg-[#0c101c] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Dupla Hipótese
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-[#0c101c] p-1 rounded-xl border border-slate-800/80 self-start md:self-auto">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setStatusFilter('LIVE')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'LIVE' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Ao Vivo
          </button>
          <button
            onClick={() => setStatusFilter('FINISHED')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'FINISHED' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Encerrados
          </button>
          <button
            onClick={() => setStatusFilter('SCHEDULED')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'SCHEDULED' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Agendados
          </button>
        </div>

      </div>

      {/* Sportsbook Match Rows */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-3">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-500" />
          <p className="text-sm">Carregando cotações e partidas esportivas...</p>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="py-16 text-center bg-[#0c101c] border border-slate-800/80 rounded-2xl p-8 space-y-3">
          <Calendar className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="text-base font-semibold text-white">Nenhuma partida para este filtro</h3>
          <p className="text-xs text-slate-400">
            Tente mudar o campeonato ou a categoria de filtro acima.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMatches.map((match) => {
            const badge = getStatusBadgeInfo(match.status);
            const score = formatMatchScore(match.score);
            const odds = calculateMatchOdds(match);
            const dateStr = formatMatchDate(match.utcDate);
            const timeStr = formatKickoffTime(match.utcDate);

            // Selections definitions for each market
            const homeSelId = `${match.id}-1X2-HOME`;
            const drawSelId = `${match.id}-1X2-DRAW`;
            const awaySelId = `${match.id}-1X2-AWAY`;

            const bttsYesId = `${match.id}-BTTS-YES`;
            const bttsNoId = `${match.id}-BTTS-NO`;

            const over25Id = `${match.id}-OU-OVER`;
            const under25Id = `${match.id}-OU-UNDER`;

            const dh1XId = `${match.id}-DH-1X`;
            const dh12Id = `${match.id}-DH-12`;
            const dhX2Id = `${match.id}-DH-X2`;

            return (
              <div
                key={match.id}
                className="bg-[#0b0f19] hover:bg-[#0e1424] border border-blue-950/60 hover:border-blue-700/40 rounded-2xl p-3.5 sm:p-4.5 transition-all shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Match Info & Teams */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 text-xs">
                    <span className="font-semibold text-blue-400 truncate">
                      {match.competition.name}
                    </span>
                    {match.matchday && (
                      <span className="text-slate-500">• Rodada {match.matchday}</span>
                    )}
                    <span className="text-slate-500">• {dateStr} {timeStr}</span>
                    <span
                      className={`ml-auto lg:ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
                    >
                      {badge.isLive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                      {badge.label}
                    </span>
                  </div>

                  {/* Teams Scoreboard */}
                  <div className="space-y-1.5">
                    {/* Home Team */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-800 p-0.5">
                          {match.homeTeam.crest ? (
                            <img
                              src={match.homeTeam.crest}
                              alt={match.homeTeam.name}
                              className="w-4 h-4 object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-[10px]">⚽</span>
                          )}
                        </div>
                        <span className="font-bold text-sm text-white truncate">
                          {match.homeTeam.name}
                        </span>
                      </div>
                      <span className="font-black text-sm text-white px-2">
                        {score.home}
                      </span>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-800 p-0.5">
                          {match.awayTeam.crest ? (
                            <img
                              src={match.awayTeam.crest}
                              alt={match.awayTeam.name}
                              className="w-4 h-4 object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-[10px]">⚽</span>
                          )}
                        </div>
                        <span className="font-bold text-sm text-white truncate">
                          {match.awayTeam.name}
                        </span>
                      </div>
                      <span className="font-black text-sm text-white px-2">
                        {score.away}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Sportsbook Odds Betting Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  
                  {/* Odds Box depending on Active Market */}
                  <div className={`grid gap-1.5 min-w-[260px] sm:min-w-[320px] ${
                    activeMarket === 'BTTS' || activeMarket === 'OVER_UNDER_25'
                      ? 'grid-cols-2'
                      : 'grid-cols-3'
                  }`}>
                    
                    {/* 1X2 Market */}
                    {activeMarket === '1X2' && (
                      <>
                        <button
                          onClick={() =>
                            onToggleBetSelection({
                              id: homeSelId,
                              matchId: match.id,
                              match,
                              marketType: '1X2',
                              marketName: 'Resultado Final',
                              pickName: `${match.homeTeam.shortName || match.homeTeam.name} Vence`,
                              odd: odds.homeWin
                            })
                          }
                          className={`p-2 rounded-xl text-center transition-all border ${
                            isSelected(homeSelId)
                              ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/40 ring-2 ring-blue-400'
                              : 'bg-[#121829] hover:bg-blue-900/20 text-slate-300 border-slate-800 hover:border-blue-500/40'
                          }`}
                        >
                          <span className="text-[10px] text-slate-400 block font-semibold truncate">
                            {isSelected(homeSelId) ? '✓ ' : ''}1 (Casa)
                          </span>
                          <span className="text-xs font-mono font-black text-blue-400 group-hover:text-white">
                            {odds.homeWin.toFixed(2)}
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            onToggleBetSelection({
                              id: drawSelId,
                              matchId: match.id,
                              match,
                              marketType: '1X2',
                              marketName: 'Resultado Final',
                              pickName: 'Empate',
                              odd: odds.draw
                            })
                          }
                          className={`p-2 rounded-xl text-center transition-all border ${
                            isSelected(drawSelId)
                              ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/40 ring-2 ring-blue-400'
                              : 'bg-[#121829] hover:bg-blue-900/20 text-slate-300 border-slate-800 hover:border-blue-500/40'
                          }`}
                        >
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            {isSelected(drawSelId) ? '✓ ' : ''}X (Empate)
                          </span>
                          <span className="text-xs font-mono font-black text-blue-400 group-hover:text-white">
                            {odds.draw.toFixed(2)}
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            onToggleBetSelection({
                              id: awaySelId,
                              matchId: match.id,
                              match,
                              marketType: '1X2',
                              marketName: 'Resultado Final',
                              pickName: `${match.awayTeam.shortName || match.awayTeam.name} Vence`,
                              odd: odds.awayWin
                            })
                          }
                          className={`p-2 rounded-xl text-center transition-all border ${
                            isSelected(awaySelId)
                              ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/40 ring-2 ring-blue-400'
                              : 'bg-[#121829] hover:bg-blue-900/20 text-slate-300 border-slate-800 hover:border-blue-500/40'
                          }`}
                        >
                          <span className="text-[10px] text-slate-400 block font-semibold truncate">
                            {isSelected(awaySelId) ? '✓ ' : ''}2 (Fora)
                          </span>
                          <span className="text-xs font-mono font-black text-blue-400 group-hover:text-white">
                            {odds.awayWin.toFixed(2)}
                          </span>
                        </button>
                      </>
                    )}

                    {/* BTTS Market */}
                    {activeMarket === 'BTTS' && (
                      <>
                        <button
                          onClick={() =>
                            onToggleBetSelection({
                              id: bttsYesId,
                              matchId: match.id,
                              match,
                              marketType: 'BTTS',
                              marketName: 'Ambas Marcam',
                              pickName: 'Ambas Marcam: Sim',
                              odd: odds.bttsYes
                            })
                          }
                          className={`p-2 rounded-xl text-center transition-all border ${
                            isSelected(bttsYesId)
                              ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400'
                              : 'bg-[#121829] text-slate-300 border-slate-800 hover:border-blue-500/40'
                          }`}
                        >
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            {isSelected(bttsYesId) ? '✓ ' : ''}Ambas: Sim
                          </span>
                          <span className="text-xs font-mono font-black text-emerald-400">
                            {odds.bttsYes.toFixed(2)}
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            onToggleBetSelection({
                              id: bttsNoId,
                              matchId: match.id,
                              match,
                              marketType: 'BTTS',
                              marketName: 'Ambas Marcam',
                              pickName: 'Ambas Marcam: Não',
                              odd: odds.bttsNo
                            })
                          }
                          className={`p-2 rounded-xl text-center transition-all border ${
                            isSelected(bttsNoId)
                              ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400'
                              : 'bg-[#121829] text-slate-300 border-slate-800 hover:border-blue-500/40'
                          }`}
                        >
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            {isSelected(bttsNoId) ? '✓ ' : ''}Ambas: Não
                          </span>
                          <span className="text-xs font-mono font-black text-rose-400">
                            {odds.bttsNo.toFixed(2)}
                          </span>
                        </button>
                      </>
                    )}

                    {/* Over/Under 2.5 Market */}
                    {activeMarket === 'OVER_UNDER_25' && (
                      <>
                        <button
                          onClick={() =>
                            onToggleBetSelection({
                              id: over25Id,
                              matchId: match.id,
                              match,
                              marketType: 'OVER_UNDER_25',
                              marketName: 'Gols (+/- 2.5)',
                              pickName: 'Mais de 2.5 Gols',
                              odd: odds.over25
                            })
                          }
                          className={`p-2 rounded-xl text-center transition-all border ${
                            isSelected(over25Id)
                              ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400'
                              : 'bg-[#121829] text-slate-300 border-slate-800 hover:border-blue-500/40'
                          }`}
                        >
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            {isSelected(over25Id) ? '✓ ' : ''}+2.5 Gols
                          </span>
                          <span className="text-xs font-mono font-black text-cyan-400">
                            {odds.over25.toFixed(2)}
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            onToggleBetSelection({
                              id: under25Id,
                              matchId: match.id,
                              match,
                              marketType: 'OVER_UNDER_25',
                              marketName: 'Gols (+/- 2.5)',
                              pickName: 'Menos de 2.5 Gols',
                              odd: odds.under25
                            })
                          }
                          className={`p-2 rounded-xl text-center transition-all border ${
                            isSelected(under25Id)
                              ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400'
                              : 'bg-[#121829] text-slate-300 border-slate-800 hover:border-blue-500/40'
                          }`}
                        >
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            {isSelected(under25Id) ? '✓ ' : ''}-2.5 Gols
                          </span>
                          <span className="text-xs font-mono font-black text-amber-400">
                            {odds.under25.toFixed(2)}
                          </span>
                        </button>
                      </>
                    )}

                    {/* Double Chance Market */}
                    {activeMarket === 'DOUBLE_CHANCE' && (
                      <>
                        <button
                          onClick={() =>
                            onToggleBetSelection({
                              id: dh1XId,
                              matchId: match.id,
                              match,
                              marketType: 'DOUBLE_CHANCE',
                              marketName: 'Dupla Hipótese',
                              pickName: '1X (Casa ou Empate)',
                              odd: odds.doubleChance1X
                            })
                          }
                          className={`p-2 rounded-xl text-center transition-all border ${
                            isSelected(dh1XId)
                              ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400'
                              : 'bg-[#121829] text-slate-300 border-slate-800 hover:border-blue-500/40'
                          }`}
                        >
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            {isSelected(dh1XId) ? '✓ ' : ''}1X
                          </span>
                          <span className="text-xs font-mono font-black text-blue-400">
                            {odds.doubleChance1X.toFixed(2)}
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            onToggleBetSelection({
                              id: dh12Id,
                              matchId: match.id,
                              match,
                              marketType: 'DOUBLE_CHANCE',
                              marketName: 'Dupla Hipótese',
                              pickName: '12 (Qualquer Vencedor)',
                              odd: odds.doubleChance12
                            })
                          }
                          className={`p-2 rounded-xl text-center transition-all border ${
                            isSelected(dh12Id)
                              ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400'
                              : 'bg-[#121829] text-slate-300 border-slate-800 hover:border-blue-500/40'
                          }`}
                        >
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            {isSelected(dh12Id) ? '✓ ' : ''}12
                          </span>
                          <span className="text-xs font-mono font-black text-blue-400">
                            {odds.doubleChance12.toFixed(2)}
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            onToggleBetSelection({
                              id: dhX2Id,
                              matchId: match.id,
                              match,
                              marketType: 'DOUBLE_CHANCE',
                              marketName: 'Dupla Hipótese',
                              pickName: 'X2 (Empate ou Fora)',
                              odd: odds.doubleChanceX2
                            })
                          }
                          className={`p-2 rounded-xl text-center transition-all border ${
                            isSelected(dhX2Id)
                              ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400'
                              : 'bg-[#121829] text-slate-300 border-slate-800 hover:border-blue-500/40'
                          }`}
                        >
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            {isSelected(dhX2Id) ? '✓ ' : ''}X2
                          </span>
                          <span className="text-xs font-mono font-black text-blue-400">
                            {odds.doubleChanceX2.toFixed(2)}
                          </span>
                        </button>
                      </>
                    )}

                  </div>

                  {/* Single Match AI Analysis Button */}
                  <button
                    onClick={() => onAskGuelboyAboutMatch(match)}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-blue-600/30 text-slate-300 hover:text-blue-300 border border-slate-700/60 hover:border-blue-500/40 transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold"
                    title="Análise isolada deste jogo com a IA"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span className="hidden sm:inline">Análise</span>
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
