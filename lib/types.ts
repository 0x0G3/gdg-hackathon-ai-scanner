import { Timestamp } from "firebase/firestore";

export type ScanStatus = 
  | 'pending' 
  | 'scraping' 
  | 'processing_chunks' 
  | 'reducing' 
  | 'completed' 
  | 'failed';

export interface ScanChunk {
  pageUrl: string;
  contentSummary: string;
  mapAnalysis: unknown;
}

export interface ResourceLink {
  label: string;
  url: string;
  type: 'github' | 'smithery' | 'npm' | 'glama' | 'generic';
}

export interface Recommendation {
  title: string;
  description: string;
  value: string;
  category: 'agents' | 'mcp' | 'skills' | 'workflows';
  links: ResourceLink[];
}

export interface FinalReport {
  score: number;
  summary: string;
  recommendations: Recommendation[];
}

export interface Scan {
  id: string;
  url: string;
  status: ScanStatus;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  lighthouseSummary: unknown;
  chunks: ScanChunk[];
  finalReport: FinalReport | null;
}