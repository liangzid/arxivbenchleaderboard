import type { DatasetScore, ModelResult } from '@/types';

const ROBENCH_PREFIX = 'robench2024b';

export interface RobenchGroup {
  scenario: string;          // "cs" | "math" ...
  s: number;                 // 构造类别 S 的 acc
  c: number;
  p: number;
}

export interface RobenchRow {
  model: string;
  avgS: number;
  avgC: number;
  avgP: number;
  avgOverall: number;
  groups: RobenchGroup[];    // 明细
}

export function extractRobench(raw: ModelResult): RobenchRow {
  const groups: Record<string, Partial<Record<'s' | 'c' | 'p', number>>> = {};

  Object.entries(raw).forEach(([k, v]) => {
    if (!k.startsWith(ROBENCH_PREFIX)) return;
    // k = "robench2024b_all_setcsSCP-s"
    const lastDash = k.lastIndexOf('-');
    const construct = k.slice(lastDash + 1) as 's' | 'c' | 'p';
    const scenario = k
      .slice(ROBENCH_PREFIX.length + 1, lastDash)   // "all_setcsSCP"
      .replace(/^all_set/, '')                     // "csSCP" -> 只要 "cs"
      .replace(/SCP$/, '')                        // "cs"

    if (!groups[scenario]) groups[scenario] = {};
    groups[scenario]![construct] = v.acc;
  });

  // 转数组
  const groupList = Object.entries(groups).map(([scenario, obj]) => ({
    scenario,
    s: obj.s ?? 0,
    c: obj.c ?? 0,
    p: obj.p ?? 0,
  }));

  // 计算三列平均分
  const avgS = groupList.reduce((s, g) => s + g.s, 0) / groupList.length || 0;
  const avgC = groupList.reduce((s, g) => g.c + s, 0) / groupList.length || 0;
  const avgP = groupList.reduce((s, g) => g.p + s, 0) / groupList.length || 0;
  const avgOverall = (avgS + avgC + avgP) / 3;

return { model: '', ...arguments[1], avgS, avgC, avgP, avgOverall, groups: groupList };
}
