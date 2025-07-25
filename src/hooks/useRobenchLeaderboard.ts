'use client';
import { useEffect, useState } from 'react';
import type { LeaderboardData } from '@/types';
import { extractRobench } from '@/lib/robench';

const DATA_URLS = {
  '2024b': '/2024b.json',
  '2025a': '/2025a.json'
};

export default function useRobenchLeaderboard(benchmarkVersion: string = '2024b') {
  const [rows, setRows] = useState<ReturnType<typeof extractRobench>[]>([]);
  useEffect(() => {
    const dataUrl = DATA_URLS[benchmarkVersion as keyof typeof DATA_URLS] || DATA_URLS['2024b'];
    fetch(dataUrl)
      .then(r => r.json())
      .then((data: LeaderboardData) =>
        setRows(
          Object.entries(data).map(([model, raw]) => ({
            ...extractRobench(raw),
            model,
          }))
        )
      )
      .catch(() => {
        // Handle missing 2025a.json gracefully
        if (benchmarkVersion === '2025a') {
          setRows([]);
        }
      });
  }, [benchmarkVersion]);
  return rows;
}