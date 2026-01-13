import React, { useState } from 'react';
import { Dataset, ModelResult } from '../types';
import { trainModelSimulation } from '../services/gemini';

interface ModelLabProps {
  dataset: Dataset;
}

const ModelLab: React.FC<ModelLabProps> = ({ dataset }) => {
  const [target, setTarget] = useState<string>('');
  const [result, setResult] = useState<ModelResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrain = async () => {
    if (!target) return;
    setLoading(true);
    try {
      const res = await trainModelSimulation(dataset, target);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto scrollbar-hide">
      <h2 className="text-2xl font-bold text-white mb-6">AutoML Laboratory</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 h-fit">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Training Config</h3>
            
            <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">Target Variable</label>
                <select 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-primary-500 focus:outline-none"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                >
                    <option value="">Select a column to predict...</option>
                    {dataset.columns.map(c => (
                        <option key={c.name} value={c.name}>{c.name} ({c.type})</option>
                    ))}
                </select>
            </div>

            <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">Objective</label>
                <div className="flex gap-2">
                    <span className="bg-primary-900/50 text-primary-400 text-xs px-2 py-1 rounded border border-primary-500/30">Auto-Detect</span>
                    <span className="bg-slate-800 text-slate-500 text-xs px-2 py-1 rounded">Classification</span>
                    <span className="bg-slate-800 text-slate-500 text-xs px-2 py-1 rounded">Regression</span>
                </div>
            </div>

            <button 
                onClick={handleTrain}
                disabled={loading || !target}
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all
                    ${loading || !target 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                        : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/20'}`}
            >
                {loading ? (
                    <><i className="fas fa-circle-notch fa-spin"></i> Training...</>
                ) : (
                    <><i className="fas fa-play"></i> Start Experiment</>
                )}
            </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
            {result ? (
                <div className="space-y-6 animate-fade-in">
                    {/* Metrics Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                            <div className="text-slate-400 text-xs uppercase font-bold mb-1">Algorithm</div>
                            <div className="text-primary-400 text-lg font-mono font-bold truncate" title={result.algorithm}>{result.algorithm}</div>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                            <div className="text-slate-400 text-xs uppercase font-bold mb-1">Accuracy Estimate</div>
                            <div className="text-green-400 text-2xl font-mono font-bold">{(result.accuracy * 100).toFixed(1)}%</div>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                            <div className="text-slate-400 text-xs uppercase font-bold mb-1">Inference Latency</div>
                            <div className="text-slate-200 text-xl font-mono">{result.latency}</div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <h3 className="text-md font-semibold text-slate-200 mb-4">Top Feature Importance</h3>
                        <div className="flex flex-wrap gap-2">
                            {result.features.map((f, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300 border border-slate-700">
                                    {f}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Code Snippet */}
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 relative group">
                        <div className="absolute top-4 right-4 text-slate-500 text-xs">Python Export</div>
                        <h3 className="text-md font-semibold text-slate-200 mb-4">Generated Training Pipeline</h3>
                        <pre className="text-xs text-slate-300 font-mono overflow-x-auto p-4 bg-slate-900 rounded-lg border border-slate-800">
                            {result.codeSnippet}
                        </pre>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl p-12">
                    <i className="fas fa-robot text-4xl mb-4 text-slate-700"></i>
                    <p>Select a target variable and run an experiment to see results.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ModelLab;