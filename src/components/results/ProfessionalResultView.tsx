'use client';

import { useState, useRef } from 'react';
import { CalculationResult } from '@/types';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import TermDetailDrawer from '@/components/TermDetailDrawer';
import html2canvas from 'html2canvas';
import { Download, ArrowLeft, Sparkles, Grid3X3, Compass, Share2 } from 'lucide-react';
import { TIAN_GAN_WU_XING, DI_ZHI_WU_XING } from '@/utils/constants';

interface ProfessionalResultViewProps {
  result: CalculationResult;
}

interface TermClickInfo {
  name: string;
  position?: string;
  strength?: string;
  jiXiong?: '吉' | '凶' | '平';
}

export default function ProfessionalResultView({ result }: ProfessionalResultViewProps) {
  const { setViewMode } = useApp();
  const [activeTab, setActiveTab] = useState<'bazi' | 'ziwei' | 'bazhai'>('bazi');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<TermClickInfo>({ name: '' });
  const resultRef = useRef<HTMLDivElement>(null);

  const { baZi, ziWei, baZhai, birthInfo } = result;

  const handleTermClick = (termInfo: TermClickInfo) => {
    if (termInfo.name) {
      setSelectedTerm(termInfo);
      setDrawerOpen(true);
    }
  };

  const handleExport = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#0F0A1A',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `知命排盘_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    }
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

  const getJiXiongClass = (jiXiong: string) => {
    const classes: Record<string, string> = {
      '吉': 'tag-lucky',
      '凶': 'tag-unlucky',
      '平': 'tag-neutral',
    };
    return classes[jiXiong] || 'tag-neutral';
  };

  const getJiXiongFromShiShen = (shiShen: string): '吉' | '凶' | '平' => {
    const jiShiShen = ['比肩', '食神', '正财', '正官', '正印'];
    const xiongShiShen = ['劫财', '伤官', '七杀', '偏印'];
    if (jiShiShen.includes(shiShen)) return '吉';
    if (xiongShiShen.includes(shiShen)) return '凶';
    return '平';
  };

  const tabs = [
    { key: 'bazi', label: '八字排盘', icon: Grid3X3 },
    { key: 'ziwei', label: '紫微斗数', icon: Sparkles },
    { key: 'bazhai', label: '八宅风水', icon: Compass },
  ] as const;

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div ref={resultRef} className="max-w-[1200px] mx-auto px-4 md:px-8 py-6 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode('plain')}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>通俗模式</span>
            </button>
            <h1 className="text-2xl font-bold text-gradient">专业排盘</h1>
          </div>
          <button
            onClick={handleExport}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            <span>导出排盘图</span>
          </button>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-center gap-3 text-sm text-black/70 flex-wrap">
            <span className="glass px-3 py-1.5 rounded-full text-purple-300">{birthInfo.gender}命</span>
            <span className="text-black/50">•</span>
            <span className="glass px-3 py-1.5 rounded-full">{birthInfo.date}</span>
            <span className="text-black/50">•</span>
            <span className="glass px-3 py-1.5 rounded-full text-amber-300">{birthInfo.location.city}</span>
          </div>
        </div>

        <div className="glass-card p-1.5">
          <div className="flex gap-1">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  'flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2',
                  activeTab === key
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-black/70 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'bazi' && (
          <div className="space-y-6">
            <div>
              <h2 className="module-title mb-4">四柱排盘</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['年柱', '月柱', '日柱', '时柱'].map((label, i) => {
                  const pillar = [baZi.siZhu.year, baZi.siZhu.month, baZi.siZhu.day, baZi.siZhu.hour][i];
                  const isDayPillar = i === 2;
                  const ganWuXing = TIAN_GAN_WU_XING[pillar.gan];
                  const zhiWuXing = DI_ZHI_WU_XING[pillar.zhi];
                  const shiShen = [baZi.shiShen.year, baZi.shiShen.month, baZi.shiShen.day, baZi.shiShen.hour][i];

                  return (
                    <div
                      key={label}
                      className={cn(
                        'glass-card p-5 flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-1',
                        isDayPillar && 'border-amber-500/40 bg-amber-500/5'
                      )}
                    >
                      <span className="text-xs text-black/60 glass px-2 py-0.5 rounded-full">{label}</span>
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => handleTermClick({
                            name: pillar.gan,
                            position: `${label}天干`,
                            jiXiong: getJiXiongFromShiShen(shiShen),
                          })}
                          className={cn(
                            'text-3xl font-bold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer hover:drop-shadow-[0_0_15px_currentColor]',
                            getWuXingTextClass(ganWuXing)
                          )}
                        >
                          {pillar.gan}
                        </button>
                        <button
                          onClick={() => handleTermClick({
                            name: pillar.zhi,
                            position: `${label}地支`,
                          })}
                          className={cn(
                            'text-3xl font-bold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer hover:drop-shadow-[0_0_15px_currentColor]',
                            getWuXingTextClass(zhiWuXing)
                          )}
                        >
                          {pillar.zhi}
                        </button>
                      </div>
                      <button
                        onClick={() => handleTermClick({
                          name: shiShen,
                          position: `${label}十神`,
                          jiXiong: getJiXiongFromShiShen(shiShen),
                        })}
                        className={cn('tag', getJiXiongClass(getJiXiongFromShiShen(shiShen)))}
                      >
                        {shiShen}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="module-title mb-4">地支藏干</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['年', '月', '日', '时'].map((label, i) => {
                  const cangGan = [baZi.cangGan.year, baZi.cangGan.month, baZi.cangGan.day, baZi.cangGan.hour][i];
                  const zhi = [baZi.siZhu.year.zhi, baZi.siZhu.month.zhi, baZi.siZhu.day.zhi, baZi.siZhu.hour.zhi][i];

                  return (
                    <div key={label} className="glass-card p-4 transition-all duration-300 hover:-translate-y-1">
                      <div className="text-xs text-black/60 mb-3 text-center glass px-2 py-1 rounded-full inline-block mx-auto w-full">
                        {label}支 · {zhi}
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button
                          onClick={() => handleTermClick({ name: cangGan.benQi, position: `${label}支本气` })}
                          className={cn(
                            'tag cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:scale-105',
                            getWuXingClass(TIAN_GAN_WU_XING[cangGan.benQi])
                          )}
                        >
                          {cangGan.benQi}
                          <span className="ml-1 opacity-60 text-xs">本</span>
                        </button>
                        {cangGan.zhongQi && (
                          <button
                            onClick={() => handleTermClick({ name: cangGan.zhongQi!, position: `${label}支中气` })}
                            className={cn(
                              'tag cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:scale-105',
                              getWuXingClass(TIAN_GAN_WU_XING[cangGan.zhongQi!])
                            )}
                          >
                            {cangGan.zhongQi}
                            <span className="ml-1 opacity-60 text-xs">中</span>
                          </button>
                        )}
                        {cangGan.yuQi && (
                          <button
                            onClick={() => handleTermClick({ name: cangGan.yuQi!, position: `${label}支余气` })}
                            className={cn(
                              'tag cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:scale-105',
                              getWuXingClass(TIAN_GAN_WU_XING[cangGan.yuQi!])
                            )}
                          >
                            {cangGan.yuQi}
                            <span className="ml-1 opacity-60 text-xs">余</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="module-title mb-4">神煞</h2>
              <div className="glass-card p-4">
                <div className="flex flex-wrap gap-2">
                  {baZi.shenSha.map((sha, i) => (
                    <button
                      key={i}
                      onClick={() => handleTermClick({
                        name: sha.name,
                        jiXiong: sha.type,
                      })}
                      className={cn(
                        'tag transition-all duration-200 hover:-translate-y-0.5 hover:scale-105',
                        getJiXiongClass(sha.type)
                      )}
                    >
                      {sha.icon && <span className="mr-1">{sha.icon}</span>}
                      {sha.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="module-title mb-4">大运走势</h2>
              <div className="overflow-x-auto scrollbar-thin -mx-4 px-4">
                <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
                  {baZi.daYun.map((yun, i) => (
                    <div
                      key={i}
                      className={cn(
                        'glass-card p-4 min-w-[90px] flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-1',
                        yun.jiXiong === '吉' && 'border-green-500/30',
                        yun.jiXiong === '凶' && 'border-red-500/30'
                      )}
                    >
                      <span className="text-xs text-black/60">{yun.startAge}-{yun.endAge}岁</span>
                      <button
                        onClick={() => handleTermClick({
                          name: `${yun.gan}${yun.zhi}`,
                          position: `${yun.startAge}-${yun.endAge}岁大运`,
                          jiXiong: yun.jiXiong,
                        })}
                        className={cn(
                          'text-2xl font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:drop-shadow-[0_0_12px_currentColor]',
                          getWuXingTextClass(TIAN_GAN_WU_XING[yun.gan])
                        )}
                      >
                        {yun.gan}{yun.zhi}
                      </button>
                      <button
                        onClick={() => handleTermClick({
                          name: yun.shiShen,
                          position: `${yun.startAge}-${yun.endAge}岁大运十神`,
                          jiXiong: getJiXiongFromShiShen(yun.shiShen),
                        })}
                        className={cn(
                          'tag text-xs cursor-pointer transition-all duration-200 hover:-translate-y-0.5',
                          getJiXiongClass(getJiXiongFromShiShen(yun.shiShen))
                        )}
                      >
                        {yun.shiShen}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="module-title mb-4">流年运势</h2>
              <div className="overflow-x-auto scrollbar-thin -mx-4 px-4">
                <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
                  {baZi.liuNian.map((nian, i) => (
                    <div
                      key={i}
                      className={cn(
                        'glass-card p-3 min-w-[75px] flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-1',
                        nian.jiXiong === '吉' && 'border-green-500/30',
                        nian.jiXiong === '凶' && 'border-red-500/30'
                      )}
                    >
                      <span className="text-xs text-black/60">{nian.year}年</span>
                      <button
                        onClick={() => handleTermClick({
                          name: `${nian.gan}${nian.zhi}`,
                          position: `${nian.year}年流年`,
                          jiXiong: nian.jiXiong,
                        })}
                        className={cn(
                          'text-xl font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:drop-shadow-[0_0_10px_currentColor]',
                          getWuXingTextClass(TIAN_GAN_WU_XING[nian.gan])
                        )}
                      >
                        {nian.gan}{nian.zhi}
                      </button>
                      <button
                        onClick={() => handleTermClick({
                          name: nian.shiShen,
                          position: `${nian.year}年流年十神`,
                          jiXiong: getJiXiongFromShiShen(nian.shiShen),
                        })}
                        className={cn(
                          'tag text-xs cursor-pointer transition-all duration-200 hover:-translate-y-0.5',
                          getJiXiongClass(getJiXiongFromShiShen(nian.shiShen))
                        )}
                      >
                        {nian.shiShen}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ziwei' && (
          <div className="space-y-6">
            <div>
              <h2 className="module-title mb-4">十二宫命盘</h2>
              <div className="glass-card p-4 md:p-6">
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                  {ziWei.gongWei.map((gong, i) => (
                    <div
                      key={i}
                      className={cn(
                        'glass-card p-3 text-center transition-all duration-300 hover:-translate-y-1',
                        gong.jiXiong === '吉' && 'border-green-500/20',
                        gong.jiXiong === '凶' && 'border-red-500/20'
                      )}
                    >
                      <button
                        onClick={() => handleTermClick({
                          name: gong.name,
                          position: '紫微斗数十二宫',
                          jiXiong: gong.jiXiong,
                        })}
                        className="text-sm font-semibold text-white mb-2 cursor-pointer hover:text-amber-400 transition-colors"
                      >
                        {gong.name}
                      </button>
                      <div className="flex flex-wrap gap-1 justify-center mb-1">
                        {gong.zhuXing.map((star, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleTermClick({
                              name: star,
                              position: `${gong.name}主星`,
                            })}
                            className="text-xs text-amber-400 cursor-pointer hover:-translate-y-0.5 transition-transform hover:text-amber-300 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                          >
                            {star}
                          </button>
                        ))}
                        {gong.zhuXing.length === 0 && <span className="text-xs text-black/50">-</span>}
                      </div>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {gong.fuXing.slice(0, 3).map((star, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleTermClick({
                              name: star,
                              position: `${gong.name}辅星`,
                            })}
                            className="text-xs text-black/70 cursor-pointer hover:-translate-y-0.5 transition-transform hover:text-slate-200"
                          >
                            {star}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="module-title mb-4">四化飞星</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { key: 'huaLu', label: '化禄', color: 'text-green-400', bg: 'from-green-500/20 to-green-600/10' },
                  { key: 'huaQuan', label: '化权', color: 'text-red-400', bg: 'from-red-500/20 to-red-600/10' },
                  { key: 'huaKe', label: '化科', color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-600/10' },
                  { key: 'huaJi', label: '化忌', color: 'text-black/70', bg: 'from-slate-500/20 to-slate-600/10' },
                ].map(({ key, label, color, bg }) => {
                  const siHua = ziWei.siHua[key as keyof typeof ziWei.siHua];
                  return (
                    <button
                      key={key}
                      onClick={() => handleTermClick({
                        name: siHua.star,
                        position: `${label}·${siHua.gong}`,
                      })}
                      className={cn('glass-card p-4 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1', `bg-gradient-to-br ${bg}`)}
                    >
                      <div className={cn('text-sm font-semibold mb-2', color)}>{label}</div>
                      <div className="text-xl font-bold text-white">{siHua.star}</div>
                      <div className="text-xs text-black/60 mt-1">→ {siHua.gong}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bazhai' && (
          <div className="space-y-6">
            <div className="glass-card p-8 text-center">
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 blur-2xl animate-pulse-glow" />
                <div className="relative text-6xl md:text-7xl font-bold text-gradient mb-3">
                  {baZhai.mingGua}
                </div>
              </div>
              <div className="text-sm text-black/70 mt-4">
                <span className="text-amber-400">{baZhai.mingGuaWuXing}</span>命 · {birthInfo.gender}命
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="module-title mb-4">四吉方</h2>
                <div className="space-y-3">
                  {baZhai.siJiFang.map((fang, i) => (
                    <button
                      key={i}
                      onClick={() => handleTermClick({
                        name: fang.name,
                        position: `${fang.direction}（${fang.angle}°）`,
                        jiXiong: '吉',
                      })}
                      className="glass-card p-4 w-full text-left cursor-pointer hover:border-green-500/30 transition-all duration-300 hover:-translate-y-1 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-green-400 group-hover:text-green-300 transition-colors">{fang.name}</span>
                        <span className="text-xs text-black/60 glass px-2 py-0.5 rounded-full">{fang.direction}</span>
                      </div>
                      <p className="text-xs text-black/70">{fang.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="module-title mb-4">四凶方</h2>
                <div className="space-y-3">
                  {baZhai.siXiongFang.map((fang, i) => (
                    <button
                      key={i}
                      onClick={() => handleTermClick({
                        name: fang.name,
                        position: `${fang.direction}（${fang.angle}°）`,
                        jiXiong: '凶',
                      })}
                      className="glass-card p-4 w-full text-left cursor-pointer hover:border-red-500/30 transition-all duration-300 hover:-translate-y-1 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-red-400 group-hover:text-red-300 transition-colors">{fang.name}</span>
                        <span className="text-xs text-black/60 glass px-2 py-0.5 rounded-full">{fang.direction}</span>
                      </div>
                      <p className="text-xs text-black/70">{fang.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="glass-card p-4 text-center">
          <p className="text-xs text-black/60">
            ✨ 本排盘仅供传统文化娱乐研究，不构成任何决策建议
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
