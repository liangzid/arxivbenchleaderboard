import { create } from 'zustand';

interface Store {
  sortBy: string;          // 数据集名或 'avg'
  setSortBy: (b: string) => void;
  search: string;
  setSearch: (s: string) => void;
}
export const useLB = create<Store>(set => ({
  sortBy: 'avgOverall',
  setSortBy: (b) => set({ sortBy: b }),
  search: '',
  setSearch: (s) => set({ search: s.toLowerCase() }),
}));