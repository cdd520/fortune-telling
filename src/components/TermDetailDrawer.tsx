'use client';

import { Term } from '@/types';
import { getTermByName } from '@/data/terms';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

import { X, Sparkles, Info, Lightbulb, MapPin } from 'lucide-react';

interface TermDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  termName: string;
  contextInfo?: {
    position?: string;
    strength?: string;
    jiXiong?: '吉' | '凶' | '平';
  };
}

export default function TermDetailDrawer({
  open,
  onOpenChange,
  termName,
  contextInfo,
}: TermDetailDrawerProps) {
  if (!termName || !open) {
    return null;
  }

  const termData = getTermByName(termName);

  if (!termData) {
    return null;
  }

  const getJiXiongClass = (jiXiong?: '吉' | '凶' | '平') => {
    switch (jiXiong) {
      case '吉':
        return 'tag-lucky';
      case '凶':
        return 'tag-unlucky';
      default:
        return 'tag-neutral';
    }
  };

  const getWuXingClass = (wuXing?: string) => {
    switch (wuXing) {
      case '木':
        return 'tag-wuxing-wood';
      case '火':
        return 'tag-wuxing-fire';
      case '土':
        return 'tag-wuxing-earth';
      case '金':
        return 'tag-wuxing-metal';
      case '水':
        return 'tag-wuxing-water';
      default:
        return '';
    }
  };
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="w-[400px] max-w-[90vw] h-full right-0 left-auto data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right">
        <DrawerHeader className="border-b border-purple-500/20 bg-gradient-to-b from-purple-500/10 to-transparent">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/30 to-amber-500/30 blur-xl animate-pulse-glow" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-amber-500/20 flex items-center justify-center border border-purple-500/30">
                {termData.icon ? (
                  <span className="text-3xl">{termData.icon}</span>
                ) : (
                  <Sparkles className="w-8 h-8 text-amber-400" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <DrawerTitle className="text-2xl font-bold text-gradient mb-2">
                {termData.name}
              </DrawerTitle>
              <div className="flex flex-wrap gap-2">
                {termData.wuXing && (
                  <span className={cn('tag text-xs', getWuXingClass(termData.wuXing))}>
                    {termData.wuXing}
                  </span>
                )}
                {termData.jiXiong && (
                  <span className={cn('tag text-xs', getJiXiongClass(termData.jiXiong))}>
                    {termData.jiXiong}
                  </span>
                )}
              </div>
            </div>
          </div>
          <DrawerClose className="absolute right-4 top-4 w-8 h-8 rounded-lg bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/70 hover:text-black transition-all duration-200 border border-black/10">
            <X className="w-4 h-4" />
          </DrawerClose>
        </DrawerHeader>
        <DrawerBody className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          <div className="mystic-card">
            <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              通俗解释
            </h3>
            <p className="text-sm text-black/80 leading-relaxed">
              {termData.plainMeaning}
            </p>
          </div>
          
          <div className="mystic-card">
            <h3 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              命盘定位
            </h3>
            <div className="space-y-3">
              {contextInfo?.position && (
                <div className="flex items-start gap-3">
                  <span className="text-xs text-black/60 mt-0.5 w-12 flex-shrink-0">位置</span>
                  <span className="text-sm text-black/80">{contextInfo.position}</span>
                </div>
              )}
              {contextInfo?.strength && (
                <div className="flex items-start gap-3">
                  <span className="text-xs text-black/60 mt-0.5 w-12 flex-shrink-0">力量</span>
                  <span className="text-sm text-black/80">{contextInfo.strength}</span>
                </div>
              )}
              <div className="flex items-start gap-3">
                <span className="text-xs text-black/60 mt-0.5 w-12 flex-shrink-0">吉凶</span>
                <span className={cn(
                  'text-sm font-medium',
                  contextInfo?.jiXiong === '吉' ? 'text-emerald-400' :
                  contextInfo?.jiXiong === '凶' ? 'text-rose-400' : 'text-black/70'
                )}>
                  {contextInfo?.jiXiong || termData.jiXiong || '平'}
                </span>
              </div>
              <p className="text-sm text-black/75 leading-relaxed mt-3 pt-3 border-t border-white/10">
                {termData.influence}
              </p>
            </div>
          </div>
          
          <div className="mystic-card">
            <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              参考建议
            </h3>
            <p className="text-sm text-black/80 leading-relaxed">
              {getAdvice(termData, contextInfo)}
            </p>
          </div>
        </DrawerBody>
        <DrawerFooter className="border-t border-purple-500/20 bg-gradient-to-t from-purple-500/5 to-transparent">
          <button
            onClick={() => onOpenChange(false)}
            className="btn-secondary w-full"
          >
            关闭
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function getAdvice(term: Term, contextInfo?: { jiXiong?: '吉' | '凶' | '平' }): string {
  const jiXiong = contextInfo?.jiXiong || term.jiXiong;
  
  if (jiXiong === '吉') {
    return `「${term.name}」是命盘中的吉星，建议顺势而为，把握机遇，在相关领域多加努力，往往能获得不错的结果。`;
  } else if (jiXiong === '凶') {
    return `「${term.name}」在命盘中需要留意，建议保持谨慎，遇事多思考，避免冲动决策，以稳健为主。`;
  }
  
  return `「${term.name}」是命盘中的中性元素，建议保持平常心，顺其自然，不必过分在意。`;
}
