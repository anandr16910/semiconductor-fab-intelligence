export type ActiveTab = 'overview' | 'wafer' | 'ppa' | 'supply-chain' | 'summit' | 'cloud-cost';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  groundingSources?: Array<{ title: string; url: string }>;
}

export interface WaferDie {
  id: number;
  x: number;
  y: number;
  status: 'good' | 'marginal' | 'defect' | 'edge-exclusion';
  defectType?: string;
  clusterScore: number;
}

export interface PpaParams {
  processNode: '3nm-FinFET' | '2nm-GAAFET' | '1.4nm-CFET';
  voltage: number; // in Volts
  frequency: number; // in GHz
  dieArea: number; // in mm^2
  transistorCountBillion: number;
  packagingTech: 'CoWoS-S' | 'CoWoS-L' | 'Intel-EMIB' | 'Samsung-I-Cube';
  hbmStacks: number;
}

export interface SummitSession {
  id: string;
  time: string;
  title: string;
  speaker: string;
  company: string;
  track: 'Advanced Packaging' | 'High-NA EUV' | 'Neuromorphic Silicon' | 'Energy Efficient HPC';
  status: 'Live Now' | 'Upcoming' | 'Completed';
  room: string;
}

export interface FabMetric {
  date: string;
  yieldRate: number;
  defectDensity: number;
  waferThroughput: number;
  powerKWPerWafer: number;
}

export interface CloudCostConfig {
  monthlyUsers: number;
  queriesPerUser: number;
  avgInputTokens: number;
  avgOutputTokens: number;
  percentSearchGrounded: number;
  hostingTier: 'free' | 'managed-gcp';
}
