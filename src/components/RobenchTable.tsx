'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLB } from '@/store/leaderboard';
import useRobenchLeaderboard from '@/hooks/useRobenchLeaderboard';
import { cn } from '@/lib/utils';

interface RobenchTableProps {
  activeTab?: string;
  benchmarkVersion?: string;
}

export default function RobenchTable({ activeTab = 'overall', benchmarkVersion = '2024b' }: RobenchTableProps) {
  const rows = useRobenchLeaderboard(benchmarkVersion);
  const { search, setSortBy, sortBy } = useLB();
  const [currentPage, setCurrentPage] = useState(1);
  const modelsPerPage = 10;

  const filtered = rows.filter(r => r.model.toLowerCase().includes(search));

  // Process data based on active tab
  const processedRows = filtered.map(row => {
    if (activeTab === 'overall') {
      return row;
    }

    // Find the specific scenario group
    const scenarioGroup = row.groups.find(g => g.scenario === activeTab);
    
    if (!scenarioGroup) {
      return {
        ...row,
        avgS: { acc: 0, std: 0 },
        avgC: { acc: 0, std: 0 },
        avgP: { acc: 0, std: 0 },
        avgOverall: { acc: 0, std: 0 },
      };
    }

    return {
      ...row,
      avgS: scenarioGroup.s,
      avgC: scenarioGroup.c,
      avgP: scenarioGroup.p,
      avgOverall: {
        acc: (scenarioGroup.s.acc + scenarioGroup.c.acc + scenarioGroup.p.acc) / 3,
        std: (scenarioGroup.s.std + scenarioGroup.c.std + scenarioGroup.p.std) / 3,
      },
    };
  });

  const sorted = [...processedRows].sort((a, b) => {
    if (sortBy === 'avgS') return b.avgS.acc - a.avgS.acc;
    if (sortBy === 'avgC') return b.avgC.acc - a.avgC.acc;
    if (sortBy === 'avgP') return b.avgP.acc - a.avgP.acc;
    if (sortBy === 'avgOverall') return b.avgOverall.acc - a.avgOverall.acc;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sorted.length / modelsPerPage);
  const startIndex = (currentPage - 1) * modelsPerPage;
  const paginatedRows = sorted.slice(startIndex, startIndex + modelsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, activeTab, benchmarkVersion]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

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
            <Th onClick={() => setSortBy('avgS')} active={sortBy === 'avgS'}>S</Th>
            <Th onClick={() => setSortBy('avgC')} active={sortBy === 'avgC'}>C</Th>
            <Th onClick={() => setSortBy('avgP')} active={sortBy === 'avgP'}>P</Th>
            <Th onClick={() => setSortBy('avgOverall')} active={sortBy === 'avgOverall'}>Avg</Th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row, idx) => (
            <Row key={row.model} row={row} idx={startIndex + idx} activeTab={activeTab} />
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              const pageNum = totalPages <= 7 ? i + 1 : 
                currentPage <= 4 ? i + 1 : 
                currentPage >= totalPages - 3 ? totalPages - 6 + i :
                currentPage - 3 + i;
              
              if (pageNum < 1 || pageNum > totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    currentPage === pageNum
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <div className="text-sm text-gray-400">
            {startIndex + 1}-{Math.min(startIndex + modelsPerPage, sorted.length)} of {sorted.length} models
          </div>
        </div>
      )}
    </motion.div>
  );
}

function Row({ row, idx, activeTab }: { row: ReturnType<typeof useRobenchLeaderboard>[0]; idx: number; activeTab: string }) {
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
        <Td>{(row.avgS.acc * 100).toFixed(1)} ± {(row.avgS.std * 100).toFixed(1)}</Td>
        <Td>{(row.avgC.acc * 100).toFixed(1)} ± {(row.avgC.std * 100).toFixed(1)}</Td>
        <Td>{(row.avgP.acc * 100).toFixed(1)} ± {(row.avgP.std * 100).toFixed(1)}</Td>
        <Td>{(row.avgOverall.acc * 100).toFixed(1)} ± {(row.avgOverall.std * 100).toFixed(1)}</Td>
      </motion.tr>

      {activeTab === 'overall' && (
        <AnimatePresence>
          {open && (
            <motion.tr
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white/5"
            >
              <td colSpan={6} className="p-4">
                <DetailTable groups={row.groups} />
              </td>
            </motion.tr>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

function DetailTable({ groups }: { groups: { scenario: string; s: { acc: number; std: number }; c: { acc: number; std: number }; p: { acc: number; std: number } }[] }) {
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
            <td className="text-center text-sm">{(g.s.acc * 100).toFixed(1)} ± {(g.s.std * 100).toFixed(1)}</td>
            <td className="text-center text-sm">{(g.c.acc * 100).toFixed(1)} ± {(g.c.std * 100).toFixed(1)}</td>
            <td className="text-center text-sm">{(g.p.acc * 100).toFixed(1)} ± {(g.p.std * 100).toFixed(1)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const Th = ({ children, onClick, active }: any) => (
  <th
    onClick={onClick}
    className={`p-3 text-xs font-bold uppercase cursor-pointer select-none transition-colors ${
      active ? 'text-cyan-400' : 'hover:text-cyan-400'
    }`}
  >
    {children}
    {active && <span className="ml-1">↓</span>}
  </th>
);

const Td = ({ children, className }: any) => (
  <td className={cn('p-3 text-center', className)}>{children}</td>
);
