'use client';

import { useEffect, useState } from 'react';

export default function LoadingAnimation() {
  const [dots, setDots] = useState('');
  const text = '正在为您排盘分析中';
  
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    
    return () => clearInterval(dotInterval);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-traditional-bg dark:to-traditional-card">
      <div className="text-center">
        <div className="relative w-40 h-40 mx-auto mb-8">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full taiji-spin"
          >
            <circle cx="50" cy="50" r="48" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.2" />
            <path
              d="M50 2 A48 48 0 0 1 50 98 A24 24 0 0 1 50 50 A24 24 0 0 0 50 2"
              fill="#fbbf24"
              opacity="0.8"
            />
            <circle cx="50" cy="26" r="6" fill="#1e293b" />
            <circle cx="50" cy="74" r="6" fill="#fbbf24" />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-lucky/20 animate-pulse-glow" />
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {text}{dots}
        </h2>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          正在计算八字、紫微斗数、八宅风水...
        </p>
        
        <div className="mt-8 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-lucky animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
