import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  X, 
  Maximize2, 
  Minimize2, 
  Globe, 
  RefreshCw, 
  Cpu, 
  Zap, 
  ChevronRight,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { ChatMessage } from '../types';
import { sendChatMessageStream } from '../services/geminiService';

interface GeminiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_QUESTIONS = [
  'What are the critical yield killers in 2nm High-NA EUV stochastics?',
  'Compare CoWoS-L vs Intel EMIB packaging for 192GB HBM4 modules',
  'How does Backside Power Delivery (BS-PDN) mitigate IR drop in 1.4nm CFET?',
  'Summarize the AISemiCon 2026 Keynote on Optical Interconnects in AI Clusters'
];

export const GeminiChatModal: React.FC<GeminiChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      text: 'Greetings. I am SemiBot 2026, your AI Semiconductor Copilot for the AISemiCon 2026 Summit. I can analyze wafer defect density, evaluate sub-2nm GAAFET/CFET PPA trade-offs, inspect High-NA EUV lithography parameters, and parse global foundry supply chain signals. How can I assist your silicon strategy today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputPrompt).trim();
    if (!textToSend || isLoading) return;

    const userMsgId = `u-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const modelMsgId = `m-${Date.now()}`;
    const initialModelMessage: ChatMessage = {
      id: modelMsgId,
      role: 'model',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true
    };

    setMessages(prev => [...prev, userMessage, initialModelMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      let streamAccumulator = '';

      const result = await sendChatMessageStream(
        textToSend,
        history,
        enableWebSearch,
        (chunk) => {
          streamAccumulator += chunk;
          setMessages(prev =>
            prev.map(msg =>
              msg.id === modelMsgId
                ? { ...msg, text: streamAccumulator, isStreaming: true }
                : msg
            )
          );
        }
      );

      setMessages(prev =>
        prev.map(msg =>
          msg.id === modelMsgId
            ? {
                ...msg,
                text: result.text || streamAccumulator,
                isStreaming: false,
                groundingSources: result.sources
              }
            : msg
        )
      );
    } catch (err: any) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === modelMsgId
            ? { ...msg, text: `Error calling Gemini: ${err?.message || 'Check connection.'}`, isStreaming: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'model',
        text: 'Session reset. Ready for silicon architecture analysis, GAAFET calculations, or Summit intelligence.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 p-2 bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div 
        className={`bg-[#0C1322] border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 overflow-hidden w-full ${
          isExpanded 
            ? 'sm:w-[90vw] sm:h-[90vh] h-[95vh]' 
            : 'sm:w-[540px] sm:h-[680px] h-[88vh]'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#101B30] to-slate-900 p-4 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center border border-cyan-300/40 shadow-sm shadow-cyan-500/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white tracking-wide">SemiBot 2026</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400/40">
                  Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Silicon Architect & High-NA Fab Expert</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setEnableWebSearch(!enableWebSearch)}
              title={enableWebSearch ? 'Web Search Grounding Active' : 'Toggle Web Grounding'}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all border ${
                enableWebSearch
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
            </button>

            <button
              onClick={handleClear}
              title="Reset Chat"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:block p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex-shrink-0 flex items-center justify-center mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-md ${
                    isUser
                      ? 'bg-cyan-600/90 text-white rounded-tr-none'
                      : 'bg-[#152036] text-slate-200 border border-slate-800/80 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="font-semibold text-[11px] text-cyan-200">
                      {isUser ? 'You (Architect)' : 'SemiBot AI'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{m.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-wrap break-words text-[13px] leading-relaxed">
                    {m.text || (m.isStreaming ? (
                      <span className="flex items-center gap-1.5 text-cyan-300">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Analyzing silicon node parameters...
                      </span>
                    ) : '')}
                  </div>

                  {/* Web Grounding Links */}
                  {m.groundingSources && m.groundingSources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/60">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-cyan-400" />
                        Verified Grounding References
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.groundingSources.map((source, i) => (
                          <a
                            key={i}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 text-cyan-300 hover:text-cyan-200 border border-slate-700 hover:border-cyan-500 text-[11px] transition"
                          >
                            <span className="truncate max-w-[180px]">{source.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/40 flex-shrink-0 flex items-center justify-center mt-1">
                    <User className="w-3.5 h-3.5 text-indigo-300" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt presets */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80">
          <p className="text-[10px] font-mono text-slate-400 mb-1.5 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Quick Silicon Prompts:
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {PRESET_QUESTIONS.map((question, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSend(question)}
                className="text-[11px] whitespace-nowrap bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/80 px-2.5 py-1 rounded-lg transition"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-[#0E1626] border-t border-cyan-500/20 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask about 2nm GAAFET, HBM4 thermal dissipation, CoWoS, High-NA..."
            disabled={isLoading}
            className="flex-1 bg-slate-900/90 text-slate-100 placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
          />

          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 p-2.5 rounded-xl transition shadow-md shadow-cyan-500/20"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
