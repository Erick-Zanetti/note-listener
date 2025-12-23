import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Settings as SettingsIcon, Sparkles, Save, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { processNote, type AIProvider } from '../services/ai';
import { saveToNotion } from '../services/notion';
import { transcribeWithWhisper } from '../services/whisper';

export default function Home() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processedResult, setProcessedResult] = useState('');
  const [aiTitle, setAiTitle] = useState('');
  const [aiCategory, setAiCategory] = useState('');
  const [aiTags, setAiTags] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState('');
  
  // For Whisper recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const recognitionRef = useRef<any>(null);
  const [speechMethod, setSpeechMethod] = useState<'browser' | 'whisper'>('browser');

  // Load speech method from config
  useEffect(() => {
    const config = JSON.parse(localStorage.getItem('note-listener-config') || '{}');
    setSpeechMethod(config.speechMethod || 'browser');
  }, []);


  useEffect(() => {
    if (speechMethod === 'browser' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => prev + ' ' + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        let errorMessage = 'Speech recognition error.';
        
        switch(event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not found or permission denied.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied.';
            break;
          case 'network':
            errorMessage = 'Network error. Web Speech API needs internet. Try Whisper.';
            break;
          case 'aborted':
            errorMessage = 'Recognition aborted.';
            break;
        }
        
        setStatus(errorMessage);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          try {
            recognitionRef.current?.start();
          } catch (e) {
            console.error('Failed to restart recognition:', e);
            setIsRecording(false);
          }
        }
      };
    } else if (speechMethod === 'browser') {
      setStatus('Browser does not support speech recognition.');
    }
  }, [isRecording, speechMethod]);

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (speechMethod === 'browser') {
        recognitionRef.current?.stop();
      } else {
        // Stop Whisper recording
        mediaRecorderRef.current?.stop();
      }
      setIsRecording(false);
      setStatus(speechMethod === 'whisper' ? 'Processing audio...' : 'Recording stopped.');
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        setTranscript('');
        setProcessedResult('');
        setAiTitle('');

        if (speechMethod === 'browser') {
          // Use Web Speech API
          recognitionRef.current?.start();
          setIsRecording(true);
          setStatus('Listening...');
        } else {
          // Use Whisper (MediaRecorder)
          audioChunksRef.current = [];
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            setStatus('Transcribing with Whisper...');
            
            try {
              const config = JSON.parse(localStorage.getItem('note-listener-config') || '{}');
              if (!config.openaiKey) {
                setStatus('OpenAI API Key not configured!');
                return;
              }

              const transcription = await transcribeWithWhisper(audioBlob, config.openaiKey);
              setTranscript(transcription);
              setStatus('Transcription complete!');
            } catch (error) {
              console.error('Whisper error:', error);
              setStatus('Error transcribing with Whisper.');
              alert('Transcription error: ' + (error instanceof Error ? error.message : String(error)));
            } finally {
              stream.getTracks().forEach(track => track.stop());
            }
          };

          mediaRecorder.start();
          setIsRecording(true);
          setStatus('Recording with Whisper...');
        }
      } catch (error) {
        console.error('Microphone permission error:', error);
        setStatus('Microphone permission denied. Please allow access in browser settings.');
      }
    }
  };

  const handleProcess = async () => {
    const config = JSON.parse(localStorage.getItem('note-listener-config') || '{}');
    if (!config.openaiKey && !config.anthropicKey && !config.geminiKey) {
      alert('Please configure API keys in Settings.');
      return;
    }

    setIsProcessing(true);
    setStatus('Processing with AI...');
    
    try {
      const provider = config.defaultProvider as AIProvider || 'openai';
      const apiKey = provider === 'openai' ? config.openaiKey : 
                     provider === 'anthropic' ? config.anthropicKey : 
                     config.geminiKey;
      
      const result = await processNote({
        text: transcript,
        provider,
        apiKey,
        systemPrompt: config.systemPrompt || 'Summarize this into clear and concise mental bullet points.',
        outputLanguage: config.outputLanguage || 'English',
      });
      
      setProcessedResult(result.content);
      setAiTitle(result.title);
      setAiCategory(result.category);
      setAiTags(result.tags);
      setStatus('Processing complete.');
    } catch (error) {
      console.error(error);
      setStatus('Error processing.');
      alert('Processing error: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveNotion = async () => {
    const config = JSON.parse(localStorage.getItem('note-listener-config') || '{}');
    if (!config.notionToken || !config.notionDatabaseId) {
      alert('Please configure Notion integration.');
      return;
    }

    setIsSaving(true);
    setStatus('Saving to Notion...');

    try {
      const title = aiTitle || 'New Mental Note';
      
      await saveToNotion({
        title,
        content: processedResult,
        transcript: transcript,
        category: aiCategory,
        tags: aiTags,
        apiKey: config.notionToken,
        databaseId: config.notionDatabaseId,
      });
      
      setStatus('Saved to Notion successfully!');
      setTimeout(() => {
        setStatus('');
        setTranscript('');
        setProcessedResult('');
        setAiTitle('');
        setAiCategory('');
        setAiTags([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus('Error saving to Notion.');
      alert('Error saving to Notion. Check console (F12) for details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col relative overflow-hidden selection:bg-indigo-500/30">
      {/* Ambient Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 py-4 flex justify-between items-center border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Mic className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Note listener
          </span>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 text-slate-400 hover:text-white"
          title="Settings"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        
        {/* Left Column: Recording & Transcription */}
        <div className="flex flex-col gap-6 min-h-0">
          {/* Recording Status Card */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center gap-4 relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-b ${isRecording ? 'from-red-500/10 to-transparent' : 'from-indigo-500/5 to-transparent'} opacity-50 transition-colors duration-500`} />

            <button
              onClick={toggleRecording}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording
                ? 'bg-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.4)] scale-110'
                : 'bg-slate-800 text-slate-200 shadow-lg hover:bg-slate-700 hover:scale-105 border border-white/10'
                }`}
            >
              {isRecording ? (
                <Square className="w-8 h-8 fill-current" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>

            <div className="text-center z-10">
              <h3 className="font-medium text-slate-200">
                {isRecording ? 'Recording...' : 'Tap to record'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {speechMethod === 'whisper' ? 'Using Whisper AI' : 'Using Web Speech API'}
              </p>
              {status && (
                <p className="text-xs text-slate-500 mt-1">
                  {status}
                </p>
              )}
            </div>
          </div>

          {/* Transcription Area */}
          <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden min-h-[300px]">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Transcription
              </label>
              {transcript && (
                <button
                  onClick={() => setTranscript('')}
                  className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="flex-1 bg-transparent p-4 resize-none focus:outline-none text-slate-300 text-base leading-relaxed placeholder:text-slate-700"
              placeholder="Your speech will appear here..."
            />
            <div className="p-4 border-t border-white/5 bg-white/[0.02]">
              <button
                onClick={handleProcess}
                disabled={!transcript || isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Process with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Result */}
        <div className="glass-panel rounded-2xl flex flex-col overflow-hidden min-h-[400px]">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              AI Analysis
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(processedResult)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative group">
            {!processedResult ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-3">
                <Sparkles className="w-12 h-12 opacity-20" />
                <p className="text-sm">AI result will appear here</p>
              </div>
            ) : (
              <textarea
                value={processedResult}
                onChange={(e) => setProcessedResult(e.target.value)}
                  className="w-full h-full bg-transparent p-6 resize-none focus:outline-none text-slate-300 text-base leading-relaxed font-medium"
              />
            )}
          </div>

          {processedResult && (
            <div className="p-4 border-t border-white/5 bg-white/[0.02] flex gap-3">
              <button
                onClick={handleSaveNotion}
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                    <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Saving...' : 'Save to Notion'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
