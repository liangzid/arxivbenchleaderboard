'use client';

import React, { useEffect, useState } from 'react';
import ModelRadarChart from './RadarChart';
import { 
  parseRobenchScpData, 
  prepareRadarChartData, 
  getScoreTypeDisplayName 
} from '@/lib/robenchScpParser';

interface RobenchScpRadarChartsProps {
  resultsData?: any;
}

export default function RobenchScpRadarCharts({ resultsData }: RobenchScpRadarChartsProps) {
  const [loading, setLoading] = useState(true);
  const [modelData, setModelData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeChart, setActiveChart] = useState<'s' | 'c' | 'p'>('s');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        let data = resultsData;
        if (!data) {
          const response = await fetch('/results.json');
          if (!response.ok) {
            throw new Error('Failed to load results data');
          }
          data = await response.json();
        }
        
        const parsedData = parseRobenchScpData(data);
        setModelData(parsedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [resultsData]);

  const chartTypes = [
    { key: 's' as const, label: 'Sequencing', color: 'text-blue-400' },
    { key: 'c' as const, label: 'Cloze', color: 'text-green-400' },
    { key: 'p' as const, label: 'Prediction', color: 'text-purple-400' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-2 text-gray-400">Loading RobenchSCP data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
        <div className="flex">
          <div className="text-red-400">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-300">Error Loading Data</h3>
            <p className="mt-1 text-sm text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!modelData || Object.keys(modelData).length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-300">No RobenchSCP Data</h3>
        <p className="mt-1 text-sm text-gray-500">No RobenchSCP results found in the dataset.</p>
      </div>
    );
  }

  const sData = prepareRadarChartData(modelData, 's');
  const cData = prepareRadarChartData(modelData, 'c');
  const pData = prepareRadarChartData(modelData, 'p');

  const getChartData = () => {
    switch (activeChart) {
      case 's': return sData;
      case 'c': return cData;
      case 'p': return pData;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          ArxivRoll SCP Radar Analysis
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Interactive radar charts showing model performance across all Sequencing, Cloze, and Prediction tasks with standard deviation ranges.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 inline-flex">
          {chartTypes.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setActiveChart(key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeChart === key
                  ? 'bg-gray-700 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6">
          <ModelRadarChart
            data={getChartData()}
            scoreType={activeChart}
            title={`${getScoreTypeDisplayName(activeChart)} Scores by Scenario`}
          />
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Understanding the Scores</h3>
        <div className="text-sm text-gray-400 space-y-2">
          <p><span className="text-blue-400 font-medium">Sequencing (S):</span> Re-order shuffled sentences performance</p>
          <p><span className="text-green-400 font-medium">Cloze (C):</span> Fill masked sentences accuracy</p>
          <p><span className="text-purple-400 font-medium">Prediction (P):</span> Choose correct next sentence accuracy</p>
          <p className="mt-2 text-gray-500">
            Hover over data points to see exact scores with standard deviation ranges.
          </p>
        </div>
      </div>
    </div>
  );
}