import React, { useEffect, useState } from 'react';
import { Dataset, EDASummary } from '../types';
import { generateEDAAnalysis } from '../services/gemini';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

interface DashboardProps {
  dataset: Dataset;
}

const Dashboard: React.FC<DashboardProps> = ({ dataset }) => {
  const [analysis, setAnalysis] = useState<EDASummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEDA = async () => {
      try {
        const result = await generateEDAAnalysis(dataset);
        setAnalysis(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEDA();
  }, [dataset]);

  // Prepare data for charts - take the first numerical column
  const numCol = dataset.columns.find(c => c.type === 'number');
  const chartData = numCol ? dataset.raw.slice(0, 50).map((row, i) => ({
    index: i,
    value: row[numCol.name]
  })) : [];

  return (
    <div className="p-6 h-full overflow-y-auto scrollbar-hide">
      <header className="mb-6 flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-white mb-1">{dataset.name}</h2>
            <div className="flex gap-4 text-sm text-slate-400">
                <span><i className="fas fa-table mr-2"></i>{dataset.rowCount.toLocaleString()} Rows</span>
                <span><i className="fas fa-columns mr-2"></i>{dataset.columns.length} Columns</span>
            </div>
        </div>
        <div className="bg-primary-900/30 text-primary-400 px-3 py-1 rounded-full text-xs border border-primary-500/30">
            Automated EDA Active
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Analysis Card */}
        <div className="lg:col-span-2 space-y-6">
             <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <i className="fas fa-magic text-purple-400"></i> AI Data Narrative
                </h3>
                {loading ? (
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-800 rounded w-full"></div>
                        <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-slate-300 leading-relaxed">{analysis?.summary}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                             <div className="bg-slate-950 p-4 rounded-lg">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Correlations</h4>
                                <p className="text-sm text-slate-300">{analysis?.correlations}</p>
                             </div>
                             <div className="bg-slate-950 p-4 rounded-lg">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Outliers</h4>
                                <p className="text-sm text-slate-300">{analysis?.outliers}</p>
                             </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Distribution: {numCol?.name || 'N/A'}</h3>
                <div className="h-64 w-full">
                    {numCol ? (
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="index" stroke="#94a3b8" fontSize={12} tick={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                    itemStyle={{ color: '#38bdf8' }}
                                />
                                <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">No numerical data found</div>
                    )}
                </div>
            </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Column Metadata</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide">
                    {dataset.columns.map((col, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg group hover:bg-slate-800 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-slate-200 font-mono text-sm">{col.name}</span>
                                <span className="text-xs text-slate-500">{col.type}</span>
                            </div>
                            <div className="text-right">
                                <div className={`text-xs ${col.missing > 0 ? 'text-red-400' : 'text-green-500'}`}>
                                    {col.missing > 0 ? `${col.missing} missing` : 'Complete'}
                                </div>
                                <div className="text-xs text-slate-600">{col.unique} unique</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">AI Recommendations</h3>
                {loading ? (
                    <div className="text-slate-500 text-sm">Analyzing recommendations...</div>
                ) : (
                    <ul className="space-y-2">
                        {analysis?.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm text-slate-300 flex gap-2">
                                <span className="text-primary-500 mt-1">•</span>
                                {rec}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;