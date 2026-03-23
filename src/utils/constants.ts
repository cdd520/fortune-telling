import { WuXing, TianGan, DiZhi, ShiShen, JiXiong } from '@/types';

export const TIAN_GAN: TianGan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const DI_ZHI: DiZhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const WU_XING: WuXing[] = ['木', '火', '土', '金', '水'];

export const TIAN_GAN_WU_XING: Record<TianGan, WuXing> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

export const DI_ZHI_WU_XING: Record<DiZhi, WuXing> = {
  '子': '水', '丑': '土',
  '寅': '木', '卯': '木',
  '辰': '土', '巳': '火',
  '午': '火', '未': '土',
  '申': '金', '酉': '金',
  '戌': '土', '亥': '水',
};

export const TIAN_GAN_YIN_YANG: Record<TianGan, '阳' | '阴'> = {
  '甲': '阳', '乙': '阴',
  '丙': '阳', '丁': '阴',
  '戊': '阳', '己': '阴',
  '庚': '阳', '辛': '阴',
  '壬': '阳', '癸': '阴',
};

export const DI_ZHI_YIN_YANG: Record<DiZhi, '阳' | '阴'> = {
  '子': '阳', '丑': '阴',
  '寅': '阳', '卯': '阴',
  '辰': '阳', '巳': '阴',
  '午': '阳', '未': '阴',
  '申': '阳', '酉': '阴',
  '戌': '阳', '亥': '阴',
};

export const SHI_CHEN: Record<string, { start: number; end: number; name: string }> = {
  '子': { start: 23, end: 1, name: '子时' },
  '丑': { start: 1, end: 3, name: '丑时' },
  '寅': { start: 3, end: 5, name: '寅时' },
  '卯': { start: 5, end: 7, name: '卯时' },
  '辰': { start: 7, end: 9, name: '辰时' },
  '巳': { start: 9, end: 11, name: '巳时' },
  '午': { start: 11, end: 13, name: '午时' },
  '未': { start: 13, end: 15, name: '未时' },
  '申': { start: 15, end: 17, name: '申时' },
  '酉': { start: 17, end: 19, name: '酉时' },
  '戌': { start: 19, end: 21, name: '戌时' },
  '亥': { start: 21, end: 23, name: '亥时' },
};

export const DI_ZHI_CANG_GAN: Record<DiZhi, { benQi: TianGan; zhongQi?: TianGan; yuQi?: TianGan }> = {
  '子': { benQi: '癸' },
  '丑': { benQi: '己', zhongQi: '癸', yuQi: '辛' },
  '寅': { benQi: '甲', zhongQi: '丙', yuQi: '戊' },
  '卯': { benQi: '乙' },
  '辰': { benQi: '戊', zhongQi: '乙', yuQi: '癸' },
  '巳': { benQi: '丙', zhongQi: '戊', yuQi: '庚' },
  '午': { benQi: '丁', zhongQi: '己' },
  '未': { benQi: '己', zhongQi: '丁', yuQi: '乙' },
  '申': { benQi: '庚', zhongQi: '壬', yuQi: '戊' },
  '酉': { benQi: '辛' },
  '戌': { benQi: '戊', zhongQi: '辛', yuQi: '丁' },
  '亥': { benQi: '壬', zhongQi: '甲' },
};

export function getWuXingColor(wuXing: WuXing): string {
  const colors: Record<WuXing, string> = {
    '木': '#22c55e',
    '火': '#ef4444',
    '土': '#eab308',
    '金': '#f8fafc',
    '水': '#1e293b',
  };
  return colors[wuXing];
}

export function getJiXiongColor(jiXiong: JiXiong): string {
  const colors: Record<JiXiong, string> = {
    '吉': '#fbbf24',
    '凶': '#dc2626',
    '平': '#6b7280',
  };
  return colors[jiXiong];
}

export function getTianGanIndex(gan: TianGan): number {
  return TIAN_GAN.indexOf(gan);
}

export function getDiZhiIndex(zhi: DiZhi): number {
  return DI_ZHI.indexOf(zhi);
}

export function getHourZhi(hour: number): DiZhi {
  if (hour === 23 || hour === 0) return '子';
  if (hour >= 1 && hour < 3) return '丑';
  if (hour >= 3 && hour < 5) return '寅';
  if (hour >= 5 && hour < 7) return '卯';
  if (hour >= 7 && hour < 9) return '辰';
  if (hour >= 9 && hour < 11) return '巳';
  if (hour >= 11 && hour < 13) return '午';
  if (hour >= 13 && hour < 15) return '未';
  if (hour >= 15 && hour < 17) return '申';
  if (hour >= 17 && hour < 19) return '酉';
  if (hour >= 19 && hour < 21) return '戌';
  return '亥';
}

export function calculateShiShen(riGan: TianGan, targetGan: TianGan): ShiShen {
  const riIndex = getTianGanIndex(riGan);
  const targetIndex = getTianGanIndex(targetGan);
  const diff = (targetIndex - riIndex + 10) % 10;
  
  const riWuXing = TIAN_GAN_WU_XING[riGan];
  const targetWuXing = TIAN_GAN_WU_XING[targetGan];
  const riYinYang = TIAN_GAN_YIN_YANG[riGan];
  
  if (riWuXing === targetWuXing) {
    return riYinYang === TIAN_GAN_YIN_YANG[targetGan] ? '比肩' : '劫财';
  }
  
  const wuXingOrder: WuXing[] = ['木', '火', '土', '金', '水'];
  const riWuXingIndex = wuXingOrder.indexOf(riWuXing);
  const targetWuXingIndex = wuXingOrder.indexOf(targetWuXing);
  const wuXingDiff = (targetWuXingIndex - riWuXingIndex + 5) % 5;
  
  const sameYinYang = riYinYang === TIAN_GAN_YIN_YANG[targetGan];
  
  if (wuXingDiff === 1) {
    return sameYinYang ? '食神' : '伤官';
  } else if (wuXingDiff === 2) {
    return sameYinYang ? '偏财' : '正财';
  } else if (wuXingDiff === 3) {
    return sameYinYang ? '七杀' : '正官';
  } else if (wuXingDiff === 4) {
    return sameYinYang ? '偏印' : '正印';
  }
  
  return '比肩';
}

export function wuXingShengKe(wuXing1: WuXing, wuXing2: WuXing): '生' | '克' | '被生' | '被克' | '同' {
  if (wuXing1 === wuXing2) return '同';
  
  const shengMap: Record<WuXing, WuXing> = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木',
  };
  
  const keMap: Record<WuXing, WuXing> = {
    '木': '土', '土': '水', '水': '火', '火': '金', '金': '木',
  };
  
  if (shengMap[wuXing1] === wuXing2) return '生';
  if (shengMap[wuXing2] === wuXing1) return '被生';
  if (keMap[wuXing1] === wuXing2) return '克';
  if (keMap[wuXing2] === wuXing1) return '被克';
  
  return '同';
}
