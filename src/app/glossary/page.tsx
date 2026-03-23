'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TermTooltip from '@/components/TermTooltip';
import { terms, getTermsByCategory } from '@/data/terms';
import { Term } from '@/types';

const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: '天干', label: '天干' },
  { key: '地支', label: '地支' },
  { key: '十神', label: '十神' },
  { key: '神煞', label: '神煞' },
  { key: '星曜', label: '星曜' },
  { key: '宫位', label: '宫位' },
  { key: '风水', label: '风水' },
];

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { viewMode } = { viewMode: 'plain' };
  
  const filteredTerms = useMemo(() => {
    let result = terms;
    
    if (activeCategory !== 'all') {
      result = getTermsByCategory(activeCategory as Term['category']);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        term =>
          term.name.includes(searchQuery) ||
          term.meaning.toLowerCase().includes(query) ||
          term.plainMeaning.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [searchQuery, activeCategory]);
  
  const getWuXingBgClass = (wuXing?: string) => {
    if (!wuXing) return '';
    switch (wuXing) {
      case '木': return 'bg-wood text-white';
      case '火': return 'bg-fire text-white';
      case '土': return 'bg-earth text-white';
      case '金': return 'bg-gray-200 text-gray-800';
      case '水': return 'bg-water text-white';
      default: return '';
    }
  };
  
  const getJiXiongBgClass = (jiXiong?: string) => {
    if (!jiXiong) return '';
    switch (jiXiong) {
      case '吉': return 'bg-lucky/20 text-lucky-dark dark:text-lucky';
      case '凶': return 'bg-unlucky/20 text-unlucky-dark dark:text-unlucky';
      case '平': return 'bg-neutral/20 text-neutral-dark dark:text-neutral';
      default: return '';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            命理术语库
          </h1>
          
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索术语..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === key
                    ? 'bg-lucky text-white'
                    : 'bg-gray-100 dark:bg-traditional-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-traditional-border'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            共 {filteredTerms.length} 个术语
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {filteredTerms.map((term, index) => (
              <div
                key={`${term.name}-${index}`}
                className="card p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {term.icon && <span className="text-xl">{term.icon}</span>}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {term.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    {term.wuXing && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getWuXingBgClass(term.wuXing)}`}>
                        {term.wuXing}
                      </span>
                    )}
                    {term.jiXiong && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getJiXiongBgClass(term.jiXiong)}`}>
                        {term.jiXiong}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mb-2">
                  <span className="text-xs text-gray-400 dark:text-gray-500">{term.category}</span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {term.meaning}
                </p>
                
                <div className="p-3 bg-gray-50 dark:bg-traditional-bg/50 rounded-lg mb-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    💡 {term.plainMeaning}
                  </p>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  📌 {term.influence}
                </p>
              </div>
            ))}
          </div>
          
          {filteredTerms.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                未找到相关术语
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                尝试使用其他关键词搜索
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
