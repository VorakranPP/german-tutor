import React, { useState, useEffect } from 'react';

export default function APIUsageTracker() {
  const [model, setModel] = useState('Opus 4.8');
  const [effort, setEffort] = useState('high');
  const [contextUsage, setContextUsage] = useState(27);
  const [tokensUsed, setTokensUsed] = useState(12450);
  const [totalTokens, setTotalTokens] = useState(46000);

  // Simulated real-time usage update
  useEffect(() => {
    const interval = setInterval(() => {
      setContextUsage(prev => {
        const newValue = prev + Math.random() * 2;
        return Math.min(newValue, 100);
      });
      setTokensUsed(prev => prev + Math.floor(Math.random() * 50));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const costPerMTok = model === 'Opus 4.8' ? 15 : model === 'Sonnet 4' ? 3 : 0.3;
  const estimatedCost = (tokensUsed / 1000000) * costPerMTok;

  const models = ['Opus 4.8', 'Sonnet 4', 'Haiku 3.5'];
  const efforts = ['low', 'medium', 'high'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mb-2">
            API Usage Tracker
          </h1>
          <p className="text-slate-400 text-sm">Monitor your Claude API consumption</p>
        </div>

        {/* Model & Effort Selectors */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Model</label>
            <div className="flex gap-2">
              {models.map(m => (
                <button
                  key={m}
                  onClick={() => setModel(m)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    model === m
                      ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {m.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Effort</label>
            <div className="flex gap-2">
              {efforts.map(e => (
                <button
                  key={e}
                  onClick={() => setEffort(e)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    effort === e
                      ? 'bg-orange-500 text-slate-900 shadow-lg shadow-orange-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Usage Card */}
        <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-6 overflow-hidden group hover:border-slate-600/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Context Usage</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                    {contextUsage.toFixed(1)}%
                  </span>
                  <span className="text-slate-500 text-lg">of {totalTokens.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 rounded-full transition-all duration-500 shadow-lg shadow-orange-500/50"
                style={{ width: `${contextUsage}%` }}
              />
              {contextUsage > 10 && (
                <div className="absolute inset-0 opacity-50">
                  <div
                    className="h-full w-1 bg-white/40 blur-sm"
                    style={{ left: `${contextUsage - 1}%` }}
                  />
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                <p className="text-slate-500 text-xs mb-1 uppercase tracking-wide">Tokens Used</p>
                <p className="text-2xl font-bold text-amber-300">{tokensUsed.toLocaleString()}</p>
                <p className="text-slate-400 text-xs mt-1">of {totalTokens.toLocaleString()}</p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                <p className="text-slate-500 text-xs mb-1 uppercase tracking-wide">Est. Cost</p>
                <p className="text-2xl font-bold text-orange-300">${estimatedCost.toFixed(3)}</p>
                <p className="text-slate-400 text-xs mt-1">{costPerMTok}¢ per MTok</p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                <p className="text-slate-500 text-xs mb-1 uppercase tracking-wide">Model</p>
                <p className="text-2xl font-bold text-blue-300">{model}</p>
                <p className="text-slate-400 text-xs mt-1">{effort} effort</p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Bars */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-300">Input Tokens</span>
              <span className="text-xs text-slate-500">8,234 tokens</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-300">Output Tokens</span>
              <span className="text-xs text-slate-500">4,216 tokens</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-slate-500 bg-slate-900/30 rounded-lg p-4 border border-slate-700/30">
          <p>Live tracking enabled • Last updated: just now</p>
        </div>
      </div>
    </div>
  );
}
