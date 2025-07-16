import type { DatasetScore, ModelResult } from '@/types';

const ROBENCH_PREFIX = 'robench2024b';

interface ScenarioScores {
  acc: number;
  std: number;
}

export interface RobenchGroup {
  scenario: string;
  s: ScenarioScores;
  c: ScenarioScores;
  p: ScenarioScores;
}

export interface RobenchRow {
  model: string;
  avgS: { acc: number; std: number };
  avgC: { acc: number; std: number };
  avgP: { acc: number; std: number };
  avgOverall: { acc: number; std: number };
  groups: RobenchGroup[];
}

export function extractRobench(raw: ModelResult): RobenchRow {
  const groups: Record<string, {
    s: { acc: number; std: number };
    c: { acc: number; std: number };
    p: { acc: number; std: number };
  }> = {};

  Object.entries(raw).forEach(([k, v]) => {
    if (!k.startsWith(ROBENCH_PREFIX)) return;
    // k = "robench2024b_all_setcsSCP-s"
    const lastDash = k.lastIndexOf('-');
    const construct = k.slice(lastDash + 1) as 's' | 'c' | 'p';
    const scenario = k
      .slice(ROBENCH_PREFIX.length + 1, lastDash)   // "all_setcsSCP"
      .replace(/^all_set/, '')                     // "csSCP" -> 只要 "cs"
      .replace(/SCP$/, '')                        // "cs"

    if (!groups[scenario]) {
      groups[scenario] = {
        s: { acc: 0, std: 0 },
        c: { acc: 0, std: 0 },
        p: { acc: 0, std: 0 },
      };
    }
    groups[scenario]![construct] = { acc: v.acc, std: v.std };
  });

  // 转数组
  const groupList = Object.entries(groups).map(([scenario, obj]) => ({
    scenario,
    s: obj.s,
    c: obj.c,
    p: obj.p,
  }));

  // 计算三列平均分
  const avgS = {
    acc: groupList.reduce((s, g) => s + g.s.acc, 0) / groupList.length || 0,
    std: groupList.reduce((s, g) => s + g.s.std, 0) / groupList.length || 0,
  };
  const avgC = {
    acc: groupList.reduce((s, g) => s + g.c.acc, 0) / groupList.length || 0,
    std: groupList.reduce((s, g) => s + g.c.std, 0) / groupList.length || 0,
  };
  const avgP = {
    acc: groupList.reduce((s, g) => s + g.p.acc, 0) / groupList.length || 0,
    std: groupList.reduce((s, g) => s + g.p.std, 0) / groupList.length || 0,
  };
  const avgOverall = {
    acc: (avgS.acc + avgC.acc + avgP.acc) / 3,
    std: (avgS.std + avgC.std + avgP.std) / 3,
  };

  return { model: '', ...arguments[1], avgS, avgC, avgP, avgOverall, groups: groupList };
}
