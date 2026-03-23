import { 
  BirthInfo, 
  SiZhu, 
  BaZiResult, 
  CangGan, 
  ShenSha, 
  DaYun, 
  LiuNian,
  TianGan,
  DiZhi,
  WuXing,
  JiXiong
} from '@/types';
import { 
  TIAN_GAN, 
  DI_ZHI, 
  TIAN_GAN_WU_XING, 
  DI_ZHI_WU_XING,
  DI_ZHI_CANG_GAN,
  getHourZhi,
  calculateShiShen,
  getTianGanIndex,
  getDiZhiIndex
} from './constants';

const JIE_QI_DATES = [
  { month: 2, day: 4, name: '立春' },
  { month: 2, day: 19, name: '雨水' },
  { month: 3, day: 6, name: '惊蛰' },
  { month: 3, day: 21, name: '春分' },
  { month: 4, day: 5, name: '清明' },
  { month: 4, day: 20, name: '谷雨' },
  { month: 5, day: 6, name: '立夏' },
  { month: 5, day: 21, name: '小满' },
  { month: 6, day: 6, name: '芒种' },
  { month: 6, day: 21, name: '夏至' },
  { month: 7, day: 7, name: '小暑' },
  { month: 7, day: 23, name: '大暑' },
  { month: 8, day: 8, name: '立秋' },
  { month: 8, day: 23, name: '处暑' },
  { month: 9, day: 8, name: '白露' },
  { month: 9, day: 23, name: '秋分' },
  { month: 10, day: 8, name: '寒露' },
  { month: 10, day: 24, name: '霜降' },
  { month: 11, day: 8, name: '立冬' },
  { month: 11, day: 22, name: '小雪' },
  { month: 12, day: 7, name: '大雪' },
  { month: 12, day: 22, name: '冬至' },
  { month: 1, day: 6, name: '小寒' },
  { month: 1, day: 20, name: '大寒' },
];

function getLunarYear(year: number, month: number, day: number): number {
  let lunarYear = year;
  const springDate = getSpringFestivalDate(year);
  const current = new Date(year, month - 1, day);
  if (current < springDate) {
    lunarYear = year - 1;
  }
  return lunarYear;
}

function getSpringFestivalDate(year: number): Date {
  return new Date(year, 1, 4);
}

function getYearGanZhi(year: number): { gan: TianGan; zhi: DiZhi } {
  const ganIndex = (year - 4) % 10;
  const zhiIndex = (year - 4) % 12;
  return {
    gan: TIAN_GAN[ganIndex >= 0 ? ganIndex : ganIndex + 10],
    zhi: DI_ZHI[zhiIndex >= 0 ? zhiIndex : zhiIndex + 12],
  };
}

function getMonthGanZhi(year: number, month: number, day: number): { gan: TianGan; zhi: DiZhi } {
  let adjustedMonth = month;
  const jieQi = getJieQiForDate(month, day);
  if (!jieQi.isAfterJieQi) {
    adjustedMonth = month - 1;
    if (adjustedMonth === 0) adjustedMonth = 12;
  }
  
  const yearGan = getYearGanZhi(year).gan;
  const ganIndex = (getTianGanIndex(yearGan) % 5 * 2 + adjustedMonth - 1) % 10;
  
  const zhiIndex = (adjustedMonth + 1) % 12;
  
  return {
    gan: TIAN_GAN[ganIndex],
    zhi: DI_ZHI[zhiIndex],
  };
}

function getJieQiForDate(month: number, day: number): { name: string; isAfterJieQi: boolean } {
  for (let i = 0; i < JIE_QI_DATES.length; i += 2) {
    const jie = JIE_QI_DATES[i];
    if (jie.month === month) {
      return { name: jie.name, isAfterJieQi: day >= jie.day };
    }
  }
  return { name: '', isAfterJieQi: true };
}

