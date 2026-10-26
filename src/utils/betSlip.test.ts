import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMatchOdds, calculateTotalOdds, calculatePotentialReturn, formatBetSlipPrompt, BetSelection } from './betSlip';
import { MOCK_MATCHES } from './footballMockData';

test('calculateMatchOdds generates positive and realistic odds for matches', () => {
  const match = MOCK_MATCHES[0];
  const odds = calculateMatchOdds(match);

  assert.ok(odds.homeWin >= 1.10, 'Home odd should be >= 1.10');
  assert.ok(odds.draw >= 2.00, 'Draw odd should be >= 2.00');
  assert.ok(odds.awayWin >= 1.10, 'Away odd should be >= 1.10');
  assert.ok(odds.over25 > 1.0, 'Over 2.5 should be valid');
  assert.ok(odds.under25 > 1.0, 'Under 2.5 should be valid');
});

test('calculateTotalOdds computes combined odds for multiple bets', () => {
  const selections: BetSelection[] = [
    {
      id: '1-1X2-H',
      matchId: 101,
      match: MOCK_MATCHES[0],
      marketType: '1X2',
      marketName: 'Resultado Final',
      pickName: 'Botafogo Vence',
      odd: 2.0
    },
    {
      id: '2-1X2-A',
      matchId: 102,
      match: MOCK_MATCHES[1],
      marketType: '1X2',
      marketName: 'Resultado Final',
      pickName: 'Palmeiras Vence',
      odd: 1.85
    }
  ];

  const total = calculateTotalOdds(selections);
  assert.equal(total, 3.7);

  const potential = calculatePotentialReturn(10, total);
  assert.equal(potential, 37.0);
});

test('formatBetSlipPrompt builds comprehensive prompt for Guelboy AI', () => {
  const selections: BetSelection[] = [
    {
      id: '1-1X2-H',
      matchId: 101,
      match: MOCK_MATCHES[0],
      marketType: '1X2',
      marketName: 'Resultado Final',
      pickName: 'Botafogo Vence',
      odd: 2.10
    }
  ];

  const prompt = formatBetSlipPrompt(selections, 50);
  assert.ok(prompt.includes('bilhete esportivo'));
  assert.ok(prompt.includes('Botafogo'));
  assert.ok(prompt.includes('2.10'));
  assert.ok(prompt.includes('VEREDITO FINAL'));
});
