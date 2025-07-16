'use client';
import { useEffect, useState } from 'react';
import type { LeaderboardData } from '@/types';
import { extractRobench } from '@/lib/robench';

const DATA_URL = '/results.json';

export default function useRobenchLeaderboard() {
  const [rows, setRows] = useState<ReturnType<typeof extractRobench>[]>([]);
  useEffect(() => {
    fetch(DATA_URL)
      .then(r => r.json())
      .then((data: LeaderboardData) =>
        setRows(
          Object.entries(data).map(([model, raw]) => ({
            ...extractRobench(raw),
            model,
          }))
        )
      );
  }, []);
  return rows;
}}