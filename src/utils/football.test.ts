import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getStatusBadgeInfo,
  formatMatchScore,
  calculateGoalDifference,
  calculatePoints,
  buildFootballContextString,
  SUPPORTED_COMPETITIONS
} from './football';
import { MOCK_MATCHES, MOCK_STANDINGS } from './footballMockData';

test('calculatePoints returns correct football points (3 for win, 1 for draw)', () => {
  assert.equal(calculatePoints(10, 2), 32);
  assert.equal(calculatePoints(0, 0), 0);
  assert.equal(calculatePoints(5, 5), 20);
});

test('calculateGoalDifference computes goalsFor minus goalsAgainst', () => {
  assert.equal(calculateGoalDifference(50, 20), 30);
  assert.equal(calculateGoalDifference(10, 15), -5);
  assert.equal(calculateGoalDifference(25, 25), 0);
});

test('getStatusBadgeInfo identifies live, finished, and scheduled matches', () => {
  const liveInfo = getStatusBadgeInfo('IN_PLAY');
  assert.equal(liveInfo.isLive, true);
  assert.equal(liveInfo.label, 'AO VIVO');

  const pauseInfo = getStatusBadgeInfo('PAUSED');
  assert.equal(pauseInfo.isLive, true);
  assert.equal(pauseInfo.label, 'INTERVALO');

  const finishedInfo = getStatusBadgeInfo('FINISHED');
  assert.equal(finishedInfo.isLive, false);
  assert.equal(finishedInfo.label, 'ENCERRADO');

  const scheduledInfo = getStatusBadgeInfo('SCHEDULED');
  assert.equal(scheduledInfo.isLive, false);
  assert.equal(scheduledInfo.label, 'AGENDADO');
});

test('formatMatchScore formats finished scores and scheduled matches', () => {
  const finishedScore = formatMatchScore({ fullTime: { home: 3, away: 1 } });
  assert.equal(finishedScore.hasScore, true);
  assert.equal(finishedScore.home, '3');
  assert.equal(finishedScore.away, '1');

  const pendingScore = formatMatchScore({ fullTime: { home: null, away: null } });
  assert.equal(pendingScore.hasScore, false);
  assert.equal(pendingScore.home, '-');
  assert.equal(pendingScore.away, '-');
});

test('buildFootballContextString produces grounded football facts for AI', () => {
  const context = buildFootballContextString({
    competitionCode: 'BSA',
    matches: MOCK_MATCHES,
    standings: MOCK_STANDINGS.BSA
  });

  assert.ok(context.includes('Brasileirão Série A'));
  assert.ok(context.includes('Botafogo'));
  assert.ok(context.includes('Palmeiras'));
});

test('SUPPORTED_COMPETITIONS contains key leagues including Brasileirão and Premier League', () => {
  const codes = SUPPORTED_COMPETITIONS.map(c => c.code);
  assert.ok(codes.includes('BSA'), 'Must include Brasileirão Série A');
  assert.ok(codes.includes('PL'), 'Must include Premier League');
  assert.ok(codes.includes('CL'), 'Must include Champions League');
  assert.ok(codes.includes('PD'), 'Must include La Liga');
});
