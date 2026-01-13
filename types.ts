export interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  missing: number;
  unique: number;
  sample: any[];
}

export interface Dataset {
  name: string;
  rowCount: number;
  columns: DataColumn[];
  raw: any[]; // Array of objects
}

export interface EDASummary {
  summary: string;
  correlations: string;
  outliers: string;
  recommendations: string[];
}

export interface ArchitecturePlan {
  dbSchema: string;
  cachingStrategy: string;
  failureHandling: string;
  apiSpec: string;
}

export interface ModelResult {
  algorithm: string;
  accuracy: number;
  f1Score: number;
  latency: string;
  features: string[];
  codeSnippet: string;
}

export enum AppView {
  INGEST = 'INGEST',
  DASHBOARD = 'DASHBOARD',
  MODEL_LAB = 'MODEL_LAB',
  SYSTEM_DESIGN = 'SYSTEM_DESIGN',
}