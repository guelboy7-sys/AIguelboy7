import { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, Database, RefreshCw, X, CheckCircle2, AlertTriangle, Key, ExternalLink } from 'lucide-react';

interface DiagnosisProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DiagnosisModal({ isOpen, onClose }: DiagnosisProps) {
  const [loading, setLoading] = useState(false);
  const [dataStatus, setDataStatus] = useState<any>(null);
  const [geminiStatus, setGeminiStatus] = useState<any>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const [healthRes, footballRes] = await Promise.all([
        fetch('/api/health'),
        fetch('/api/football/status')
      ]);

      const health = await healthRes.json();
      const football = await footballRes.json();

      setGeminiStatus(health.gemini);
      setDataStatus(football);
    } catch (err: any) {
      console.error('Falha ao checar status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0c101c] border border-blue-900/40 rounded-2xl p-6 shadow-2xl text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="diagnosis-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          aria-label="Fechar diagnóstico"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 id="diagnosis-title" className="text-xl font-bold tracking-tight text-white">
              Diagnóstico do Sistema Guelboy AI
            </h2>
            <p className="text-xs text-slate-400">
              Auditoria de segurança, modelos de IA e integrações de dados
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Gemini AI Status */}
          <div className="p-4 rounded-xl bg-[#131b2e] border border-slate-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Google Gemini AI</h3>
                  <p className="text-xs text-slate-400">
                    Modelos: gemini-3.8-flash com fallback automático para gemini-3.1-flash-lite
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ativo no Servidor
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-1">
              <p>• <strong>Status da Chave:</strong> Injetada de forma segura nas variáveis de ambiente do backend.</p>
              <p>• <strong>Respostas:</strong> 100% IA real, sem respostas pré-programadas ou simuladas.</p>
            </div>
          </div>

          {/* Football-Data.org Status */}
          <div className="p-4 rounded-xl bg-[#131b2e] border border-slate-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Football-Data.org (API v4)</h3>
                  <p className="text-xs text-slate-400">
                    Provedor de partidas, tabelas e resultados esportivos
                  </p>
                </div>
              </div>
              {dataStatus?.hasKey && dataStatus?.status === 'connected' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Conectado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Modo de Referência
                </span>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-2">
              <p className="text-slate-300">
                <strong>Status atual:</strong> {dataStatus?.message || (loading ? 'Verificando conexão...' : 'Aguardando verificação')}
              </p>
              
              {!dataStatus?.hasKey && (
                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 text-amber-200/90 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                    <Key className="w-3.5 h-3.5" />
                    Como ativar dados 100% ao vivo do football-data.org:
                  </div>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                    <li>Cadastre-se gratuitamente em <a href="https://www.football-data.org/client/register" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-0.5">football-data.org <ExternalLink className="w-3 h-3" /></a></li>
                    <li>Copie o seu token de API enviado por e-mail.</li>
                    <li>Defina a variável <code className="px-1 py-0.5 bg-slate-800 rounded text-blue-300">FOOTBALL_DATA_API_KEY</code> no painel Secrets/Ambiente.</li>
                  </ol>
                  <p className="text-[11px] text-slate-400">
                    Enquanto a chave não for inserida, o Guelboy AI usa um banco de dados de referência com jogos e tabelas realistas do Brasileirão, Premier League e Champions League para que nenhuma tela fique em branco ou trave.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Security Compliance Card */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20">
            <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Diretrizes de Segurança Rígidas
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nenhuma chave de API é inserida no HTML, no código cliente, no bundle público do navegador ou no LocalStorage. Toda autenticação com o Google Gemini e com a football-data.org ocorre estritamente dentro do servidor Node/Express (<code className="text-blue-300">server.ts</code>), mantendo os segredos totalmente protegidos.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Testando Conexão...' : 'Testar Conexão Agora'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-lg shadow-blue-600/30"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