function getDayGanZhi(year: number, month: number, day: number): { gan: TianGan; zhi: DiZhi } {
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const ganIndex = diffDays % 10;
  const zhiIndex = diffDays % 12;
  
  return {
    gan: TIAN_GAN[ganIndex >= 0 ? ganIndex : ganIndex + 10],
    zhi: DI_ZHI[zhiIndex >= 0 ? zhiIndex : zhiIndex + 12],
  };
}

function getHourGanZhi(dayGan: TianGan, hour: number): { gan: TianGan; zhi: DiZhi } {
  const zhi = getHourZhi(hour);
  const dayGanIndex = getTianGanIndex(dayGan);
  const hourGanBase = (dayGanIndex % 5) * 2;
  const zhiIndex = getDiZhiIndex(zhi);
  const ganIndex = (hourGanBase + zhiIndex) % 10;
  
  return {
    gan: TIAN_GAN[ganIndex],
    zhi,
  };
}

function calculateShenSha(siZhu: SiZhu, gender: '男' | '女'): ShenSha[] {
  const shenSha: ShenSha[] = [];
  const { year, day } = siZhu;
  const riGan = day.gan;
  const nianZhi = year.zhi;
  const riZhi = day.zhi;
  
  const tianYiGuiRen: Record<TianGan, DiZhi[]> = {
    '甲': ['丑', '未'],
    '乙': ['子', '申'],
    '丙': ['亥', '酉'],
    '丁': ['亥', '酉'],
    '戊': ['丑', '未'],
    '己': ['子', '申'],
    '庚': ['丑', '未'],
    '辛': ['午', '寅'],
    '壬': ['卯', '巳'],
    '癸': ['卯', '巳'],
  };
  
  if (tianYiGuiRen[riGan].includes(nianZhi) || tianYiGuiRen[riGan].includes(riZhi)) {
    shenSha.push({
      name: '天乙贵人',
      type: '吉',
      description: '命中贵人，遇难呈祥，逢凶化吉',
      plainMeaning: '你命中带有贵人星，在关键时刻总会有人伸出援手，帮你化解困难',
      icon: '🌟',
    });
  }
  
  const taiJiGuiRen: Record<TianGan, DiZhi[]> = {
    '甲': ['子', '午'],
    '乙': ['子', '午'],
    '丙': ['卯', '酉'],
    '丁': ['卯', '酉'],
    '戊': ['辰', '戌', '丑', '未'],
    '己': ['辰', '戌', '丑', '未'],
    '庚': ['寅', '亥'],
    '辛': ['寅', '亥'],
    '壬': ['巳', '申'],
    '癸': ['巳', '申'],
  };
  
  if (taiJiGuiRen[riGan].some(zhi => nianZhi === zhi || riZhi === zhi)) {
    shenSha.push({
      name: '太极贵人',
      type: '吉',
      description: '聪明好学，喜神秘文化，有钻研精神',
      plainMeaning: '你对神秘事物有浓厚兴趣，喜欢研究命理、玄学等传统文化',
      icon: '☯️',
    });
  }
  
  const taoHua: Record<DiZhi, DiZhi> = {
    '子': '酉', '丑': '午', '寅': '卯', '卯': '子',
    '辰': '酉', '巳': '午', '午': '卯', '未': '子',
    '申': '酉', '酉': '午', '戌': '卯', '亥': '子',
  };
  
  const taoHuaZhi = ['子', '午', '卯', '酉'];
  if (taoHuaZhi.includes(nianZhi) || taoHuaZhi.includes(riZhi)) {
    shenSha.push({
      name: '桃花',
      type: '平',
      description: '人缘好，异性缘佳，有艺术天赋',
      plainMeaning: '你天生有好人缘，容易获得异性的好感，在感情方面有独特的魅力',
      icon: '🌸',
    });
  }
  
  const yiMa: Record<DiZhi, DiZhi[]> = {
    '寅': ['申'], '申': ['寅'],
    '巳': ['亥'], '亥': ['巳'],
    '子': [], '丑': ['亥'],
    '卯': ['巳'], '辰': [],
    '午': ['申'], '未': [],
    '酉': ['亥'], '戌': [],
  };
  
  const yiMaMap: Record<DiZhi, DiZhi> = {
    '寅': '申', '午': '申', '戌': '申',
    '申': '寅', '子': '寅', '辰': '寅',
    '巳': '亥', '酉': '亥', '丑': '亥',
    '亥': '巳', '卯': '巳', '未': '巳',
  };
  
  if (yiMaMap[nianZhi] === riZhi || yiMaMap[riZhi] === nianZhi) {
    shenSha.push({
      name: '驿马',
      type: '平',
      description: '奔波劳碌，适合外出发展，变动多',
      plainMeaning: '你的人生可能多变动，适合外出发展，旅行或出差机会较多',
      icon: '🐴',
    });
  }
  
  const yangRen: Record<TianGan, DiZhi> = {
    '甲': '卯', '乙': '寅',
    '丙': '午', '丁': '巳',
    '戊': '午', '己': '巳',
    '庚': '酉', '辛': '申',
    '壬': '子', '癸': '亥',
  };
  
  if (yangRen[riGan] === riZhi) {
    shenSha.push({
      name: '羊刃',
      type: '凶',
      description: '性格刚强，易冲动，需注意血光之灾',
      plainMeaning: '你性格比较刚强，做事有冲劲，但有时容易冲动，需要学会控制情绪',
      icon: '⚔️',
    });
  }
  
  const huaGai: Record<DiZhi, DiZhi[]> = {
    '寅': ['戌'], '午': ['戌'], '戌': ['戌'],
    '申': ['辰'], '子': ['辰'], '辰': ['辰'],
    '巳': ['丑'], '酉': ['丑'], '丑': ['丑'],
    '亥': ['未'], '卯': ['未'], '未': ['未'],
  };
  
  const huaGaiMap: Record<DiZhi, DiZhi> = {
    '寅': '戌', '午': '戌', '戌': '戌',
    '申': '辰', '子': '辰', '辰': '辰',
    '巳': '丑', '酉': '丑', '丑': '丑',
    '亥': '未', '卯': '未', '未': '未',
  };
  
  if (huaGaiMap[nianZhi] === riZhi || huaGaiMap[riZhi]) {
    shenSha.push({
      name: '华盖',
      type: '平',
      description: '聪明孤傲，喜艺术宗教，有独特见解',
      plainMeaning: '你思维独特，对艺术、宗教、哲学有天赋，有时会感到孤独',
      icon: '🎭',
    });
  }
  
  return shenSha;
}

