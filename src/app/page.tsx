'use client';
import { useState } from 'react';
import RobenchTable from '@/components/RobenchTable';
import Toolbar from '@/components/Toolbar';
import TabNavigation from '@/components/TabNavigation';

export default function Home() {
  const [activeTab, setActiveTab] = useState('overall');

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          ROBENCH2024B Leaderboard
        </h1>
        <Toolbar />
        <div className="flex justify-center mt-8">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <RobenchTable activeTab={activeTab} />
      </div>
    </main>
  );
}