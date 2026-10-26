import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Trash2, Copy, Check, RotateCcw, AlertCircle, Database } from 'lucide-react';
import { buildFootballContextString, Competition, Match, StandingPosition } from '../utils/football';
import { renderFormattedContent } from '../utils/formatMarkdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp: string;
}

interface ChatTabProps {
  currentCompetition?: Competition;
  currentMatches?: Match[];
  currentStandings?: StandingPosition[];
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

const PRESET_PROMPTS = [
  'Quem é o favorito para o título do Brasileirão?',
  'Análise tática: Como anular um ataque com pontas velozes?',
  'Explique o que é xG (Expected Goals) e sua importância',
  'Real Madrid vs Manchester City: Análise de elenco e tática'
];

export function ChatTab({
  currentCompetition,
  currentMatches,
  currentStandings,
  initialPrompt,
  onClearInitialPrompt
}: ChatTabProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Fala, fã de futebol! Eu sou o **Guelboy AI**, seu analista tático e especialista em futebol alimentado por **Google Gemini AI real**.\n\nPergunte-me qualquer coisa sobre táticas, escalações, momentos de clubes, projeções para o Brasileirão, Champions League ou análises das partidas de hoje!',
      model: 'Google Gemini',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [useGroundingContext, setUseGroundingContext] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt) {
      sendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setErrorMsg(null);
    setInput('');

    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    // Build context if grounding is enabled
    let contextStr = '';
    if (useGroundingContext) {
      contextStr = buildFootballContextString({
        competitionCode: currentCompetition?.code,
        matches: currentMatches,
        standings: currentStandings
      });
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          context: contextStr
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro no servidor (${response.status})`);
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: data.content,
        model: data.model || 'Google Gemini',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao conectar com o modelo Gemini no servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-restart',
        role: 'assistant',
        content: 'Conversa reiniciada. Sobre qual campeonato, tática ou jogo vamos falar agora?',
        model: 'Google Gemini',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setErrorMsg(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem-3.5rem)] md:h-[calc(100vh-4rem)] max-w-5xl mx-auto px-3 sm:px-6 py-4">
      
      {/* Subheader Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">
            Guelboy AI • Gemini Inteligência Esportiva
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
            IA Real
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-400 hover:text-slate-300">
            <input
              type="checkbox"
              checked={useGroundingContext}
              onChange={(e) => setUseGroundingContext(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
            />
            <Database className="w-3 h-3 text-blue-400" />
            <span className="hidden sm:inline">Contexto de Jogos/Tabela</span>
          </label>

          <button
            onClick={clearChat}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800/60 transition-colors"
            title="Limpar conversa"
            aria-label="Limpar conversa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`relative group max-w-[88%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/20'
                  : 'bg-[#0f1524] text-slate-200 border border-blue-950/80 rounded-tl-none shadow-lg'
              }`}
            >
              {/* Message Header info */}
              <div className="flex items-center justify-between gap-3 mb-1 text-[11px] opacity-75">
                <span className="font-semibold">
                  {msg.role === 'user' ? 'Você' : 'Guelboy AI'}
                </span>
                <span className="text-[10px]">{msg.timestamp}</span>
              </div>

              {/* Message Body (with rich markdown parsing) */}
              <div className="space-y-1">
                {renderFormattedContent(msg.content)}
              </div>

              {/* Assistant model badge and copy button */}
              {msg.role === 'assistant' && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-[10px] text-blue-400">
                    <Sparkles className="w-3 h-3" />
                    {msg.model || 'Google Gemini'}
                  </span>

                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
                    title="Copiar texto"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start animate-in fade-in duration-200">
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#0f1524] border border-blue-950/80 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-slate-300 flex items-center gap-2">
              <div className="flex gap-1.5 py-1">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-slate-400">Guelboy AI está analisando o lance...</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Erro ao obter resposta da IA:</p>
              <p className="text-rose-200/80 mt-0.5">{errorMsg}</p>
            </div>
            <button
              onClick={() => sendMessage()}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-900/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-200 text-xs transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Tentar de novo
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompt chips */}
      {messages.length <= 2 && (
        <div className="py-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Sugestões de Análise:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(prompt)}
                disabled={loading}
                className="text-left text-xs px-3 py-1.5 rounded-lg bg-[#0f1524] hover:bg-blue-600/20 border border-blue-900/40 text-slate-300 hover:text-white transition-all disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="relative flex items-center bg-[#0c101c] border border-blue-900/40 focus-within:border-blue-500 rounded-2xl shadow-lg transition-colors p-1.5"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte ao Guelboy AI sobre jogos, táticas, jogadores ou campeonatos..."
            disabled={loading}
            className="w-full bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none max-h-32 min-h-[40px]"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex-shrink-0 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:hover:bg-blue-600 transition-colors shadow-md shadow-blue-600/30"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-500 mt-1.5">
          Pressione Enter para enviar • Shift + Enter para quebra de linha
        </p>
      </div>

    </div>
  );
}