function calculateDaYun(
  siZhu: SiZhu, 
  gender: '男' | '女', 
  birthYear: number
): DaYun[] {
  const daYun: DaYun[] = [];
  const monthGan = siZhu.month.gan;
  const monthZhi = siZhu.month.zhi;
  
  const isForward = (gender === '男' && TIAN_GAN.indexOf(monthGan) % 2 === 0) ||
                    (gender === '女' && TIAN_GAN.indexOf(monthGan) % 2 === 1);
  
  const qiYunAge = 8;
  
  for (let i = 0; i < 8; i++) {
    let ganIndex = getTianGanIndex(monthGan);
    let zhiIndex = getDiZhiIndex(monthZhi);
    
    if (isForward) {
      ganIndex = (ganIndex + i + 1) % 10;
      zhiIndex = (zhiIndex + i + 1) % 12;
    } else {
      ganIndex = (ganIndex - i - 1 + 10) % 10;
      zhiIndex = (zhiIndex - i - 1 + 12) % 12;
    }
    
    const gan = TIAN_GAN[ganIndex];
    const zhi = DI_ZHI[zhiIndex];
    const shiShen = calculateShiShen(siZhu.day.gan, gan);
    
    let jiXiong: JiXiong = '平';
    if (['比肩', '食神', '正财', '正官', '正印'].includes(shiShen)) {
      jiXiong = '吉';
    } else if (['劫财', '伤官', '七杀', '偏印'].includes(shiShen)) {
      jiXiong = '凶';
    }
    
    daYun.push({
      startAge: qiYunAge + i * 10,
      endAge: qiYunAge + i * 10 + 9,
      gan,
      zhi,
      shiShen,
      jiXiong,
    });
  }
  
  return daYun;
}

