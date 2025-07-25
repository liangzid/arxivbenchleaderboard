export interface RobenchScpScore {
  acc: number;
  std: number;
}

export interface RobenchScpScenario {
  s: RobenchScpScore;
  c: RobenchScpScore;
  p: RobenchScpScore;
}

export interface RobenchScpModelData {
  [modelName: string]: {
    [scenarioKey: string]: RobenchScpScenario;
  };
}

export interface RadarDataPoint {
  scenario: string;
  model: string;
  score: number;
  std: number;
  min: number;
  max: number;
}

export interface RadarChartData {
  [modelName: string]: RadarDataPoint[];
}

const scenarioNames: { [key: string]: string } = {
  cs: 'Computer Science',
  econ: 'Economics',
  eess: 'Electrical Engineering',
  math: 'Mathematics',
  physics: 'Physics',
  'q-bio': 'Quantitative Biology',
  'q-fin': 'Quantitative Finance',
  stat: 'Statistics',
};

export function parseRobenchScpData(results: any): RobenchScpModelData {
  const modelData: RobenchScpModelData = {};
  
  for (const [modelName, modelResults] of Object.entries(results)) {
    const modelScpData: { [scenarioKey: string]: RobenchScpScenario } = {};
    
    for (const [key, value] of Object.entries(modelResults as any)) {
      if (key.startsWith('robench2024b_all_set') && key.includes('SCP-')) {
        const match = key.match(/robench2024b_all_set(\w+)SCP-([scp])/);
        if (match) {
          const scenario = match[1];
          const scoreType = match[2] as 's' | 'c' | 'p';
          
          if (!modelScpData[scenario]) {
            modelScpData[scenario] = { s: { acc: 0, std: 0 }, c: { acc: 0, std: 0 }, p: { acc: 0, std: 0 } };
          }
          
          modelScpData[scenario][scoreType] = value as RobenchScpScore;
        }
      }
    }
    
    if (Object.keys(modelScpData).length > 0) {
      modelData[modelName] = modelScpData;
    }
  }
  
  return modelData;
}

export function prepareRadarChartData(
  modelData: RobenchScpModelData,
  scoreType: 's' | 'c' | 'p'
): RadarChartData {
  const radarData: RadarChartData = {};
  const scenarios = Object.keys(scenarioNames);
  
  for (const [modelName, scenarioData] of Object.entries(modelData)) {
    const modelRadarData: RadarDataPoint[] = [];
    
    for (const scenario of scenarios) {
      if (scenarioData[scenario] && scenarioData[scenario][scoreType]) {
        const scoreData = scenarioData[scenario][scoreType];
        modelRadarData.push({
          scenario: scenarioNames[scenario],
          model: modelName,
          score: scoreData.acc * 100, // Convert to percentage
          std: scoreData.std * 100,
          min: Math.max(0, (scoreData.acc - scoreData.std) * 100),
          max: Math.min(100, (scoreData.acc + scoreData.std) * 100),
        });
      }
    }
    
    if (modelRadarData.length > 0) {
      radarData[modelName] = modelRadarData;
    }
  }
  
  return radarData;
}

export function getScenarioDisplayName(scenarioKey: string): string {
  return scenarioNames[scenarioKey] || scenarioKey;
}

export function getScoreTypeDisplayName(scoreType: 's' | 'c' | 'p'): string {
  const names = {
    s: 'Sequencing',
    c: 'Cloze',
    p: 'Prediction',
  };
  return names[scoreType];
}