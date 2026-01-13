import React, { useState } from 'react';
import { parseCSV, analyzeColumns } from '../utils';
import { Dataset } from '../types';

interface IngestPanelProps {
  onDatasetLoaded: (dataset: Dataset) => void;
}

const IngestPanel: React.FC<IngestPanelProps> = ({ onDatasetLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const processFile = async (file: File) => {
    setLoading(true);
    const text = await file.text();
    const rawData = parseCSV(text);
    const columns = analyzeColumns(rawData);
    
    const dataset: Dataset = {
      name: file.name,
      rowCount: rawData.length,
      columns,
      raw: rawData
    };

    setTimeout(() => {
        onDatasetLoaded(dataset);
        setLoading(false);
    }, 800); // Fake loader for effect
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 animate-fade-in">
      <div className="max-w-xl w-full text-center mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-500 mb-4">
          Data Ingestion Engine
        </h1>
        <p className="text-slate-400">
          Upload raw CSV data. The system will automatically detect schema, 
          compute statistics, and prepare the dataset for the AI pipeline.
        </p>
      </div>

      <div
        className={`w-full max-w-2xl h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer
          ${isDragging 
            ? 'border-primary-500 bg-primary-500/10' 
            : 'border-slate-700 hover:border-slate-500 bg-slate-900'
          }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {loading ? (
            <div className="flex flex-col items-center gap-4">
                 <i className="fas fa-circle-notch fa-spin text-4xl text-primary-500"></i>
                 <span className="text-slate-300 font-mono">Parsing bytes & Analyzing Schema...</span>
            </div>
        ) : (
            <>
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-primary-400">
                <i className="fas fa-cloud-upload-alt text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-slate-200">Drag & Drop CSV File</h3>
                <p className="text-sm text-slate-500 mt-2">or click to browse</p>
                <input 
                    type="file" 
                    accept=".csv"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
                    }}
                />
            </>
        )}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-2xl">
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-center">
              <i className="fas fa-bolt text-yellow-500 mb-2"></i>
              <div className="text-sm text-slate-400">Fast Ingest</div>
          </div>
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-center">
              <i className="fas fa-shield-alt text-green-500 mb-2"></i>
              <div className="text-sm text-slate-400">Secure Parse</div>
          </div>
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-center">
              <i className="fas fa-brain text-purple-500 mb-2"></i>
              <div className="text-sm text-slate-400">Auto Schema</div>
          </div>
      </div>
    </div>
  );
};

export default IngestPanel;