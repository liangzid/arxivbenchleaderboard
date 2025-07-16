'use client';

import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { RadarChartData } from '@/lib/robenchScpParser';

interface ModelRadarChartProps {
  data: RadarChartData;
  scoreType: 's' | 'c' | 'p';
  title: string;
  colorPalette?: string[];
}

const defaultColors = [
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#6366f1', // indigo-500
  '#f97316', // orange-500
  '#14b8a6', // teal-500
  '#84cc16', // lime-500
  '#06b6d4', // cyan-500
  '#a855f7', // purple-500
  '#eab308', // yellow-500
  '#22c55e', // green-500
  '#78716c', // stone-500
];

export default function ModelRadarChart({
  data,
  scoreType,
  title,
  colorPalette = defaultColors,
}: ModelRadarChartProps) {
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg">
        <p className="text-gray-400">No data available for {title}</p>
      </div>
    );
  }

  // Transform data for Recharts
  const scenarios = Object.keys(data)[0] ? data[Object.keys(data)[0]].map(d => d.scenario) : [];
  
  const chartData = scenarios.map(scenario => {
    const scenarioData: any = { scenario };
    
    Object.entries(data).forEach(([modelName, modelData]) => {
      const dataPoint = modelData.find(d => d.scenario === scenario);
      if (dataPoint) {
        scenarioData[modelName] = dataPoint.score;
      }
    });
    
    return scenarioData;
  });

  const models = Object.keys(data);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => setScale(1);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const containerHeight = isFullscreen ? '90vh' : '40rem';
  const containerClass = isFullscreen 
    ? 'fixed inset-4 bg-gray-900 rounded-xl border border-gray-700 z-50 p-6' 
    : 'bg-gray-900 rounded-lg p-4';

return (
  <div className={containerClass}>
    <div className="flex">
      
      {/* Chart container with improved spacing */}
      <div className="flex-1 relative">
        <div 
          style={{ 
            height: containerHeight, 
            transform: `scale(${scale})`, 
            transformOrigin: 'top left', 
            transition: 'transform 0.2s ease-in-out',
            marginRight: '80px' // Increased space for legend
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart 
              data={chartData} 
              margin={{ top: 20, right: 80, bottom: 20, left: 80 }} // Increased side margins
              cx="50%" 
              cy="50%"
              outerRadius="80%" // Makes radar larger within container
            >
              <PolarGrid gridType="polygon" stroke="#374151" />
              
              <PolarAngleAxis 
                dataKey="scenario" 
                tick={{ fontSize: 12, fill: '#d1d5db' }}
                className="text-xs"
              />
              
              {/* Dynamic axis range calculation */}
              <PolarRadiusAxis 
                angle={90} 
                domain={[
                  (dataMin: number) => Math.max(0, Math.floor(dataMin * 0.9)), // 10% below min value
                  (dataMax: number) => Math.min(100, Math.ceil(dataMax * 1.1)) // 10% above max value
                ]}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickCount={6}
                stroke="#374151"
              />
              
              {models.map((modelName, index) => (
                <Radar
                  key={modelName}
                  name={modelName}
                  dataKey={modelName}
                  stroke={colorPalette[index % colorPalette.length]}
                  fill={colorPalette[index % colorPalette.length]}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={{ fill: colorPalette[index % colorPalette.length], strokeWidth: 2, r: 3 }}
                />
              ))}
              
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800 p-3 border border-gray-700 rounded-lg shadow-lg">
                        <p className="font-semibold text-white mb-2">{label}</p>
                        {payload.map((entry, index) => {
                          const modelData = data[entry.dataKey as string];
                          const dataPoint = modelData?.find(d => d.scenario === label);
                          return (
                            <div key={index} className="flex items-center justify-between text-sm mb-1">
                              <span style={{ color: entry.color }}>
                                {entry.dataKey}:
                              </span>
                              <span className="ml-2 font-medium text-white">
                                {entry.value?.toFixed(1)}%
                                {dataPoint && (
                                  <span className="text-gray-400 ml-1">
                                    ±{dataPoint.std.toFixed(1)}%
                                  </span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              <Legend 
                wrapperStyle={{ 
                  position: 'absolute',
                  right: '-160px', // Positions legend outside radar area
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(31, 41, 55, 0.7)',
                  padding: '10px',
                  borderRadius: '4px'
                }}
                iconType="line"
                layout="vertical"
                verticalAlign="middle"
                align="right"
                formatter={(value) => (
                  <span className="text-gray-300 text-sm">{value}</span>
                )}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);
}
