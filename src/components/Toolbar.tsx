// src/components/Toolbar.tsx
'use client';
import { useLB } from '@/store/leaderboard';
import { Search, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Toolbar() {
  const { search, setSearch } = useLB();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem('theme') === 'dark';
    setDark(stored);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark, isClient]);

  if (!isClient) return null;

  return (
    <div className="flex items-center gap-4 justify-center mt-6">
      <div className="relative">
        <Search className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Search model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/10 dark:bg-black/20 rounded-full px-4 py-2 pl-10 outline-none focus:ring-2 ring-cyan-400"
        />
      </div>

    </div>
  );
}
