import type { LeaderboardData } from '@/types';

export interface Row {
  model: string;
  avg: number;
  scores: Record<string, number>;
}

export default function prepareRows(data: LeaderboardData): Row[] {
  return Object.entries(data).map(([model, d]) => {
    const scores = Object.fromEntries(
      Object.entries(d).map(([ds, v]) => [ds, v.acc])
    );
    const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;
    return { model, avg, scores };
  });
}