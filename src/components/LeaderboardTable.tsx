'use client';
import { motion } from 'framer-motion';
import { useLB } from '@/store/leaderboard';
import useLeaderboard from '@/hooks/useLeaderboard';
import prepareRows from '@/lib/prepareRows';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LeaderboardTable() {
  const raw = useLeaderboard();
  const { sortBy, setSortBy, search } = useLB();
  const rows = prepareRows(raw);

  const filtered = rows.filter(r => r.model.toLowerCase().includes(search));
  const sorted = [...filtered].sort((a, b) => {
    const key = sortBy === 'avg' ? 'avg' : sortBy;
    return b[key] - a[key];           // 降序
  });

  const datasets = rows[0] ? Object.keys(rows[0].scores) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto mt-10"
    >
      <table className="w-full table-auto rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/10 dark:bg-black/20">
        <thead>
          <tr className="bg-white/5">
            <Th>#</Th>
            <Th className="text-left">Model</Th>
            {datasets.map(ds => (
              <Th key={ds} onClick={() => setSortBy(ds)} active={sortBy === ds}>
                {ds}
              </Th>
            ))}
            <Th onClick={() => setSortBy('avg')} active={sortBy === 'avg'}>
              Avg
            </Th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, idx) => (
            <motion.tr
              key={row.model}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.03 }}
              className="border-b border-white/5 hover:bg-white/5"
            >
              <Td>{idx + 1}</Td>
              <Td className="font-medium">{row.model}</Td>
              {datasets.map(ds => (
                <Td key={ds}>{(row.scores[ds] * 100).toFixed(1)}</Td>
              ))}
              <Td>{(row.avg * 100).toFixed(1)}</Td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

const Th = ({ children, className, active, onClick }: any) => (
  <th
    onClick={onClick}
    className={cn(
      'p-3 text-xs font-bold uppercase cursor-pointer select-none',
      active && 'text-cyan-400',
      className
    )}
  >
    <span className="flex items-center gap-1">
      {children}
      {active && <ChevronDown className="w-3 h-3" />}
    </span>
  </th>
);

const Td = ({ children, className }: any) => (
  <td className={cn('p-3 text-center', className)}>{children}</td>
);