import { Match } from './football';

export type BetMarketType = '1X2' | 'BTTS' | 'OVER_UNDER_25' | 'DOUBLE_CHANCE';

export interface BetSelection {
  id: string; // unique key e.g. "101-1X2-HOME"
  matchId: number;
  match: Match;
  marketType: BetMarketType;
  marketName: string;
  pickName: string; // "Botafogo Vence", "Empate", "Palmeiras Vence", "Mais de 2.5", "Ambas Marcam: Sim"
  odd: number;
}

export interface MatchOdds {
  matchId: number;
  homeWin: number;
  draw: number;
  awayWin: number;
  over25: number;
  under25: number;
  bttsYes: number;
  bttsNo: number;
  doubleChance1X: number;
  doubleChanceX2: number;
  doubleChance12: number;
}

/**
 * Calculates plausible bookmaker-style odds dynamically based on team positions, 
 * goal difference, or match IDs so every match has a realistic betting market.
 */
export function calculateMatchOdds(match: Match): MatchOdds {
  // Deterministic seed based on match id and names
  const seed = (match.id * 37 + match.homeTeam.name.length * 13 + match.awayTeam.name.length * 7) % 100;
  
  // Home advantage bias (base 45% home, 27% draw, 28% away)
  let homeProb = 0.44 + (seed % 15 - 7) / 100;
  let drawProb = 0.28 + (seed % 9 - 4) / 100;
  let awayProb = 1 - homeProb - drawProb;

  // Ensure bounds
  homeProb = Math.max(0.20, Math.min(0.70, homeProb));
  awayProb = Math.max(0.15, Math.min(0.65, awayProb));
  drawProb = Math.max(0.15, Math.min(0.35, 1 - homeProb - awayProb));

  // Add 6% margin
  const margin = 1.06;
  const rawHome = Number((margin / homeProb).toFixed(2));
  const rawDraw = Number((margin / drawProb).toFixed(2));
  const rawAway = Number((margin / awayProb).toFixed(2));

  // Over/under 2.5
  const isHighScoring = (seed % 2 === 0);
  const over25 = isHighScoring ? 1.78 : 2.15;
  const under25 = isHighScoring ? 2.05 : 1.70;

  // BTTS
  const bttsYes = isHighScoring ? 1.72 : 1.95;
  const bttsNo = isHighScoring ? 2.10 : 1.85;

  // Double chance
  const doubleChance1X = Number((1 / (homeProb + drawProb) * 1.05).toFixed(2));
  const doubleChanceX2 = Number((1 / (awayProb + drawProb) * 1.05).toFixed(2));
  const doubleChance12 = Number((1 / (homeProb + awayProb) * 1.05).toFixed(2));

  return {
    matchId: match.id,
    homeWin: Math.max(1.15, rawHome),
    draw: Math.max(2.50, rawDraw),
    awayWin: Math.max(1.25, rawAway),
    over25,
    under25,
    bttsYes,
    bttsNo,
    doubleChance1X: Math.max(1.10, doubleChance1X),
    doubleChanceX2: Math.max(1.10, doubleChanceX2),
    doubleChance12: Math.max(1.10, doubleChance12)
  };
}

export function calculateTotalOdds(selections: BetSelection[]): number {
  if (selections.length === 0) return 1.0;
  const product = selections.reduce((acc, curr) => acc * curr.odd, 1);
  return Number(product.toFixed(2));
}

export function calculatePotentialReturn(stake: number, totalOdds: number): number {
  return Number((stake * totalOdds).toFixed(2));
}

export function formatBetSlipPrompt(selections: BetSelection[], stake = 20): string {
  const totalOdds = calculateTotalOdds(selections);
  const potentialReturn = calculatePotentialReturn(stake, totalOdds);

  const lines: string[] = [
    `Guelboy AI, acabei de montar um bilhete esportivo de apostas com ${selections.length} seleções (Odd Total Acumulada: ${totalOdds}x, Retorno Simulado: R$ ${potentialReturn}).`,
    '',
    'Faça uma ANÁLISE PROFUNDA E IMPLACÁVEL deste bilhete de apostas como um especialista e trader esportivo profissional:',
    '',
    '--- SELEÇÕES DO MEU BILHETE ---'
  ];

  selections.forEach((sel, i) => {
    lines.push(
      `${i + 1}. [${sel.match.competition.name}] ${sel.match.homeTeam.name} vs ${sel.match.awayTeam.name}`
    );
    lines.push(
      `   Mercado: ${sel.marketName} | Palpite: "${sel.pickName}" | Cotação/Odd: ${sel.odd.toFixed(2)}`
    );
  });

  lines.push('');
  lines.push('Por favor, estruture sua análise respondendo:');
  lines.push('1. ESTIMATIVA DE PROBABILIDADE REAL (Esta odd tem valor esperado positivo/EV+ ou é uma armadilha das casas?)');
  lines.push('2. ANÁLISE JOGO A JOGO: Para cada seleção, quais os pontos a favor (motivos para bater) e quais os maiores perigos/riscos (desfalques, momento tático, xG)?');
  lines.push('3. A "PERNA MAIS SEGURA" e o "MAIOR PONTO DE RISCO/ZEBRA" do bilhete.');
  lines.push('4. VEREDITO FINAL: Você manteria esse bilhete, faria alguma proteção (ex: dupla chance ou empate anula) ou mudaria alguma seleção?');

  return lines.join('\n');
}