function calculateLiuNian(currentYear: number, siZhu: SiZhu): LiuNian[] {
  const liuNian: LiuNian[] = [];
  
  for (let i = 0; i < 6; i++) {
    const year = currentYear + i;
    const ganZhi = getYearGanZhi(year);
    const shiShen = calculateShiShen(siZhu.day.gan, ganZhi.gan);
    
    let jiXiong: JiXiong = '平';
    if (['比肩', '食神', '正财', '正官', '正印'].includes(shiShen)) {
      jiXiong = '吉';
    } else if (['劫财', '伤官', '七杀', '偏印'].includes(shiShen)) {
      jiXiong = '凶';
    }
    
    liuNian.push({
      year,
      gan: ganZhi.gan,
      zhi: ganZhi.zhi,
      shiShen,
      jiXiong,
    });
  }
  
  return liuNian;
}

function countWuXing(siZhu: SiZhu): Record<WuXing, number> {
  const count: Record<WuXing, number> = {
    '木': 0, '火': 0, '土': 0, '金': 0, '水': 0,
  };
  
  [siZhu.year, siZhu.month, siZhu.day, siZhu.hour].forEach(pillar => {
    count[TIAN_GAN_WU_XING[pillar.gan]]++;
    count[DI_ZHI_WU_XING[pillar.zhi]]++;
  });
  
  return count;
}

export function calculateBaZi(birthInfo: BirthInfo): BaZiResult {
  const [year, month, day] = birthInfo.date.split('-').map(Number);
  const [hour] = birthInfo.time.split(':').map(Number);
  
  const yearGanZhi = getYearGanZhi(year);
  const monthGanZhi = getMonthGanZhi(year, month, day);
  const dayGanZhi = getDayGanZhi(year, month, day);
  const hourGanZhi = birthInfo.hourUnknown 
    ? { gan: TIAN_GAN[0], zhi: DI_ZHI[0] }
    : getHourGanZhi(dayGanZhi.gan, hour);
  
  const siZhu: SiZhu = {
    year: yearGanZhi,
    month: monthGanZhi,
    day: dayGanZhi,
    hour: hourGanZhi,
  };
  
  const riGan = dayGanZhi.gan;
  const riZhuWuXing = TIAN_GAN_WU_XING[riGan];
  
  const cangGan = {
    year: DI_ZHI_CANG_GAN[siZhu.year.zhi] as CangGan,
    month: DI_ZHI_CANG_GAN[siZhu.month.zhi] as CangGan,
    day: DI_ZHI_CANG_GAN[siZhu.day.zhi] as CangGan,
    hour: DI_ZHI_CANG_GAN[siZhu.hour.zhi] as CangGan,
  };
  
  const shiShen = {
    year: calculateShiShen(riGan, siZhu.year.gan),
    month: calculateShiShen(riGan, siZhu.month.gan),
    day: calculateShiShen(riGan, siZhu.day.gan),
    hour: calculateShiShen(riGan, siZhu.hour.gan),
  };
  
  const shenSha = calculateShenSha(siZhu, birthInfo.gender);
  const daYun = calculateDaYun(siZhu, birthInfo.gender, year);
  const liuNian = calculateLiuNian(new Date().getFullYear(), siZhu);
  const wuXingCount = countWuXing(siZhu);
  
  const sortedWuXing = (Object.entries(wuXingCount) as [WuXing, number][])
    .sort((a, b) => b[1] - a[1]);
  
  const wuXingMissing = sortedWuXing.filter(([_, count]) => count === 0).map(([wuxing]) => wuxing);
  const wuXingStrong = sortedWuXing.slice(0, 2).filter(([_, count]) => count >= 2).map(([wuxing]) => wuxing);
  
  return {
    siZhu,
    riZhu: riGan,
    riZhuWuXing,
    cangGan,
    shiShen,
    shenSha,
    daYun,
    liuNian,
    wuXingCount,
    wuXingMissing,
    wuXingStrong,
  };
}
