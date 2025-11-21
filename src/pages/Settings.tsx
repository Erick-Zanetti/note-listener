import { useState, useEffect } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    openaiKey: '',
    anthropicKey: '',
    geminiKey: '',
    notionToken: '',
    notionDatabaseId: '',
    systemPrompt: 'Summarize this into clear and concise mental bullet points.',
    defaultProvider: 'openai',
    speechMethod: 'browser', // 'browser' or 'whisper'
    outputLanguage: 'English',
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('note-listener-config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig({
        ...parsed,
        // Ensure new fields have defaults if missing from old config
        outputLanguage: parsed.outputLanguage || 'English',
        systemPrompt: parsed.systemPrompt || 'Summarize this into clear and concise mental bullet points.',
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem('note-listener-config', JSON.stringify(config));
    alert('Settings saved!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col relative overflow-hidden selection:bg-indigo-500/30">
      {/* Ambient Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 py-4 flex items-center gap-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 text-slate-400 hover:text-white group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <h1 className="text-lg font-bold tracking-tight text-slate-200">Settings</h1>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-8 pb-10">

          {/* AI Configuration Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              AI Configuration
            </h2>

            <div className="glass-panel rounded-xl p-1 overflow-hidden">
              <div className="p-5 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Default Provider</label>
                  <div className="relative">
                    <select
                      name="defaultProvider"
                      value={config.defaultProvider}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-slate-950/50 border border-white/10 text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
                    >
                      <option value="openai" className="bg-slate-900 text-slate-200">OpenAI (GPT)</option>
                      <option value="anthropic" className="bg-slate-900 text-slate-200">Anthropic (Claude)</option>
                      <option value="gemini" className="bg-slate-900 text-slate-200">Google (Gemini)</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">AI Output Language</label>
                  <div className="relative">
                    <select
                      name="outputLanguage"
                      value={config.outputLanguage}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-slate-950/50 border border-white/10 text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
                    >
                      <option value="English" className="bg-slate-900 text-slate-200">English</option>
                      <option value="Portuguese" className="bg-slate-900 text-slate-200">Portuguese</option>
                      <option value="Spanish" className="bg-slate-900 text-slate-200">Spanish</option>
                      <option value="French" className="bg-slate-900 text-slate-200">French</option>
                      <option value="German" className="bg-slate-900 text-slate-200">German</option>
                      <option value="Italian" className="bg-slate-900 text-slate-200">Italian</option>
                      <option value="Japanese" className="bg-slate-900 text-slate-200">Japanese</option>
                      <option value="Chinese" className="bg-slate-900 text-slate-200">Chinese</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    The language the AI will use for the summary and analysis.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">System Prompt</label>
                  <textarea
                    name="systemPrompt"
                    value={config.systemPrompt}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-slate-950/50 border border-white/10 text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all min-h-[100px] resize-y placeholder:text-slate-700"
                    placeholder="Ex: Summarize this into..."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Transcription Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Transcription
            </h2>

            <div className="glass-panel rounded-xl p-5">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Method</label>
                <div className="relative">
                  <select
                    name="speechMethod"
                    value={config.speechMethod}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-slate-950/50 border border-white/10 text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none"
                  >
                    <option value="browser" className="bg-slate-900 text-slate-200">Browser (Web Speech API - Free)</option>
                    <option value="whisper" className="bg-slate-900 text-slate-200">OpenAI Whisper (Requires API Key)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">
                  {config.speechMethod === 'browser'
                    ? '⚠️ Requires internet connection. If network error occurs, use Whisper.'
                    : '💰 Whisper charges per minute of audio (~$0.006/min)'}
                </p>
              </div>
            </div>
          </section>

          {/* API Keys Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              API Keys
            </h2>

            <div className="glass-panel rounded-xl p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">OpenAI Key</label>
                <input
                  type="password"
                  name="openaiKey"
                  value={config.openaiKey}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-slate-950/50 border border-white/10 text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-700"
                  placeholder="sk-..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Anthropic Key</label>
                <input
                  type="password"
                  name="anthropicKey"
                  value={config.anthropicKey}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-slate-950/50 border border-white/10 text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-700"
                  placeholder="sk-ant-..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Gemini Key</label>
                <input
                  type="password"
                  name="geminiKey"
                  value={config.geminiKey}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-slate-950/50 border border-white/10 text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-700"
                  placeholder="AIza..."
                />
              </div>
            </div>
          </section>

          {/* Notion Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              Notion Integration
            </h2>

            <div className="glass-panel rounded-xl p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Integration Token</label>
                <input
                  type="password"
                  name="notionToken"
                  value={config.notionToken}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-slate-950/50 border border-white/10 text-slate-200 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-slate-700"
                  placeholder="secret_..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Database ID</label>
                <input
                  type="text"
                  name="notionDatabaseId"
                  value={config.notionDatabaseId}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-slate-950/50 border border-white/10 text-slate-200 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-slate-700"
                  placeholder="32 character id"
                />
              </div>
            </div>
          </section>

          <button
            onClick={handleSave}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Save Settings
          </button>

        </div>
      </div>
    </div>
  );
}
