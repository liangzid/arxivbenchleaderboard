
export type DatasetScore = { acc: number; std: number };
export type ModelResult = Record<string, DatasetScore>;
export type LeaderboardData = Record<string, ModelResult>;

