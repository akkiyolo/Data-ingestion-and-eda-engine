import React, { useEffect, useState } from 'react';
import { Dataset, ArchitecturePlan } from '../types';
import { generateArchitecturePlan } from '../services/gemini';

interface SystemDesignProps {
  dataset: Dataset;
}

const SystemDesign: React.FC<SystemDesignProps> = ({ dataset }) => {
  const [plan, setPlan] = useState<ArchitecturePlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await generateArchitecturePlan(dataset);
        setPlan(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [dataset]);

  if (loading) {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <i className="fas fa-microchip fa-spin text-4xl text-primary-500 mb-4"></i>
            <p className="text-slate-400">Architecting scalable solution...</p>
        </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto scrollbar-hide">
       <h2 className="text-2xl font-bold text-white mb-6">System Architecture & Deployment</h2>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Database Schema */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-200"><i className="fas fa-database text-blue-500 mr-2"></i>PostgreSQL Schema</h3>
                  <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded">Generated</span>
              </div>
              <div className="p-0 flex-1 relative group">
                  <pre className="text-xs text-blue-100 font-mono p-4 overflow-x-auto h-full min-h-[200px]">
                      {plan?.dbSchema}
                  </pre>
              </div>
          </div>

           {/* Caching Strategy */}
           <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-200"><i className="fas fa-memory text-red-500 mr-2"></i>Redis Caching Strategy</h3>
              </div>
              <div className="p-4 text-sm text-slate-300 leading-relaxed">
                  {plan?.cachingStrategy}
              </div>
          </div>

           {/* Failure Handling */}
           <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-200"><i className="fas fa-shield-virus text-green-500 mr-2"></i>Resilience & Failure Handling</h3>
              </div>
              <div className="p-4 text-sm text-slate-300 leading-relaxed">
                  {plan?.failureHandling}
              </div>
          </div>

          {/* API Spec */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-200"><i className="fas fa-network-wired text-purple-500 mr-2"></i>REST API Specification</h3>
                  <span className="text-xs text-slate-500">OpenAPI 3.0 Draft</span>
              </div>
              <div className="p-0 flex-1">
                  <pre className="text-xs text-purple-100 font-mono p-4 overflow-x-auto h-full min-h-[200px]">
                      {plan?.apiSpec}
                  </pre>
              </div>
          </div>
       </div>
    </div>
  );
};

export default SystemDesign;