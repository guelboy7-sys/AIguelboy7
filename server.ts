import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { MOCK_MATCHES, MOCK_STANDINGS } from './src/utils/footballMockData';
import { SUPPORTED_COMPETITIONS } from './src/utils/football';

dotenv.config({ override: true });

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI client on server side only
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Guelboy AI Football System Prompt
const GUELBOY_SYSTEM_PROMPT = `Você é o Guelboy AI, o assistente e analista de inteligência artificial definitivo de futebol.
Você é técnico, altamente conhecedor, apaixonado por futebol e focado em entregar as melhores análises táticas, dados de campeonatos, estatísticas e debates esportivos.

Diretrizes de resposta:
- Foco primordial em futebol: Brasileirão (Séries A e B), Copa do Brasil, Libertadores, Champions League, Premier League, La Liga, Serie A TIM, Bundesliga e seleções.
- Seja técnico e moderno: comente esquemas táticos (ex: 4-3-3, 3-4-2-1, pressing alto, transição rápida, xG, bloco baixo, inversão de jogo).
- Linguagem em Português do Brasil, profissional, dinâmica e entusiasmada com futebol.
- Se receber contexto de partidas ou tabela do usuário, utilize essas informações factual para fundamentar sua análise.
- Seja claro, organizado, usando tópicos e destaques em negrito.
- Nunca invente placares se não souber; utilize os dados fornecidos ou admita que a partida ainda não foi disputada.`;

// API Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'Guelboy AI',
    timestamp: new Date().toISOString(),
    gemini: {
      configured: !!process.env.GEMINI_API_KEY,
      provider: 'Google Gemini'
    },
    footballData: {
      configured: !!process.env.FOOTBALL_DATA_API_KEY,
      provider: 'football-data.org v4'
    }
  });
});

