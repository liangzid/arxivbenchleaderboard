'use client';
import { motion } from 'framer-motion';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'overall', label: 'Overall' },
  { id: 'cs', label: 'CS' },
  { id: 'q-fin', label: 'Finance' },
  { id: 'math', label: 'Math' },
  { id: 'eess', label: 'EESS' },
  { id: 'physics', label: 'Physics' },
  { id: 'stat', label: 'Statistics' },
  { id: 'q-bio', label: 'Bio' },
  { id: 'econ', label: 'Economics' },
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex flex-wrap justify-center gap-1 bg-white/10 dark:bg-black/20 p-1 rounded-lg backdrop-blur-sm max-w-4xl mx-auto">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="relative px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white/20 dark:bg-white/10 rounded-md"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}