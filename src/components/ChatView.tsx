import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  Sparkles, 
  Bot, 
  User, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  FileText, 
  Clock, 
  ArrowRight,
  Info,
  Lock,
  Cloud,
  Loader2 
} from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (query: string, mode?: 'cloud' | 'private') => Promise<void>;
  onOpenVoiceModal: () => void;
  memoryEnabled: boolean;
  isLoading: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  onOpenVoiceModal,
  memoryEnabled,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [isPrivateMode, setIsPrivateMode] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplyChips = [
    "Log Pain",
    "Today's Exercises",
    "My Progress",
    "Next Appointment",
    "Ice or heat after walking?"
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const text = inputValue.trim();
    setInputValue('');
    onSendMessage(text, isPrivateMode ? 'private' : 'cloud');
  };

  const handleChipClick = (chipText: string) => {
    if (isLoading) return;
    onSendMessage(chipText, isPrivateMode ? 'private' : 'cloud');
  };

  const speakMessage = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (playingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setPlayingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setPlayingMessageId(messageId);
    utterance.onend = () => setPlayingMessageId(null);
    utterance.onerror = () => setPlayingMessageId(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-68px)] max-w-md mx-auto bg-slate-50">
      {/* Top Chat Bar */}
      <div className="p-3 bg-white border-b border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className={`w-9 h-9 rounded-2xl text-white flex items-center justify-center font-bold shadow-sm transition-colors ${
                isPrivateMode ? 'bg-slate-800 shadow-slate-900/30' : 'bg-teal-600 shadow-teal-600/30'
              }`}>
                {isPrivateMode ? <Lock className="w-4 h-4 text-emerald-400" /> : <Bot className="w-5 h-5" />}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                isPrivateMode ? 'bg-emerald-400' : 'bg-emerald-500'
              }`}></span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-bold text-slate-800 text-sm">MOVRA Recovery Assistant</h2>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold border ${
                  isPrivateMode 
                    ? 'text-slate-700 bg-slate-100 border-slate-300' 
                    : 'text-teal-700 bg-teal-50 border-teal-200/60'
                }`}>
                  {isPrivateMode ? 'Deepseek Local' : 'Clinical RAG'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Recovery &amp; Exercise Adherence Support</p>
            </div>
          </div>

          {/* 'Memory On' Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
              memoryEnabled
                ? 'bg-teal-50 text-teal-800 border-teal-200 shadow-xs'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
            title={
              memoryEnabled
                ? 'AI Clinical Memory is active: past pain levels and milestones are retained'
                : 'Memory is currently disabled in profile'
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                memoryEnabled ? 'bg-teal-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span className="text-[11px]">{memoryEnabled ? 'Memory On' : 'Memory Off'}</span>
          </div>
        </div>

        {/* Toggle Switch: 'Cloud Mode' vs 'Private Mode' */}
        <div className="flex items-center justify-between bg-slate-100/80 p-1 rounded-xl text-xs border border-slate-200/70">
          <button
            type="button"
            onClick={() => setIsPrivateMode(false)}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
              !isPrivateMode
                ? 'bg-white text-teal-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-teal-600" />
            <span>Cloud Mode (RAG)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPrivateMode(true)}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
              isPrivateMode
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Private Mode (Local)</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Mode Status Notice Banner */}
        <div className={`p-2.5 rounded-2xl text-[11px] flex items-center gap-2 border ${
          isPrivateMode
            ? 'bg-slate-900 text-slate-200 border-slate-800 shadow-xs'
            : 'bg-teal-50/70 text-teal-900 border-teal-200/60'
        }`}>
          {isPrivateMode ? (
            <>
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Private Mode Active:</strong> Queries run locally on-device via <strong>LocalRAGAgent (Deepseek-R1 + Qdrant)</strong>. Zero data leaves your machine.
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
              <span>
                <strong>Cloud Mode Active:</strong> Queries processed by <strong>RAGAgent</strong> with AAOS clinical protocols and <strong>MemoryAgent</strong>.
              </span>
            </>
          )}
        </div>

        {messages.map((message) => {
          const isUser = message.sender === 'user';
          const isAudioActive = playingMessageId === message.id;

          return (
            <div
              key={message.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-2xs ${
                  isUser
                    ? 'bg-slate-800 text-white'
                    : isPrivateMode
                    ? 'bg-slate-900 text-emerald-400 border border-slate-700'
                    : 'bg-teal-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`max-w-[82%] rounded-3xl p-3.5 space-y-1.5 transition-all shadow-[0_1px_4px_rgba(0,0,0,0.03)] ${
                  isUser
                    ? 'bg-teal-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isUser ? 'text-teal-200' : 'text-slate-400'
                    }`}
                  >
                    {isUser ? (message.isVoiceInput ? 'Voice Query' : 'You') : 'Dr. Movra AI'}
                  </span>
                  <span
                    className={`text-[10px] ${isUser ? 'text-teal-200' : 'text-slate-400'}`}
                  >
                    {message.timestamp}
                  </span>
                </div>

                <p className="text-xs leading-relaxed whitespace-pre-line font-normal">
                  {message.text}
                </p>

                {/* Clinical Guideline Citations */}
                {!isUser && message.citations && message.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Evidence-Based Citation:
                    </span>
                    {message.citations.map((citation, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10px] text-teal-800 font-mono"
                      >
                        <FileText className="w-3 h-3 text-teal-600" />
                        <span className="truncate max-w-[220px]">{citation}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Audio Read-Out Button */}
                {!isUser && (
                  <div className="pt-1 flex items-center justify-end">
                    <button
                      onClick={() => speakMessage(message.id, message.text)}
                      className="p-1 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-50 transition-colors"
                      title={isAudioActive ? 'Stop reading' : 'Read aloud with AI voice'}
                    >
                      {isAudioActive ? (
                        <VolumeX className="w-3.5 h-3.5 text-teal-600" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200/80 rounded-3xl rounded-tl-none p-3.5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                <span>
                  {isPrivateMode ? 'Deepseek Local is reasoning...' : 'Consulting Contextual AI protocols...'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Chips */}
      <div className="px-4 py-2 bg-white/80 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
        {quickReplyChips.map((chip) => (
          <button
            key={chip}
            onClick={() => handleChipClick(chip)}
            disabled={isLoading}
            className="text-[11px] font-medium whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 transition-colors border border-slate-200/70"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Input & Mic Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isPrivateMode ? "Ask local Deepseek privately..." : "Ask Dr. Movra about knee pain, clicking..."}
            disabled={isLoading}
            className="w-full py-2.5 pl-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Glowing Microphone Button for Voice Input */}
        <div className="relative shrink-0">
          <div className="absolute -inset-1 rounded-full bg-teal-400/40 blur-xs animate-pulse"></div>
          <button
            type="button"
            onClick={onOpenVoiceModal}
            className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-700/30 hover:scale-105 active:scale-95 transition-transform"
            title="Tap to speak with Dr. Movra (Voice Agent)"
          >
            <Mic className="w-4 h-4 stroke-[2.25]" />
          </button>
        </div>
      </form>
    </div>
  );
};
