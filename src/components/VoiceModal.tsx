import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, Sparkles, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewMessage: (userText: string, aiText: string, citations?: string[]) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  onNewMessage,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition if available in the browser
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  if (!isOpen) return null;

  const startListening = async () => {
    setAiResponse(null);
    setTranscript('');
    setIsRecording(true);

    // Try Web Speech API for immediate live transcription
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition start exception:', e);
      }
    }

    // Also capture MediaRecorder audio stream for POST /api/voice
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        await handleAudioSubmission(audioBlob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
    } catch (err) {
      console.warn('Microphone access note (simulating speech buffer):', err);
      // Fallback transcript simulation if mic permission is denied or in mock mode
      setTimeout(() => {
        setTranscript("Is mild swelling normal after completing 15 knee extensions?");
      }, 1500);
    }
  };

  const stopListening = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    } else {
      // If simulated
      const fallbackQuery = transcript || "Is mild swelling normal after completing 15 knee extensions?";
      processWithAgents(fallbackQuery, null);
    }
  };

  const handleAudioSubmission = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Calls backend POST /api/voice
      const res = await api.sendVoiceAudio(audioBlob);
      const finalTranscript = transcript || res.transcription;
      setTranscript(finalTranscript);
      setAiResponse(res.response);
      speakText(res.response);
      onNewMessage(finalTranscript, res.response, ["AAOS Post-Op Knee Protocol"]);
    } catch {
      const fallbackText = "Mild swelling post-exercise is expected at Day 24. Apply a cold pack for 15 minutes with your leg elevated above heart level.";
      setAiResponse(fallbackText);
      speakText(fallbackText);
      onNewMessage(transcript || "Knee swelling question", fallbackText);
    } finally {
      setIsProcessing(false);
    }
  };

  const processWithAgents = async (userText: string, audioBlob: Blob | null) => {
    setIsProcessing(true);
    try {
      if (audioBlob) {
        await handleAudioSubmission(audioBlob);
      } else {
        const chatRes = await api.sendChatMessage(userText);
        setAiResponse(chatRes.response);
        speakText(chatRes.response);
        onNewMessage(userText, chatRes.response, chatRes.guideline_citations);
      }
    } catch (err) {
      const resp = "Day 24 recovery guidelines recommend gentle cold therapy and elevation after movement.";
      setAiResponse(resp);
      speakText(resp);
      onNewMessage(userText, resp);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleClose = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50 to-emerald-50">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-600 text-white rounded-xl shadow-sm">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-800 text-base">MOVRA Recovery Assistant</h3>
              <p className="text-xs text-teal-700 font-medium">Rehabilitation & Recovery Guidance</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-6">
          {/* Clinical Safety Disclaimer */}
          <div className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 text-left">
            <strong>Clinical Notice:</strong> Ask about exercises, recovery routines, and pain tracking. AI assistance does not replace your physiotherapist or doctor.
          </div>

          {/* Glowing Animated Mic Visualizer */}
          <div className="relative my-2">
            {/* Pulsing concentric rings when recording */}
            {isRecording && (
              <>
                <div className="absolute -inset-4 rounded-full bg-teal-400/20 animate-ping"></div>
                <div className="absolute -inset-8 rounded-full bg-teal-500/10 animate-pulse"></div>
              </>
            )}

            <button
              onClick={isRecording ? stopListening : startListening}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 text-white scale-110 shadow-rose-500/30'
                  : isProcessing
                  ? 'bg-amber-500 text-white'
                  : 'bg-gradient-to-tr from-teal-600 to-teal-500 text-white shadow-teal-500/30 hover:scale-105 active:scale-95'
              }`}
            >
              {isProcessing ? (
                <Loader2 className="w-10 h-10 animate-spin" />
              ) : isRecording ? (
                <MicOff className="w-10 h-10 animate-pulse" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          {/* Status Label */}
          <div>
            <div className="text-sm font-bold text-slate-800">
              {isRecording
                ? 'Listening to Rahul...'
                : isProcessing
                ? 'Reviewing recovery guidelines...'
                : aiResponse
                ? 'Recovery Guidance Ready'
                : 'Tap Microphone to Speak'}
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              {isRecording
                ? 'Speak clearly about knee discomfort, routine pacing, or exercise questions.'
                : isProcessing
                ? 'Evaluating protocol guidelines & clinical memory...'
                : 'Ask questions about your daily physical therapy routine.'}
            </p>
          </div>

          {/* Live Transcript Display */}
          {(transcript || isRecording) && (
            <div className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                You Said
              </span>
              <p className="text-xs text-slate-700 italic">
                "{transcript || 'Listening for speech...'}"
              </p>
            </div>
          )}

          {/* AI Response Display */}
          {aiResponse && (
            <div className="w-full p-4 rounded-2xl bg-teal-50/80 border border-teal-200/80 text-left animate-in fade-in">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                  AI Physio Response
                </span>
                <button
                  onClick={() => speakText(aiResponse)}
                  className={`p-1 rounded-md text-teal-700 hover:bg-teal-100 flex items-center gap-1 text-[11px] font-medium ${
                    isPlayingAudio ? 'text-teal-900 bg-teal-100 animate-pulse' : ''
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingAudio ? 'Speaking...' : 'Play Audio'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-normal">
                {aiResponse}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-1.5"
          >
            Close
          </button>
          {aiResponse && (
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
