import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { ChatTab } from './components/ChatTab';
import { MatchesTab } from './components/MatchesTab';
import { StandingsTab } from './components/StandingsTab';
import { DiagnosisModal } from './components/DiagnosisModal';
import { BetSlipDrawer } from './components/BetSlipDrawer';
import { BetAnalysisModal } from './components/BetAnalysisModal';
import { 
  Competition, 
  Match, 
  StandingPosition, 
  SUPPORTED_COMPETITIONS 
} from './utils/football';
import { BetSelection } from './utils/betSlip';
import { MOCK_MATCHES, MOCK_STANDINGS } from './utils/footballMockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'matches' | 'standings'>('matches');
  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
  const [competitions, setCompetitions] = useState<Competition[]>(SUPPORTED_COMPETITIONS);
  const [selectedCompetition, setSelectedCompetition] = useState<string>('BSA');
  
  // Matches state
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesSource, setMatchesSource] = useState<'live' | 'fallback'>('fallback');
  const [matchesReason, setMatchesReason] = useState<string>('');

  // Standings state
  const [standings, setStandings] = useState<StandingPosition[]>(MOCK_STANDINGS.BSA);
  const [standingsLoading, setStandingsLoading] = useState(false);
  const [standingsSource, setStandingsSource] = useState<'live' | 'fallback'>('fallback');
  const [standingsReason, setStandingsReason] = useState<string>('');

  // Sportsbook Bet Slip State
  const [betSelections, setBetSelections] = useState<BetSelection[]>([]);
  const [isBetSlipOpen, setIsBetSlipOpen] = useState(false);
  const [isBetAnalysisOpen, setIsBetAnalysisOpen] = useState(false);
  const [betAnalysisLoading, setBetAnalysisLoading] = useState(false);
  const [betAnalysisData, setBetAnalysisData] = useState<any>(null);
  const [currentStake, setCurrentStake] = useState<number>(20);

  // Football-data server status
  const [footballStatus, setFootballStatus] = useState<{ hasKey: boolean; status: string }>({
    hasKey: false,
    status: 'checking'
  });

  // Prompt handoff to Chat
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>(undefined);

  // Load competitions on mount
  useEffect(() => {
    fetch('/api/football/competitions')
      .then((res) => res.json())
      .then((data) => {
        if (data.competitions && Array.isArray(data.competitions) && data.competitions.length > 0) {
          setCompetitions(data.competitions);
        }
      })
      .catch((err) => console.warn('Erro ao carregar campeonatos:', err));

    fetch('/api/football/status')
      .then((res) => res.json())
      .then((data) => {
        setFootballStatus({
          hasKey: !!data.hasKey,
          status: data.status || 'unknown'
        });
      })
      .catch((err) => console.warn('Erro ao checar status do football-data:', err));
  }, []);

  // Fetch matches when competition changes
  const loadMatches = async (compCode: string) => {
    setMatchesLoading(true);
    try {
      const res = await fetch(`/api/football/matches?competition=${compCode}`);
      const data = await res.json();
      if (data.matches) {
        setMatches(data.matches);
        setMatchesSource(data.source === 'live' ? 'live' : 'fallback');
        setMatchesReason(data.reason || '');
      }
    } catch (err) {
      console.warn('Erro ao buscar partidas:', err);
      setMatchesSource('fallback');
    } finally {
      setMatchesLoading(false);
    }
  };

  // Fetch standings when competition changes
  const loadStandings = async (compCode: string) => {
    setStandingsLoading(true);
    try {
      const res = await fetch(`/api/football/standings?competition=${compCode}`);
      const data = await res.json();
      if (data.table) {
        setStandings(data.table);
        setStandingsSource(data.source === 'live' ? 'live' : 'fallback');
        setStandingsReason(data.reason || '');
      }
    } catch (err) {
      console.warn('Erro ao buscar tabela:', err);
      setStandingsSource('fallback');
    } finally {
      setStandingsLoading(false);
    }
  };

  useEffect(() => {
    loadMatches(selectedCompetition);
    loadStandings(selectedCompetition);
  }, [selectedCompetition]);

  // Toggle selection in bet slip
  const handleToggleBetSelection = (selection: BetSelection) => {
    setBetSelections((prev) => {
      const exists = prev.some((s) => s.id === selection.id);
      if (exists) {
        return prev.filter((s) => s.id !== selection.id);
      } else {
        // If from the same match and market, replace previous pick from that same match
        const filtered = prev.filter(
          (s) => !(s.matchId === selection.matchId && s.marketType === selection.marketType)
        );
        const updated = [...filtered, selection];
        // Auto open bet slip on first pick
        if (prev.length === 0) {
          setIsBetSlipOpen(true);
        }
        return updated;
      }
    });
  };

  const handleRemoveBetSelection = (id: string) => {
    setBetSelections((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClearAllBets = () => {
    setBetSelections([]);
    setIsBetSlipOpen(false);
  };

  // Trigger AI audit of the bet slip
  const handleAnalyzeBetSlip = async (stake: number) => {
    if (betSelections.length === 0) return;
    setCurrentStake(stake);
    setIsBetAnalysisOpen(true);
    setBetAnalysisLoading(true);
    setBetAnalysisData(null);

    try {
      const response = await fetch('/api/bet/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selections: betSelections,
          stake: stake
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Erro HTTP ${response.status}`);
      }

      const data = await response.json();
      setBetAnalysisData(data);
    } catch (err: any) {
      console.error('Falha ao auditar bilhete:', err);
      setBetAnalysisData({
        totalOdds: 1.0,
        potentialReturn: stake,
        impliedProbability: 50,
        riskLevel: 'Moderado',
        analysis: `⚠️ Não foi possível obter análise do servidor: ${err.message}. Tente novamente.`,
        model: 'Google Gemini'
      });
    } finally {
      setBetAnalysisLoading(false);
    }
  };

  const handleAskAboutMatch = (match: Match) => {
    const isLive = match.status === 'IN_PLAY' || match.status === 'LIVE';
    const isFinished = match.status === 'FINISHED';
    
    let prompt = '';
    if (isFinished) {
      prompt = `Guelboy AI, faça uma análise pós-jogo detalhada da partida ${match.homeTeam.name} ${match.score.fullTime.home} x ${match.score.fullTime.away} ${match.awayTeam.name} pelo torneio ${match.competition.name}. O que definiu o resultado?`;
    } else if (isLive) {
      prompt = `Guelboy AI, a partida entre ${match.homeTeam.name} e ${match.awayTeam.name} está AO VIVO (${match.score.fullTime.home ?? 0} x ${match.score.fullTime.away ?? 0}). O que cada treinador precisa ajustar no intervalo/segundo tempo?`;
    } else {
      prompt = `Guelboy AI, faça um raio-x pré-jogo de apostas e tático de ${match.homeTeam.name} vs ${match.awayTeam.name} pelo ${match.competition.name}. Quais são os mercados mais atrativos e as armadilhas a evitar?`;
    }

    setInitialPrompt(prompt);
    setActiveTab('chat');
  };

  const handleAskAboutStandings = () => {
    const comp = competitions.find((c) => c.code === selectedCompetition) || SUPPORTED_COMPETITIONS[0];
    const prompt = `Guelboy AI, faça uma análise tática e de momento da tabela do ${comp.name}. Quem é o principal candidato ao título, quais times estão surpreendendo e como está a briga pelo G-4 e contra o rebaixamento?`;
    
    setInitialPrompt(prompt);
    setActiveTab('chat');
  };

  const currentComp = competitions.find((c) => c.code === selectedCompetition);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Main App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDiagnosis={() => setIsDiagnosisOpen(true)}
        footballDataStatus={footballStatus}
        betSlipCount={betSelections.length}
        onOpenBetSlip={() => setIsBetSlipOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'chat' && (
          <ChatTab
            currentCompetition={currentComp}
            currentMatches={matches}
            currentStandings={standings}
            initialPrompt={initialPrompt}
            onClearInitialPrompt={() => setInitialPrompt(undefined)}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesTab
            competitions={competitions}
            selectedCompetition={selectedCompetition}
            onSelectCompetition={setSelectedCompetition}
            matches={matches}
            loading={matchesLoading}
            dataSource={matchesSource}
            dataReason={matchesReason}
            onRefresh={() => loadMatches(selectedCompetition)}
            onAskGuelboyAboutMatch={handleAskAboutMatch}
            betSelections={betSelections}
            onToggleBetSelection={handleToggleBetSelection}
            onOpenBetSlip={() => setIsBetSlipOpen(true)}
          />
        )}

        {activeTab === 'standings' && (
          <StandingsTab
            competitions={competitions}
            selectedCompetition={selectedCompetition}
            onSelectCompetition={setSelectedCompetition}
            standings={standings}
            loading={standingsLoading}
            dataSource={standingsSource}
            dataReason={standingsReason}
            onRefresh={() => loadStandings(selectedCompetition)}
            onAskGuelboyAboutStandings={handleAskAboutStandings}
          />
        )}
      </main>

      {/* Interactive Sportsbook Bet Slip Drawer */}
      <BetSlipDrawer
        selections={betSelections}
        onRemoveSelection={handleRemoveBetSelection}
        onClearAll={handleClearAllBets}
        onAnalyzeBet={handleAnalyzeBetSlip}
        isOpen={isBetSlipOpen}
        setIsOpen={setIsBetSlipOpen}
      />

      {/* Deep Bet AI Audit Modal */}
      <BetAnalysisModal
        isOpen={isBetAnalysisOpen}
        onClose={() => setIsBetAnalysisOpen(false)}
        analysisData={betAnalysisData}
        loading={betAnalysisLoading}
        selections={betSelections}
        stake={currentStake}
        onOpenInChat={(prompt) => {
          setInitialPrompt(prompt);
          setActiveTab('chat');
        }}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDiagnosis={() => setIsDiagnosisOpen(true)}
        betSlipCount={betSelections.length}
        onOpenBetSlip={() => setIsBetSlipOpen(true)}
      />

      {/* Diagnosis & Key Security Modal */}
      <DiagnosisModal
        isOpen={isDiagnosisOpen}
        onClose={() => setIsDiagnosisOpen(false)}
      />

    </div>
  );
}
