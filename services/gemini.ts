import { GoogleGenAI, Type } from "@google/genai";
import { Dataset, EDASummary, ArchitecturePlan, ModelResult } from "../types";

const getAI = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key is missing. Please check your environment variables.");
    }
    return new GoogleGenAI({ apiKey });
};

// Switching both to Flash to avoid 'Resource Exhausted' / 'Quota Exceeded' errors 
// which are common with the Pro model on free/starter tiers.
const MODEL_FAST = 'gemini-3-flash-preview';
const MODEL_SMART = 'gemini-3-flash-preview'; 

// Helper to summarize dataset for prompt context
const getDatasetContext = (dataset: Dataset): string => {
  const columnInfo = dataset.columns.map(c => 
    `- ${c.name} (${c.type}): ${c.unique} unique, ${c.missing} missing. Sample: ${JSON.stringify(c.sample)}`
  ).join('\n');
  return `Dataset Name: ${dataset.name}\nRows: ${dataset.rowCount}\nColumns:\n${columnInfo}`;
};

const handleGenAIError = (error: any) => {
    console.error("Gemini API Error:", error);
    const msg = error.message || '';
    if (msg.includes('429') || msg.includes('Quota exceeded') || msg.includes('RESOURCE_EXHAUSTED')) {
        throw new Error("API Quota Exceeded. The AI model is currently overloaded or your key has hit its limit. Please try again in a minute.");
    }
    throw error;
};

export const generateEDAAnalysis = async (dataset: Dataset): Promise<EDASummary> => {
  const ai = getAI();
  const context = getDatasetContext(dataset);
  
  try {
    const response = await ai.models.generateContent({
        model: MODEL_FAST,
        contents: `Perform an automated Exploratory Data Analysis (EDA) on this dataset summary:\n${context}\n\nProvide: 
        1. A text summary of the data quality.
        2. Potential correlations or interesting patterns.
        3. Outlier detection strategy.
        4. 3-4 specific recommendations for cleaning or feature engineering.`,
        config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
            summary: { type: Type.STRING },
            correlations: { type: Type.STRING },
            outliers: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        }
        }
    });
    return JSON.parse(response.text || '{}') as EDASummary;
  } catch (error) {
      handleGenAIError(error);
      throw error;
  }
};

export const generateArchitecturePlan = async (dataset: Dataset): Promise<ArchitecturePlan> => {
  const ai = getAI();
  const context = getDatasetContext(dataset);

  try {
    const response = await ai.models.generateContent({
        model: MODEL_SMART, 
        contents: `You are a Senior Data Architect. Design a production-grade ingestion and serving pipeline for this data:\n${context}\n
        
        1. Design a PostgreSQL schema (SQL CREATE TABLE) optimized for this data.
        2. specific Redis caching strategy (Keys, TTL) for an API serving this data.
        3. Failure handling strategy for the ingestion pipeline (Retry logic, Dead Letter Queues).
        4. A REST API Specification (OpenAPI-like summary) for exposing this data.`,
        config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
            dbSchema: { type: Type.STRING },
            cachingStrategy: { type: Type.STRING },
            failureHandling: { type: Type.STRING },
            apiSpec: { type: Type.STRING }
            }
        }
        }
    });

    const text = response.text;
    if (!text) throw new Error("Model returned empty response");
    
    return JSON.parse(text) as ArchitecturePlan;
  } catch (error) {
    handleGenAIError(error);
    throw error;
  }
};

export const trainModelSimulation = async (dataset: Dataset, targetColumn: string): Promise<ModelResult> => {
  const ai = getAI();
  const context = getDatasetContext(dataset);

  try {
    const response = await ai.models.generateContent({
        model: MODEL_SMART,
        contents: `Act as an AutoML system. The user wants to predict the column '${targetColumn}' based on the other features in this dataset:\n${context}\n
        
        1. Select the best algorithm (e.g., Random Forest, XGBoost, Linear Regression).
        2. Estimate the accuracy and F1 score based on the data characteristics (make a realistic estimation).
        3. List the most important features.
        4. Write a Python code snippet using scikit-learn/pandas to train this model.`,
        config: {
        // Removed thinkingConfig as it's primarily for 2.5/3 Pro/Thinking models and can cause issues on Flash if not supported in preview
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
            algorithm: { type: Type.STRING },
            accuracy: { type: Type.NUMBER },
            f1Score: { type: Type.NUMBER },
            latency: { type: Type.STRING },
            features: { type: Type.ARRAY, items: { type: Type.STRING } },
            codeSnippet: { type: Type.STRING }
            }
        }
        }
    });
    return JSON.parse(response.text || '{}') as ModelResult;
  } catch (error) {
      handleGenAIError(error);
      throw error;
  }
};