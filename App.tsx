import React, { useState } from 'react';
import { Dataset, AppView } from './types';
import IngestPanel from './components/IngestPanel';
import Dashboard from './components/Dashboard';
import ModelLab from './components/ModelLab';
import SystemDesign from './components/SystemDesign';

const App: React.FC = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.INGEST);

  const handleDatasetLoaded = (data: Dataset) => {
    setDataset(data);
    setCurrentView(AppView.DASHBOARD);
  };

  const renderView = () => {
    if (!dataset) return <IngestPanel onDatasetLoaded={handleDatasetLoaded} />;
    
    switch (currentView) {
      case AppView.INGEST:
         // If they go back to ingest, we reset
         return <IngestPanel onDatasetLoaded={handleDatasetLoaded} />;
      case AppView.DASHBOARD:
        return <Dashboard dataset={dataset} />;
      case AppView.MODEL_LAB:
        return <ModelLab dataset={dataset} />;
      case AppView.SYSTEM_DESIGN:
        return <SystemDesign dataset={dataset} />;
      default:
        return <Dashboard dataset={dataset} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-primary-500/30">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-400 to-indigo-600 flex items-center justify-center">
            <i className="fas fa-atom text-white text-sm"></i>
          </div>
          <h1 className="font-bold text-lg tracking-tight">Data Foundry</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setCurrentView(AppView.INGEST)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${currentView === AppView.INGEST ? 'bg-primary-600/10 text-primary-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <i className="fas fa-upload w-5"></i> Ingest
          </button>
          
          <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Pipeline</div>

          <button 
            disabled={!dataset}
            onClick={() => setCurrentView(AppView.DASHBOARD)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${!dataset ? 'opacity-50 cursor-not-allowed text-slate-600' : 
                currentView === AppView.DASHBOARD ? 'bg-primary-600/10 text-primary-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <i className="fas fa-chart-line w-5"></i> EDA & Insights
          </button>

          <button 
             disabled={!dataset}
             onClick={() => setCurrentView(AppView.MODEL_LAB)}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${!dataset ? 'opacity-50 cursor-not-allowed text-slate-600' : 
                currentView === AppView.MODEL_LAB ? 'bg-primary-600/10 text-primary-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <i className="fas fa-flask w-5"></i> Model Lab
          </button>

           <button 
             disabled={!dataset}
             onClick={() => setCurrentView(AppView.SYSTEM_DESIGN)}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${!dataset ? 'opacity-50 cursor-not-allowed text-slate-600' : 
                currentView === AppView.SYSTEM_DESIGN ? 'bg-primary-600/10 text-primary-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <i className="fas fa-server w-5"></i> Architecture
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
           {dataset ? (
             <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <div className="overflow-hidden">
                    <div className="text-xs text-slate-400 truncate">Active Dataset</div>
                    <div className="text-sm font-semibold truncate text-slate-200">{dataset.name}</div>
                </div>
             </div>
           ) : (
            <div className="text-xs text-slate-500 text-center">No dataset loaded</div>
           )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden bg-grid-slate-900/[0.04]">
        {renderView()}
      </main>
    </div>
  );
};

export default App;