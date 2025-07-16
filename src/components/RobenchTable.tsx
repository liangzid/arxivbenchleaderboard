'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useLB } from '@/store/leaderboard';
import useRobenchLeaderboard from '@/hooks/useRobenchLeaderboard';
import { cn } from '@/lib/utils';

export default function RobenchTable() {
  const rows = useRobenchLeaderboard();
  const { search, setSortBy, sortBy } = useLB();

  const filtered = rows.filter(r => r.model.toLowerCase().includes(search));

  const sorted = [...filtered].sort((a, b) => {
    const key = sortBy as keyof typeof a;
    return (b[key] as number) - (a[key] as number);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl mx-auto mt-10"
    >
      <table className="w-full table-auto rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/10 dark:bg-black/20">
        <thead>
          <tr className="bg-white/5">
            <Th>#</Th>
            <Th className="text-left">Model</Th>
            <Th onClick={() => setSortBy('avgS')}>Avg S</Th>
            <Th onClick={() => setSortBy('avgC')}>Avg C</Th>
            <Th onClick={() => setSortBy('avgP')}>Avg P</Th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, idx) => (
            <Row key={row.model} row={row} idx={idx} />
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

function Row({ row, idx }: { row: ReturnType<typeof useRobenchLeaderboard>[0]; idx: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.tr
        layout
        className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <Td>{idx + 1}</Td>
        <Td className="font-bold">{row.model}</Td>
        <Td>{(row.avgS * 100).toFixed(1)}</Td>
        <Td>{(row.avgC * 100).toFixed(1)}</Td>
        <Td>{(row.avgP * 100).toFixed(1)}</Td>
      </motion.tr>

      <AnimatePresence>
        {open && (
          <motion.tr
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white/5"
          >
            <td colSpan={5} className="p-4">
              <DetailTable groups={row.groups} />
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

function DetailTable({ groups }: { groups: { scenario: string; s: number; c: number; p: number }[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-white/10">
          <th className="text-left py-1">Scenario</th>
          <th className="text-center">S</th>
          <th className="text-center">C</th>
          <th className="text-center">P</th>
        </tr>
      </thead>
      <tbody>
        {groups.map(g => (
          <tr key={g.scenario} className="border-b border-white/5">
            <td className="py-1">{g.scenario}</td>
            <td className="text-center">{(g.s * 100).toFixed(1)}</td>
            <td className="text-center">{(g.c * 100).toFixed(1)}</td>
            <td className="text-center">{(g.p * 100).toFixed(1)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const Th = ({ children, onClick }: any) => (
  <th
    onClick={onClick}
    className="p-3 text-xs font-bold uppercase cursor-pointer select-none hover:text-cyan-400"
  >
    {children}
  </th>
);

const Td = ({ children, className }: any) => (
  <td className={cn('p-3 text-center', className)}>{children}</td>
);
