'use client';
import { useState } from 'react';
import RobenchTable from '@/components/RobenchTable';
import Toolbar from '@/components/Toolbar';
import TabNavigation from '@/components/TabNavigation';
import RobenchScpRadarCharts from '@/components/RobenchScpRadarCharts';

export default function Home() {
  const [activeTab, setActiveTab] = useState('overall');
  const [activeBenchmark, setActiveBenchmark] = useState('2024b');
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

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">👩‍💻 How Do I Evaluate my Model?</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              The most easy way is to use <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">llm-eval-harness</code>
            </p>
            
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Just install <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">lm-eval</code> from <a href="https://github.com/AstapleDSE/lm-eval-with-ArxivRollBench" className="text-cyan-500 hover:text-cyan-400 underline" target="_blank" rel="noopener noreferrer">here</a>,
              and then evaluate a huggingface model with:
            </p>

            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm"><code>{`lm_eval --model hf --model_args pretrained="your-model-name",parallelize=True --tasks arxivrollbench2024b --log_samples --output_path your-log-path`}</code></pre>
            </div>

            <p className="text-slate-700 dark:text-slate-300 mt-4">
              You can also evaluate LLM via APIs with examples detailed in <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">./eval/</code>.
            </p>
          </div>
        </div>





<div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-1 shadow-lg inline-flex">
            <button
              onClick={() => setActiveBenchmark('2024b')}
              className={`px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeBenchmark === '2024b'
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400'
              }`}
            >
              ArxivRoll 2024B
            </button>
            <button
              onClick={() => setActiveBenchmark('2025a')}
              className={`px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeBenchmark === '2025a'
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400'
              }`}
            >
              ArxivRoll 2025A
            </button>
          </div>
        </div>

        {activeBenchmark === '2024b' ? (
          <>
            <Toolbar />
            <div className="flex justify-center mt-8">
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <RobenchTable activeTab={activeTab} benchmarkVersion="2024b" />
            
            <div className="mt-12">
              <RobenchScpRadarCharts benchmarkVersion="2024b" />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                ArxivRoll 2025A Coming Soon
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                We're currently preparing fresh test cases from the latest ArXiv preprints (Oct 2024 - Mar 2025). 
                Stay tuned for the next iteration of our one-time-pad evaluation framework!
              </p>
            </div>
          </div>
        )}










        <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8 pb-4">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
              
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">Support</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This project is supported by <a href="https://astaple.com" className="text-cyan-500 hover:text-cyan-400 underline">Astaple Group in PolyU</a>.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Also maintained by <a href="https://moreoverai.com/about" className="text-cyan-500 hover:text-cyan-400 underline">MoreoverAI</a>.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="https://arxiv.org/abs/2507.19219" className="text-cyan-500 hover:text-cyan-400 underline">📄 Paper</a></li>
                  <li><a href="https://github.com/liangzid/ArxivRoll" className="text-cyan-500 hover:text-cyan-400 underline">📊 GitHub Repository: Give Us a Star!</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">Developer</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Developed by <a href="https://liangzid.github.io/research.html" className="text-cyan-500 hover:text-cyan-400 underline">Zi Liang</a>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  📧 <a href="mailto:zi1415926.liang@connect.polyu.hk" className="text-cyan-500 hover:text-cyan-400 underline">zi1415926.liang@connect.polyu.hk</a>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">Citation</h3>
                <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-left text-xs overflow-x-auto">
                  <pre><code>{`@misc{arxivroll,
      title={How Much Do Large Language Model Cheat on Evaluation? Benchmarking Overestimation under the One-Time-Pad-Based Framework}, 
      author={Zi Liang and Liantong Yu and Shiyu Zhang and Qingqing Ye and Haibo Hu},
      year={2025},
      eprint={2507.19219},
      archivePrefix={arXiv},
      primaryClass={cs.CL},
      url={https://arxiv.org/abs/2507.19219}, 
}`}</code></pre>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                © 2025 ArxivRoll Leaderboard. Built with ❤️ for transparent LLM evaluation.
              </p>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}