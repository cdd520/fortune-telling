'use client';

import { useState, useEffect } from 'react';
import { Term } from '@/types';
import { getTermByName } from '@/data/terms';

interface TermTooltipProps {
  term: string;
  children: React.ReactNode;
}

export default function TermTooltip({ term, children }: TermTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [termData, setTermData] = useState<Term | null>(null);

  useEffect(() => {
    const data = getTermByName(term);
    setTermData(data ?? null);
  }, [term]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom + window.scrollY,
    });
    setShowTooltip(!showTooltip);
  };

  if (!termData) {
    return <>{children}</>;
  }

  return (
    <>
      <span
        onClick={handleClick}
        className="cursor-pointer underline decoration-dotted underline-offset-2 hover:text-lucky dark:hover:text-traditional-gold transition-colors"
      >
        {children}
      </span>
      
      {showTooltip && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowTooltip(false)}
          />
          <div
            className="fixed z-50 w-80 bg-white dark:bg-traditional-card rounded-lg shadow-xl border border-gray-200 dark:border-traditional-border p-4 animate-scale-in"
            style={{
              left: Math.min(position.x - 160, window.innerWidth - 340),
              top: position.y + 10,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-traditional-gold">
                {termData.name}
              </h3>
              <div className="flex items-center gap-2">
                {termData.wuXing && (
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    termData.wuXing === '木' ? 'bg-wood/20 text-wood-dark' :
                    termData.wuXing === '火' ? 'bg-fire/20 text-fire-dark' :
                    termData.wuXing === '土' ? 'bg-earth/20 text-earth-dark' :
                    termData.wuXing === '金' ? 'bg-gray-200 text-gray-700' :
                    'bg-water/20 text-water-light'
                  }`}>
                    {termData.wuXing}
                  </span>
                )}
                {termData.jiXiong && (
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    termData.jiXiong === '吉' ? 'bg-lucky/20 text-lucky-dark' :
                    termData.jiXiong === '凶' ? 'bg-unlucky/20 text-unlucky-dark' :
                    'bg-neutral/20 text-neutral-dark'
                  }`}>
                    {termData.jiXiong}
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {termData.meaning}
            </p>
            
            <div className="bg-gray-50 dark:bg-traditional-bg/50 rounded p-2 mb-2">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                💡 {termData.plainMeaning}
              </p>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-500">
              📌 {termData.influence}
            </p>
            
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </>
      )}
    </>
  );
}
