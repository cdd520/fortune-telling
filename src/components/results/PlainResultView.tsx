'use client';

import { useState } from 'react';
import { CalculationResult } from '@/types';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import TermDetailDrawer from '@/components/TermDetailDrawer';
import { WU_XING } from '@/utils/constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowRight, Star, TrendingUp, Heart, Wallet, Activity, Sparkles, Moon, Sun, Compass, Zap } from 'lucide-react';

interface PlainResultViewProps {
  result: CalculationResult;
}

interface TermClickInfo {
  name: string;
  position?: string;
  jiXiong?: '吉' | '凶' | '平';
}

export default function PlainResultView({ result }: PlainResultViewProps) {
  const { setViewMode } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<TermClickInfo>({ name: '' });
  
  const { baZi, baZhai, plainResult, birthInfo } = result;
  
  const handleTermClick = (termInfo: TermClickInfo) => {
    if (termInfo.name) {
      setSelectedTerm(termInfo);
      setDrawerOpen(true);
    }
  };
  
  const wuXingData = WU_XING.map(wuxing => ({
    name: wuxing,
    value: baZi.wuXingCount[wuxing],
  })).filter(d => d.value > 0);
  
  const WU_XING_COLORS: Record<string, string> = {
    '木': '#4ADE80',
    '火': '#F87171',
    '土': '#FBBF24',
    '金': '#CBD5E1',
    '水': '#60A5FA',
  };
  
  const renderStars = (score: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'w-4 h-4 transition-all duration-300',
              star <= score 
                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                : 'text-black/50'
            )}
          />
        ))}
      </div>
    );
  };
  
  const getJiXiongClass = (jiXiong: string) => {
    const classes: Record<string, string> = {
      '吉': 'tag-lucky',
      '凶': 'tag-unlucky',
      '平': 'tag-neutral',
    };
    return classes[jiXiong] || 'tag-neutral';
  };

  const getWuXingClass = (wuXing: string) => {
    const classes: Record<string, string> = {
      '木': 'tag-wuxing-wood',
      '火': 'tag-wuxing-fire',
      '土': 'tag-wuxing-earth',
      '金': 'tag-wuxing-metal',
      '水': 'tag-wuxing-water',
    };
    return classes[wuXing] || '';
  };

  const getWuXingTextClass = (wuXing: string) => {
    const classes: Record<string, string> = {
      '木': 'text-wuxing-wood',
      '火': 'text-wuxing-fire',
      '土': 'text-wuxing-earth',
      '金': 'text-wuxing-metal',
      '水': 'text-wuxing-water',
    };
    return classes[wuXing] || '';
  };
  
  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-6 space-y-6">
        
        <div className="glass-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6">
            <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto md:mx-0">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/30 to-amber-500/30 blur-xl animate-pulse-glow" />
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-amber-500/20 flex items-center justify-center border border-purple-500/30">
                <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-amber-400" />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gradient mb-2">命盘解读</h1>
              <p className="text-sm text-black/70">基于您的出生信息深度分析</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-black/70 mb-6 flex-wrap">
            <span className="glass px-3 py-1.5 rounded-full text-purple-300">{birthInfo.gender}命</span>
            <span className="text-black/50">•</span>
            <span className="glass px-3 py-1.5 rounded-full">{birthInfo.date}</span>
            <span className="text-black/50">•</span>
            <span className="glass px-3 py-1.5 rounded-full text-amber-300">{birthInfo.location.city}</span>
          </div>
          
          <div className="mystic-card">
            <p className="text-black/80 leading-relaxed text-base md:text-lg">
              {plainResult.summary.split(/([甲乙丙丁戊己庚辛壬癸][木火土金水])/).map((part, i) => {
                const match = part.match(/^[甲乙丙丁戊己庚辛壬癸]([木火土金水])$/);
                if (match) {
                  return (
                    <button
                      key={i}
                      onClick={() => handleTermClick({
                        name: part[0],
                        position: '日主五行',
                      })}
                      className={cn(
                        'font-bold px-2 py-0.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer',
                        getWuXingTextClass(match[1]),
                        'hover:drop-shadow-[0_0_10px_currentColor]'
                      )}
                    >
                      {part}
                    </button>
                  );
                }
                return part;
              })}
            </p>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="module-title mb-4">性格深度分析</h2>
          <p className="text-black/75 leading-relaxed">
            {plainResult.personality}
          </p>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="module-title mb-6">五行能量分布</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-amber-500/5 rounded-2xl" />
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wuXingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {wuXingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={WU_XING_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 10, 26, 0.95)', 
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '12px',
                      color: '#f1f5f9',
                      backdropFilter: 'blur(10px)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <p className="text-black/75">
                {plainResult.wuXingAnalysis}
              </p>
              {baZi.wuXingMissing.length > 0 && (
                <div className="glass-card p-4 border-red-500/20 bg-red-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-sm font-medium text-red-400">五行缺失</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {baZi.wuXingMissing.map((wx, i) => (
                      <button
                        key={i}
                        onClick={() => handleTermClick({ name: wx, position: '缺失五行' })}
                        className={cn('tag cursor-pointer hover:-translate-y-0.5 transition-all duration-200', getWuXingClass(wx))}
                      >
                        {wx}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {baZi.wuXingStrong.length > 0 && (
                <div className="glass-card p-4 border-green-500/20 bg-green-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm font-medium text-green-400">五行旺盛</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {baZi.wuXingStrong.map((wx, i) => (
                      <button
                        key={i}
                        onClick={() => handleTermClick({ name: wx, position: '旺盛五行' })}
                        className={cn('tag cursor-pointer hover:-translate-y-0.5 transition-all duration-200', getWuXingClass(wx))}
                      >
                        {wx}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="module-title mb-6">核心运势评分</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'career', label: '事业运', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
              { key: 'love', label: '感情运', icon: Heart, color: 'from-pink-500 to-rose-500' },
              { key: 'wealth', label: '财运', icon: Wallet, color: 'from-amber-500 to-orange-500' },
              { key: 'health', label: '健康运', icon: Activity, color: 'from-green-500 to-emerald-500' },
            ].map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="glass-card p-4 group hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br', color)}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-black/80">{label}</span>
                </div>
                {renderStars(plainResult.fortuneDetails[key as keyof typeof plainResult.fortuneDetails].score)}
                <p className="mt-3 text-xs text-black/70 leading-relaxed line-clamp-3">
                  {plainResult.fortuneDetails[key as keyof typeof plainResult.fortuneDetails].advice}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="module-title mb-6">流月运势时间轴</h2>
          <div className="overflow-x-auto scrollbar-thin -mx-6 px-6">
            <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
              {plainResult.monthlyFortune.map((month, index) => (
                <button
                  key={month.month}
                  onClick={() => handleTermClick({
                    name: `${month.month}月运势`,
                    position: '流月运势',
                    jiXiong: month.jiXiong,
                  })}
                  className={cn(
                    'glass-card p-4 min-w-[110px] flex flex-col items-center cursor-pointer transition-all duration-300',
                    'hover:border-purple-500/40 hover:-translate-y-1',
                    month.jiXiong === '吉' && 'border-green-500/20',
                    month.jiXiong === '凶' && 'border-red-500/20'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="text-sm font-semibold text-white mb-2">
                    {month.month}月
                  </div>
                  <span className={cn('tag mb-2', getJiXiongClass(month.jiXiong))}>
                    {month.jiXiong}
                  </span>
                  <div className="flex flex-wrap gap-1 justify-center mb-2">
                    {month.keywords.slice(0, 2).map((kw, i) => (
                      <span key={i} className="text-xs text-black/70">
                        {kw}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-black/60 text-center line-clamp-2">
                    {month.advice}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="module-title mb-6">风水方位指南</h2>
          <div className="mb-6">
            <div className="mystic-card flex items-center gap-4">
              <Compass className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-black/75">
                  命卦：
                  <button
                    onClick={() => handleTermClick({
                      name: baZhai.mingGua,
                      position: '命卦',
                    })}
                    className="font-bold text-amber-400 mx-1 cursor-pointer hover:-translate-y-0.5 transition-transform hover:drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                  >
                    {baZhai.mingGua}
                  </button>
                  卦（{baZhai.mingGuaWuXing}）
                </p>
                <p className="text-sm text-black/70 mt-1">
                  {plainResult.fengShuiAdvice}
                </p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-green-400 mb-4 flex items-center gap-2">
                <Sun className="w-4 h-4" />
                四吉方
              </h3>
              <div className="space-y-2">
                {baZhai.siJiFang.map((fang, i) => (
                  <button
                    key={i}
                    onClick={() => handleTermClick({
                      name: fang.name,
                      position: `${fang.direction}（${fang.angle}°）`,
                      jiXiong: '吉',
                    })}
                    className="glass-card w-full p-3 text-left cursor-pointer hover:border-green-500/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-400 group-hover:text-green-300 transition-colors">{fang.name}</span>
                      <span className="text-xs text-black/60 glass px-2 py-0.5 rounded-full">{fang.direction}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-400 mb-4 flex items-center gap-2">
                <Moon className="w-4 h-4" />
                四凶方
              </h3>
              <div className="space-y-2">
                {baZhai.siXiongFang.map((fang, i) => (
                  <button
                    key={i}
                    onClick={() => handleTermClick({
                      name: fang.name,
                      position: `${fang.direction}（${fang.angle}°）`,
                      jiXiong: '凶',
                    })}
                    className="glass-card w-full p-3 text-left cursor-pointer hover:border-red-500/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-red-400 group-hover:text-red-300 transition-colors">{fang.name}</span>
                      <span className="text-xs text-black/60 glass px-2 py-0.5 rounded-full">{fang.direction}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="module-title mb-6">命带神煞</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {baZi.shenSha.map((sha, i) => (
              <button
                key={i}
                onClick={() => handleTermClick({
                  name: sha.name,
                  jiXiong: sha.type,
                })}
                className={cn(
                  'glass-card p-4 text-left cursor-pointer transition-all duration-300 hover:-translate-y-1',
                  sha.type === '吉' && 'hover:border-green-500/30',
                  sha.type === '凶' && 'hover:border-red-500/30'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  {sha.icon && <span className="text-lg">{sha.icon}</span>}
                  <span className="font-medium text-white">{sha.name}</span>
                  <span className={cn('tag ml-auto text-xs', getJiXiongClass(sha.type))}>
                    {sha.type}
                  </span>
                </div>
                <p className="text-xs text-black/70 line-clamp-2">
                  {sha.plainMeaning.slice(0, 35)}...
                </p>
              </button>
            ))}
          </div>
        </div>
        
        <div className="text-center py-6">
          <button
            onClick={() => setViewMode('professional')}
            className="btn-primary inline-flex items-center gap-3 text-lg"
          >
            <Zap className="w-5 h-5" />
            <span>查看专业排盘</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-black/60">
            ✨ 本结果仅供传统文化娱乐研究，不构成任何决策建议
          </p>
        </div>
      </div>

      <TermDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        termName={selectedTerm.name}
        contextInfo={{
          position: selectedTerm.position,
          jiXiong: selectedTerm.jiXiong,
        }}
      />
    </div>
  );
}
