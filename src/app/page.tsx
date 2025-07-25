'use client';
import { useState } from 'react';
import RobenchTable from '@/components/RobenchTable';
import Toolbar from '@/components/Toolbar';
import TabNavigation from '@/components/TabNavigation';
import RobenchScpRadarCharts from '@/components/RobenchScpRadarCharts';

export default function Home() {
  const [activeTab, setActiveTab] = useState('overall');

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
            🚀 ArxivRoll Leaderboard
          </h1>
          <p className="text-xl text-slate-700 dark:text-slate-300 mb-2">
            <em>"Fresh from ArXiv, served once, and never reheated."</em>
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-4xl mx-auto mb-6">
            📌 <strong>TL;DR:</strong> ArxivRoll tells you <strong>"How much of your score is real, and how much is cheating?"</strong>
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">📊 What is ArxivRoll?</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              ArxivRoll is a <strong>dynamic, one-time-pad-inspired evaluation framework</strong> 🛡️ that <strong>audits</strong> how much Large Language Models (LLMs) <strong>over-estimate</strong> their true abilities on public benchmarks.
            </p>
            
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">⚠️ Key Problems ArxivRoll Tackles</h3>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-4">
              <li><strong>📥 Data contamination:</strong> Public benchmarks (MMLU, GSM8K, etc.) often sneak into pre-training data → inflated scores.</li>
              <li><strong>🎯 Biased overtraining:</strong> Developers may "teach to the test," tuning models only on popular domains.</li>
              <li><strong>🕵️ Transparency crisis:</strong> Private leaderboards (SEAL, Chatbot Arena) are opaque & hard to reproduce.</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">🧪 How ArxivRollBench Works</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">1. 🌱 Fresh Test Cases</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Every 6 months we scrape <strong>latest ArXiv preprints</strong> (Apr–Sep 2024 → ArxivRollBench-2024b).<br/>
                  <span className="text-sm text-slate-600 dark:text-slate-400">🏷️ Domains: CS, Math, Physics, Bio, Econ, Finance, Statistics, EE.</span>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">2. 🎲 SCP Tasks (Sequencing, Cloze, and Prediction)</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  Articles are auto-converted into three symbolic tasks:
                </p>
                <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
                  <li><strong>Sequencing 🔀</strong> → Re-order shuffled sentences</li>
                  <li><strong>Cloze 🕳️</strong> → Fill masked sentences</li>
                  <li><strong>Prediction 🔮</strong> → Choose the correct next sentence</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">3. 📈 Rugged Scores (RS)</h3>
                <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
                  <li><strong>RS-I 🧪</strong> = % inflation on public vs. private benchmarks</li>
                  <li><strong>RS-II ⚖️</strong> = performance variance across domains (biased training detector)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-cyan-900/20 dark:to-purple-900/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">🌟 Unique Features</h2>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
              <li><strong>🕐 One-Time Use:</strong> private benchmarks are <strong>used once</strong>, then <strong>expired & open-sourced</strong></li>
              <li><strong>✅ High Quality:</strong> filtered for length, complexity, minimal math/tables</li>
              <li><strong>🌍 Broad Coverage:</strong> 8 domains, ~100-word contexts, 1k+ samples per domain</li>
            </ul>
          </div>
        </div>

        <Toolbar />
        <div className="flex justify-center mt-8">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <RobenchTable activeTab={activeTab} />
        
        <div className="mt-12">
          <RobenchScpRadarCharts />
        </div>
      </div>
    </main>
  );
}