'use client';
import { useEffect, useState } from 'react';
import type { LeaderboardData } from '@/types';

const DATA_URL = '/results.json';

export default function useLeaderboard() {
  const [data, setData] = useState<LeaderboardData>({});
  useEffect(() => {
    fetch(DATA_URL)
      .then(r => r.json())
      .then((data: LeaderboardData) => setData(data));
  }, []);
  return data;
}