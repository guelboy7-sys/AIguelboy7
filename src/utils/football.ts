/**
 * Football domain models and utility functions for Guelboy AI.
 */

export interface Competition {
  id: number;
  code: string;
  name: string;
  emblem: string;
  country: string;
  flag: string;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface MatchScore {
  fullTime: {
    home: number | null;
    away: number | null;
  };
  halfTime?: {
    home: number | null;
    away: number | null;
  };
}

export interface Match {
  id: number;
  utcDate: string;
  status: 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'LIVE' | 'FINISHED' | 'SUSPENDED' | 'POSTPONED' | 'CANCELLED';
  matchday?: number;
  stage?: string;
  homeTeam: Team;
  awayTeam: Team;
  score: MatchScore;
  competition: {
    id: number;
    name: string;
    code: string;
    emblem: string;
  };
  minute?: number | string;
}

export interface StandingPosition {
  position: number;
  team: Team;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form?: string;
}

export interface CompetitionStandings {
  competition: Competition;
  season: {
    startDate: string;
    endDate: string;
    currentMatchday: number;
  };
  table: StandingPosition[];
  lastUpdated?: string;
}

export const SUPPORTED_COMPETITIONS: Competition[] = [
  {
    id: 2013,
    code: 'BSA',
    name: 'Brasileirão Série A',
    emblem: 'https://crests.football-data.org/764.svg',
    country: 'Brasil',
    flag: '🇧🇷'
  },
  {
    id: 2021,
    code: 'PL',
    name: 'Premier League',
    emblem: 'https://crests.football-data.org/PL.png',
    country: 'Inglaterra',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
  },
  {
    id: 2001,
    code: 'CL',
    name: 'UEFA Champions League',
    emblem: 'https://crests.football-data.org/CL.png',
    country: 'Europa',
    flag: '🇪🇺'
  },
  {
    id: 2014,
    code: 'PD',
    name: 'La Liga',
    emblem: 'https://crests.football-data.org/laliga.png',
    country: 'Espanha',
    flag: '🇪🇸'
  },
  {
    id: 2019,
    code: 'SA',
    name: 'Serie A TIM',
    emblem: 'https://crests.football-data.org/SA.png',
    country: 'Itália',
    flag: '🇮🇹'
  },
  {
    id: 2002,
    code: 'BL1',
    name: 'Bundesliga',
    emblem: 'https://crests.football-data.org/BL1.png',
    country: 'Alemanha',
    flag: '🇩🇪'
  }
];

export function getStatusBadgeInfo(status: Match['status']): {
  label: string;
  isLive: boolean;
  bgClass: string;
  textClass: string;
  borderClass: string;
} {
  switch (status) {
    case 'IN_PLAY':
    case 'LIVE':
      return {
        label: 'AO VIVO',
        isLive: true,
        bgClass: 'bg-emerald-500/15',
        textClass: 'text-emerald-400',
        borderClass: 'border-emerald-500/30'
      };
    case 'PAUSED':
      return {
        label: 'INTERVALO',
        isLive: true,
        bgClass: 'bg-amber-500/15',
        textClass: 'text-amber-400',
        borderClass: 'border-amber-500/30'
      };
    case 'FINISHED':
      return {
        label: 'ENCERRADO',
        isLive: false,
        bgClass: 'bg-slate-800/80',
        textClass: 'text-slate-300',
        borderClass: 'border-slate-700/50'
      };
    case 'POSTPONED':
      return {
        label: 'ADIADO',
        isLive: false,
        bgClass: 'bg-rose-500/15',
        textClass: 'text-rose-400',
        borderClass: 'border-rose-500/30'
      };
    case 'CANCELLED':
      return {
        label: 'CANCELADO',
        isLive: false,
        bgClass: 'bg-red-500/15',
        textClass: 'text-red-400',
        borderClass: 'border-red-500/30'
      };
    case 'SCHEDULED':
    case 'TIMED':
    default:
      return {
        label: 'AGENDADO',
        isLive: false,
        bgClass: 'bg-blue-500/15',
        textClass: 'text-blue-400',
        borderClass: 'border-blue-500/30'
      };
  }
}

export function formatMatchScore(score: MatchScore): {
  home: string;
  away: string;
  hasScore: boolean;
} {
  if (score.fullTime.home !== null && score.fullTime.away !== null) {
    return {
      home: String(score.fullTime.home),
      away: String(score.fullTime.away),
      hasScore: true
    };
  }
  return {
    home: '-',
    away: '-',
    hasScore: false
  };
}

export function calculateGoalDifference(goalsFor: number, goalsAgainst: number): number {
  return goalsFor - goalsAgainst;
}

export function calculatePoints(won: number, draw: number): number {
  return (won * 3) + (draw * 1);
}

export function formatKickoffTime(utcDateStr: string): string {
  try {
    const date = new Date(utcDateStr);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '--:--';
  }
}

export function formatMatchDate(utcDateStr: string): string {
  try {
    const date = new Date(utcDateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      weekday: 'short'
    });
  } catch {
    return '';
  }
}

/**
 * Builds factual football context for the Guelboy AI Gemini prompt.
 */
export function buildFootballContextString(params: {
  competitionCode?: string;
  matches?: Match[];
  standings?: StandingPosition[];
}): string {
  const parts: string[] = [];

  if (params.competitionCode) {
    const comp = SUPPORTED_COMPETITIONS.find(c => c.code === params.competitionCode);
    if (comp) {
      parts.push(`Competição Selecionada: ${comp.name} (${comp.country})`);
    }
  }

  if (params.standings && params.standings.length > 0) {
    parts.push('Classificação Atual (Top 6):');
    params.standings.slice(0, 6).forEach(pos => {
      parts.push(
        `${pos.position}º ${pos.team.name}: ${pos.points} pts, ${pos.playedGames} jogos, ${pos.won}V ${pos.draw}E ${pos.lost}D (SG: ${pos.goalDifference > 0 ? '+' : ''}${pos.goalDifference})`
      );
    });
  }

  if (params.matches && params.matches.length > 0) {
    parts.push('Partidas Recentes / Em Foco:');
    params.matches.slice(0, 5).forEach(m => {
      const score = m.score.fullTime.home !== null ? `${m.score.fullTime.home} x ${m.score.fullTime.away}` : 'vs';
      const status = getStatusBadgeInfo(m.status).label;
      parts.push(
        `- [${status}] ${m.homeTeam.name} ${score} ${m.awayTeam.name} (${m.competition.name})`
      );
    });
  }

  return parts.join('\n');
}