// Chat endpoint with fallback across modern Gemini models
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Nenhuma mensagem enviada.' });
    }

    if (!aiClient) {
      return res.status(500).json({
        error: 'Chave GEMINI_API_KEY não configurada no servidor.',
        isSimulated: false
      });
    }

    // Build contents for Gemini
    const lastUserMsg = messages[messages.length - 1];
    let promptWithContext = lastUserMsg.content || '';

    if (context && typeof context === 'string' && context.trim().length > 0) {
      promptWithContext = `[Contexto dos jogos e campeonato atualizado]:\n${context}\n\n[Pergunta do usuário]:\n${promptWithContext}`;
    }

    // History formatting
    const historyParts = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const contents = [
      ...historyParts,
      {
        role: 'user',
        parts: [{ text: promptWithContext }]
      }
    ];

    // Priority model chain: gemini-3.1-flash-lite -> gemini-3.8-flash -> gemini-flash-latest
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let responseText = '';
    let usedModel = '';
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await aiClient.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: GUELBOY_SYSTEM_PROMPT,
            temperature: 0.7,
            topP: 0.95
          }
        });

        if (response.text) {
          responseText = response.text;
          usedModel = modelName;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Tentativa com ${modelName} falhou:`, err?.message || err);
      }
    }

    if (!responseText) {
      throw lastError || new Error('Não foi possível obter resposta dos modelos Gemini disponíveis.');
    }

    return res.json({
      role: 'assistant',
      content: responseText,
      model: usedModel,
      isRealAI: true,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Erro no endpoint /api/chat:', error);
    return res.status(500).json({
      error: error?.message || 'Erro ao processar mensagem com a IA.',
      isRealAI: false
    });
  }
});
// Sportsbook Bet Slip Deep Analysis with Gemini AI
app.post('/api/bet/analyze', async (req: Request, res: Response) => {
  try {
    const { selections, stake = 20 } = req.body;

    if (!selections || !Array.isArray(selections) || selections.length === 0) {
      return res.status(400).json({ error: 'Nenhuma seleção no bilhete para analisar.' });
    }

    if (!aiClient) {
      return res.status(500).json({ error: 'Chave GEMINI_API_KEY não configurada no servidor.' });
    }

    const totalOdds = selections.reduce((acc: number, curr: any) => acc * (Number(curr.odd) || 1), 1).toFixed(2);
    const potentialReturn = (Number(stake) * Number(totalOdds)).toFixed(2);

    const prompt = `Você é o Guelboy AI, o mais respeitado analista e especialista em apostas esportivas e tática de futebol.
O usuário montou um bilhete de apostas (Sportsbook/Bet) com ${selections.length} seleção(ões):
- Cotação/Odd Total Acumulada: ${totalOdds}x
- Valor Simulado: R$ ${stake}
- Retorno Potencial: R$ ${potentialReturn}

SELEÇÕES DO BILHETE:
${selections.map((s: any, idx: number) => 
  `${idx + 1}. [${s.match?.competition?.name || 'Futebol'}] ${s.match?.homeTeam?.name || 'Casa'} vs ${s.match?.awayTeam?.name || 'Fora'}
   - Mercado: ${s.marketName}
   - Palpite Selecionado: "${s.pickName}"
   - Odd Individual: ${s.odd}`
).join('\n')}

Faça uma AUDITORIA PROFUNDA, REALISTA E IMPLACÁVEL deste bilhete. Não seja um torcedor otimista ingênuo: aja como um analista de risco e estatístico de elite.
Estruture sua análise com os seguintes tópicos bem organizados em Markdown:
1. 📊 **PROBABILIDADE REAL & ÍNDICE DE VALOR (EV)**:
   - A odd de ${totalOdds}x reflete a probabilidade real ou a casa de apostas embutiu muita margem contra o apostador?
   - Estime uma probabilidade percentual matemática de green (Ex: 35%, 55%, etc.).
2. ⚔️ **ANÁLISE PERNA POR PERNA**:
   - Para CADA seleção, liste os **Pontos Fortes** (por que pode bater) e os **Fatores de Risco/Armadilhas** (desfalques, momento tático, cansaço, retranca).
3. 🛡️ **A PERNA MAIS SEGURA vs. O MAIOR PERIGO**:
   - Qual jogo tem mais consistência e qual é a maior ameaça de derrubar o bilhete?
4. 🎯 **VEREDITO DO GUELBOY AI & SUGESTÕES DE AJUSTE**:
   - Recomendaria manter esse bilhete como está? Sugere alguma proteção (Dupla Chance, Empate Anula, mudar mercado) para aumentar a segurança?`;

    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let analysisText = '';
    let usedModel = '';

    for (const modelName of candidateModels) {
      try {
        const response = await aiClient.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: GUELBOY_SYSTEM_PROMPT,
            temperature: 0.6,
            topP: 0.95
          }
        });

        if (response.text) {
          analysisText = response.text;
          usedModel = modelName;
          break;
        }
      } catch (err) {
        console.warn(`Tentativa de análise com ${modelName} falhou:`, err);
      }
    }

    if (!analysisText) {
      throw new Error('Falha ao gerar análise do bilhete.');
    }

    // Heuristic probability calculation from total odds
    const impliedProb = Math.min(95, Math.max(5, Math.round((1 / Number(totalOdds)) * 100)));
    let riskLevel: 'Baixo' | 'Moderado' | 'Alto' | 'Extremo' = 'Moderado';
    if (Number(totalOdds) < 2.0) riskLevel = 'Baixo';
    else if (Number(totalOdds) < 4.5) riskLevel = 'Moderado';
    else if (Number(totalOdds) < 10.0) riskLevel = 'Alto';
    else riskLevel = 'Extremo';

    return res.json({
      success: true,
      model: usedModel,
      totalOdds: Number(totalOdds),
      potentialReturn: Number(potentialReturn),
      impliedProbability: impliedProb,
      riskLevel,
      analysis: analysisText,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Erro no endpoint /api/bet/analyze:', err);
    return res.status(500).json({ error: err.message || 'Erro ao auditar bilhete esportivo.' });
  }
});

// Football-data Competitions
app.get('/api/football/competitions', (_req: Request, res: Response) => {
  res.json({
    competitions: SUPPORTED_COMPETITIONS
  });
});

function getFootballToken(): string | undefined {
  const raw = process.env.FOOTBALL_DATA_API_KEY;
  if (!raw) return undefined;
  const clean = raw.trim().replace(/^['"]|['"]$/g, '');
  return clean.length >= 10 ? clean : undefined;
}

// Football-data Status check & diagnosis
app.get('/api/football/status', async (_req: Request, res: Response) => {
  const token = getFootballToken();
  if (!token) {
    return res.json({
      hasKey: false,
      status: 'missing_key',
      message: 'Variável de ambiente FOOTBALL_DATA_API_KEY não encontrada no servidor.',
      canUseFallback: true
    });
  }

  try {
    const response = await fetch('https://api.football-data.org/v4/competitions/PL/matches?status=SCHEDULED', {
      headers: {
        'X-Auth-Token': token
      }
    });

    if (response.ok) {
      return res.json({
        hasKey: true,
        status: 'connected',
        statusCode: response.status,
        message: 'Conexão ativa e validada com a API football-data.org v4'
      });
    } else {
      const errData = await response.json().catch(() => ({}));
      const rawMsg = (errData as any).message || '';
      let friendlyMsg = rawMsg;
      if (rawMsg.toLowerCase().includes('token is invalid') || token.trim().length < 20) {
        friendlyMsg = 'A chave FOOTBALL_DATA_API_KEY configurada parece incompleta ou inválida. O token oficial da football-data.org possui 32 caracteres (enviado por e-mail após cadastro). O app está utilizando a base de referência de alta fidelidade com total estabilidade.';
      } else if (!friendlyMsg) {
        friendlyMsg = `Erro HTTP ${response.status} ao consultar football-data.org`;
      }
      return res.json({
        hasKey: true,
        status: 'api_error',
        statusCode: response.status,
        message: friendlyMsg,
        canUseFallback: true
      });
    }
  } catch (err: any) {
    return res.json({
      hasKey: true,
      status: 'network_error',
      message: err?.message || 'Falha de rede ao conectar à API football-data.org',
      canUseFallback: true
    });
  }
});

// Football Matches endpoint
app.get('/api/football/matches', async (req: Request, res: Response) => {
  const competitionCode = (req.query.competition as string) || 'BSA';
  const token = getFootballToken();

  if (token) {
    try {
      const url = competitionCode === 'ALL'
        ? 'https://api.football-data.org/v4/matches'
        : `https://api.football-data.org/v4/competitions/${competitionCode}/matches`;

      const response = await fetch(url, {
        headers: { 'X-Auth-Token': token }
      });

      if (response.ok) {
        const data: any = await response.json();
        return res.json({
          source: 'live',
          competition: competitionCode,
          matches: data.matches || [],
          count: data.resultSet?.count || data.matches?.length || 0
        });
      }
    } catch (err) {
      console.warn('Erro ao consultar football-data.org ao vivo, usando fallback:', err);
    }
  }

  // Fallback to high quality mock data
  const filtered = competitionCode === 'ALL'
    ? MOCK_MATCHES
    : MOCK_MATCHES.filter(m => m.competition.code === competitionCode);

  return res.json({
    source: 'fallback',
    reason: token && token.trim().length >= 20
      ? 'API football-data em manutenção ou limite de requisições excedido'
      : 'Modo de referência ativo (adicione a chave de 32 caracteres da football-data.org para dados 100% ao vivo)',
    competition: competitionCode,
    matches: filtered.length > 0 ? filtered : MOCK_MATCHES,
    count: filtered.length > 0 ? filtered.length : MOCK_MATCHES.length
  });
});

