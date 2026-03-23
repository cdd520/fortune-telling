'use client';

import { useApp } from '@/context/AppContext';
import { ViewMode } from '@/types';

export default function ModeSwitch() {
  const { viewMode, setViewMode } = useApp();

  const handleModeChange = (mode: ViewMode) => {
    if (mode === 'professional') {
      const confirmed = window.confirm(
        '专业模式将展示完整排盘，仅供传统文化娱乐研究，不构成任何决策建议。是否继续？'
      );
      if (!confirmed) return;
    }
    setViewMode(mode);
  };

  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-traditional-card rounded-full p-1">
      <button
        onClick={() => handleModeChange('plain')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          viewMode === 'plain'
            ? 'bg-white dark:bg-traditional-gold text-gray-900 dark:text-traditional-bg shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        通俗模式
      </button>
      <button
        onClick={() => handleModeChange('professional')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          viewMode === 'professional'
            ? 'bg-traditional-gold text-traditional-bg shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        专业模式
      </button>
    </div>
  );
}
