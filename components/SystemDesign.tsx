import React, { useEffect, useState } from 'react';
import { Dataset, ArchitecturePlan } from '../types';
import { generateArchitecturePlan } from '../services/gemini';

interface SystemDesignProps {
  dataset: Dataset;
}

const SystemDesign: React.FC<SystemDesignProps> = ({ dataset }) => {
  const [plan, setPlan] = useState<ArchitecturePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await generateArchitecturePlan(dataset);
        if (!res || Object.keys(res).length === 0) {
            throw new Error("Received empty response from AI model.");
        }
        setPlan(res);
      } catch (e: any) {
        console.error("System Design Generation Error:", e);
        setError(e.message || "Failed to generate system architecture.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [dataset]);

  if (loading) {
    return (
        <div className="h-full flex flex-col items-center justify-center animate-pulse">
            <i className="fas fa-microchip fa-spin text-5xl text-primary-500 mb-6"></i>
            <h2 className="text-xl font-semibold text-slate-200">Designing Architecture...</h2>
            <p className="text-slate-400 mt-2">Analyzing data patterns to generate optimal schema and API specs.</p>
        </div>
    );
  }

  if (error) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-exclamation-triangle text-2xl text-red-500"></i>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Generation Failed</h2>
              <p className="text-slate-400 max-w-md mb-6">{error}</p>
              <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                  Retry
              </button>
          </div>
      )
  }

  return (
    <div className="p-6 h-full overflow-y-auto scrollbar-hide">
       <h2 className="text-2xl font-bold text-white mb-6">System Architecture & Deployment</h2>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Database Schema */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col min-h-[300px]">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-200"><i className="fas fa-database text-blue-500 mr-2"></i>PostgreSQL Schema</h3>
                  <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded">Generated</span>
              </div>
              <div className="p-0 flex-1 relative group">
                  <pre className="text-xs text-blue-100 font-mono p-4 overflow-x-auto h-full w-full absolute inset-0">
                      {plan?.dbSchema || "-- No schema generated --"}
                  </pre>
              </div>
          </div>

           {/* Caching Strategy */}
           <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col min-h-[300px]">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-200"><i className="fas fa-memory text-red-500 mr-2"></i>Redis Caching Strategy</h3>
              </div>
              <div className="p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {plan?.cachingStrategy || "-- No strategy generated --"}
              </div>
          </div>

           {/* Failure Handling */}
           <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col min-h-[300px]">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-200"><i className="fas fa-shield-virus text-green-500 mr-2"></i>Resilience & Failure Handling</h3>
              </div>
              <div className="p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {plan?.failureHandling || "-- No strategy generated --"}
              </div>
          </div>

          {/* API Spec */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col min-h-[300px]">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-200"><i className="fas fa-network-wired text-purple-500 mr-2"></i>REST API Specification</h3>
                  <span className="text-xs text-slate-500">OpenAPI 3.0 Draft</span>
              </div>
              <div className="p-0 flex-1 relative">
                  <pre className="text-xs text-purple-100 font-mono p-4 overflow-x-auto h-full w-full absolute inset-0">
                      {plan?.apiSpec || "-- No spec generated --"}
                  </pre>
              </div>
          </div>
       </div>
    </div>
  );
};

export default SystemDesign;