// Football Standings endpoint
app.get('/api/football/standings', async (req: Request, res: Response) => {
  const competitionCode = (req.query.competition as string) || 'BSA';
  const token = getFootballToken();

  if (token) {
    try {
      const url = `https://api.football-data.org/v4/competitions/${competitionCode}/standings`;
      const response = await fetch(url, {
        headers: { 'X-Auth-Token': token }
      });

      if (response.ok) {
        const data: any = await response.json();
        const totalStanding = data.standings?.find((s: any) => s.type === 'TOTAL') || data.standings?.[0];
        return res.json({
          source: 'live',
          competition: data.competition || { code: competitionCode },
          season: data.season,
          table: totalStanding?.table || []
        });
      }
    } catch (err) {
      console.warn('Erro ao consultar standings do football-data.org, usando fallback:', err);
    }
  }

  const table = MOCK_STANDINGS[competitionCode] || MOCK_STANDINGS.BSA;
  const compInfo = SUPPORTED_COMPETITIONS.find(c => c.code === competitionCode) || SUPPORTED_COMPETITIONS[0];

  return res.json({
    source: 'fallback',
    reason: token && token.trim().length >= 20
      ? 'API football-data em manutenção ou limite de requisições excedido'
      : 'Modo de referência ativo (adicione a chave de 32 caracteres da football-data.org para dados 100% ao vivo)',
    competition: compInfo,
    season: {
      startDate: '2024-04-14',
      endDate: '2024-12-08',
      currentMatchday: 31
    },
    table: table
  });
});

// Serve frontend in dev (via Vite) or prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Guelboy AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
