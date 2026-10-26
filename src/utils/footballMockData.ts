import { Match, StandingPosition } from './football';

export const MOCK_STANDINGS: Record<string, StandingPosition[]> = {
  BSA: [
    {
      position: 1,
      team: { id: 1765, name: 'Botafogo', shortName: 'Botafogo', tla: 'BOT', crest: 'https://crests.football-data.org/1765.png' },
      playedGames: 30,
      won: 18,
      draw: 7,
      lost: 5,
      points: 61,
      goalsFor: 48,
      goalsAgainst: 26,
      goalDifference: 22,
      form: 'V,V,E,V,D'
    },
    {
      position: 2,
      team: { id: 1769, name: 'Palmeiras', shortName: 'Palmeiras', tla: 'PAL', crest: 'https://crests.football-data.org/1769.png' },
      playedGames: 30,
      won: 18,
      draw: 6,
      lost: 6,
      points: 60,
      goalsFor: 51,
      goalsAgainst: 23,
      goalDifference: 28,
      form: 'V,V,V,E,V'
    },
    {
      position: 3,
      team: { id: 1783, name: 'Fortaleza', shortName: 'Fortaleza', tla: 'FOR', crest: 'https://crests.football-data.org/1783.png' },
      playedGames: 30,
      won: 16,
      draw: 8,
      lost: 6,
      points: 56,
      goalsFor: 39,
      goalsAgainst: 30,
      goalDifference: 9,
      form: 'E,D,V,E,V'
    },
    {
      position: 4,
      team: { id: 1780, name: 'Flamengo', shortName: 'Flamengo', tla: 'FLA', crest: 'https://crests.football-data.org/1780.png' },
      playedGames: 29,
      won: 15,
      draw: 6,
      lost: 8,
      points: 51,
      goalsFor: 45,
      goalsAgainst: 34,
      goalDifference: 11,
      form: 'D,V,V,D,V'
    },
    {
      position: 5,
      team: { id: 1775, name: 'São Paulo', shortName: 'São Paulo', tla: 'SAO', crest: 'https://crests.football-data.org/1775.png' },
      playedGames: 30,
      won: 14,
      draw: 5,
      lost: 11,
      points: 47,
      goalsFor: 38,
      goalsAgainst: 32,
      goalDifference: 6,
      form: 'V,D,V,D,E'
    },
    {
      position: 6,
      team: { id: 1766, name: 'Internacional', shortName: 'Inter', tla: 'INT', crest: 'https://crests.football-data.org/1766.png' },
      playedGames: 29,
      won: 12,
      draw: 10,
      lost: 7,
      points: 46,
      goalsFor: 38,
      goalsAgainst: 26,
      goalDifference: 12,
      form: 'V,E,V,V,E'
    },
    {
      position: 7,
      team: { id: 1770, name: 'Cruzeiro', shortName: 'Cruzeiro', tla: 'CRU', crest: 'https://crests.football-data.org/1770.png' },
      playedGames: 30,
      won: 12,
      draw: 8,
      lost: 10,
      points: 44,
      goalsFor: 36,
      goalsAgainst: 33,
      goalDifference: 3,
      form: 'E,D,E,E,D'
    },
    {
      position: 8,
      team: { id: 1777, name: 'Bahia', shortName: 'Bahia', tla: 'BAH', crest: 'https://crests.football-data.org/1777.png' },
      playedGames: 30,
      won: 12,
      draw: 7,
      lost: 11,
      points: 43,
      goalsFor: 39,
      goalsAgainst: 37,
      goalDifference: 2,
      form: 'D,V,D,E,D'
    }
  ],
  PL: [
    {
      position: 1,
      team: { id: 64, name: 'Liverpool FC', shortName: 'Liverpool', tla: 'LIV', crest: 'https://crests.football-data.org/64.png' },
      playedGames: 9,
      won: 7,
      draw: 1,
      lost: 1,
      points: 22,
      goalsFor: 17,
      goalsAgainst: 5,
      goalDifference: 12,
      form: 'E,V,V,V,V'
    },
    {
      position: 2,
      team: { id: 65, name: 'Manchester City FC', shortName: 'Man City', tla: 'MCI', crest: 'https://crests.football-data.org/65.png' },
      playedGames: 9,
      won: 7,
      draw: 2,
      lost: 0,
      points: 23,
      goalsFor: 20,
      goalsAgainst: 9,
      goalDifference: 11,
      form: 'V,V,V,E,E'
    },
    {
      position: 3,
      team: { id: 57, name: 'Arsenal FC', shortName: 'Arsenal', tla: 'ARS', crest: 'https://crests.football-data.org/57.png' },
      playedGames: 9,
      won: 5,
      draw: 3,
      lost: 1,
      points: 18,
      goalsFor: 17,
      goalsAgainst: 10,
      goalDifference: 7,
      form: 'E,D,V,V,E'
    },
    {
      position: 4,
      team: { id: 58, name: 'Aston Villa FC', shortName: 'Aston Villa', tla: 'AVL', crest: 'https://crests.football-data.org/58.png' },
      playedGames: 9,
      won: 5,
      draw: 3,
      lost: 1,
      points: 18,
      goalsFor: 16,
      goalsAgainst: 11,
      goalDifference: 5,
      form: 'E,V,E,E,V'
    },
    {
      position: 5,
      team: { id: 61, name: 'Chelsea FC', shortName: 'Chelsea', tla: 'CHE', crest: 'https://crests.football-data.org/61.png' },
      playedGames: 9,
      won: 5,
      draw: 2,
      lost: 2,
      points: 17,
      goalsFor: 19,
      goalsAgainst: 11,
      goalDifference: 8,
      form: 'V,D,E,V,V'
    }
  ],
  CL: [
    {
      position: 1,
      team: { id: 58, name: 'Aston Villa FC', shortName: 'Aston Villa', tla: 'AVL', crest: 'https://crests.football-data.org/58.png' },
      playedGames: 3,
      won: 3,
      draw: 0,
      lost: 0,
      points: 9,
      goalsFor: 6,
      goalsAgainst: 0,
      goalDifference: 6,
      form: 'V,V,V'
    },
    {
      position: 2,
      team: { id: 64, name: 'Liverpool FC', shortName: 'Liverpool', tla: 'LIV', crest: 'https://crests.football-data.org/64.png' },
      playedGames: 3,
      won: 3,
      draw: 0,
      lost: 0,
      points: 9,
      goalsFor: 6,
      goalsAgainst: 1,
      goalDifference: 5,
      form: 'V,V,V'
    },
    {
      position: 3,
      team: { id: 65, name: 'Manchester City FC', shortName: 'Man City', tla: 'MCI', crest: 'https://crests.football-data.org/65.png' },
      playedGames: 3,
      won: 2,
      draw: 1,
      lost: 0,
      points: 7,
      goalsFor: 9,
      goalsAgainst: 0,
      goalDifference: 9,
      form: 'V,V,E'
    },
    {
      position: 4,
      team: { id: 86, name: 'Real Madrid CF', shortName: 'Real Madrid', tla: 'RMA', crest: 'https://crests.football-data.org/86.png' },
      playedGames: 3,
      won: 2,
      draw: 0,
      lost: 1,
      points: 6,
      goalsFor: 8,
      goalsAgainst: 4,
      goalDifference: 4,
      form: 'V,D,V'
    }
  ]
};

export const MOCK_MATCHES: Match[] = [
  {
    id: 101,
    utcDate: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    status: 'IN_PLAY',
    matchday: 31,
    homeTeam: { id: 1765, name: 'Botafogo', shortName: 'Botafogo', tla: 'BOT', crest: 'https://crests.football-data.org/1765.png' },
    awayTeam: { id: 1769, name: 'Palmeiras', shortName: 'Palmeiras', tla: 'PAL', crest: 'https://crests.football-data.org/1769.png' },
    score: {
      fullTime: { home: 1, away: 1 },
      halfTime: { home: 1, away: 0 }
    },
    competition: {
      id: 2013,
      name: 'Brasileirão Série A',
      code: 'BSA',
      emblem: 'https://crests.football-data.org/764.svg'
    },
    minute: 38
  },
  {
    id: 102,
    utcDate: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    status: 'FINISHED',
    matchday: 31,
    homeTeam: { id: 1780, name: 'Flamengo', shortName: 'Flamengo', tla: 'FLA', crest: 'https://crests.football-data.org/1780.png' },
    awayTeam: { id: 1775, name: 'São Paulo', shortName: 'São Paulo', tla: 'SAO', crest: 'https://crests.football-data.org/1775.png' },
    score: {
      fullTime: { home: 2, away: 1 },
      halfTime: { home: 0, away: 1 }
    },
    competition: {
      id: 2013,
      name: 'Brasileirão Série A',
      code: 'BSA',
      emblem: 'https://crests.football-data.org/764.svg'
    }
  },
  {
    id: 103,
    utcDate: new Date(Date.now() + 180 * 60 * 1000).toISOString(),
    status: 'SCHEDULED',
    matchday: 10,
    homeTeam: { id: 65, name: 'Manchester City FC', shortName: 'Man City', tla: 'MCI', crest: 'https://crests.football-data.org/65.png' },
    awayTeam: { id: 57, name: 'Arsenal FC', shortName: 'Arsenal', tla: 'ARS', crest: 'https://crests.football-data.org/57.png' },
    score: {
      fullTime: { home: null, away: null }
    },
    competition: {
      id: 2021,
      name: 'Premier League',
      code: 'PL',
      emblem: 'https://crests.football-data.org/PL.png'
    }
  },
  {
    id: 104,
    utcDate: new Date(Date.now() + 300 * 60 * 1000).toISOString(),
    status: 'SCHEDULED',
    matchday: 8,
    homeTeam: { id: 86, name: 'Real Madrid CF', shortName: 'Real Madrid', tla: 'RMA', crest: 'https://crests.football-data.org/86.png' },
    awayTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barcelona', tla: 'FCB', crest: 'https://crests.football-data.org/81.png' },
    score: {
      fullTime: { home: null, away: null }
    },
    competition: {
      id: 2014,
      name: 'La Liga',
      code: 'PD',
      emblem: 'https://crests.football-data.org/laliga.png'
    }
  }
];
