export type WuXing = '木' | '火' | '土' | '金' | '水';
export type TianGan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type DiZhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';
export type ShiShen = '比肩' | '劫财' | '食神' | '伤官' | '偏财' | '正财' | '七杀' | '正官' | '偏印' | '正印';
export type JiXiong = '吉' | '凶' | '平';

export interface BirthInfo {
  date: string;
  isLunar: boolean;
  time: string;
  hourUnknown: boolean;
  location: {
    city: string;
    longitude: number;
    latitude: number;
    timezone: number;
  };
  gender: '男' | '女';
}

export interface SiZhu {
  year: { gan: TianGan; zhi: DiZhi };
  month: { gan: TianGan; zhi: DiZhi };
  day: { gan: TianGan; zhi: DiZhi };
  hour: { gan: TianGan; zhi: DiZhi };
}

export interface CangGan {
  benQi: TianGan;
  zhongQi?: TianGan;
  yuQi?: TianGan;
}

export interface ShenSha {
  name: string;
  type: JiXiong;
  description: string;
  plainMeaning: string;
  icon: string;
}

export interface DaYun {
  startAge: number;
  endAge: number;
  gan: TianGan;
  zhi: DiZhi;
  shiShen: ShiShen;
  jiXiong: JiXiong;
}

export interface LiuNian {
  year: number;
  gan: TianGan;
  zhi: DiZhi;
  shiShen: ShiShen;
  jiXiong: JiXiong;
}

export interface BaZiResult {
  siZhu: SiZhu;
  riZhu: TianGan;
  riZhuWuXing: WuXing;
  cangGan: {
    year: CangGan;
    month: CangGan;
    day: CangGan;
    hour: CangGan;
  };
  shiShen: {
    year: ShiShen;
    month: ShiShen;
    day: ShiShen;
    hour: ShiShen;
  };
  shenSha: ShenSha[];
  daYun: DaYun[];
  liuNian: LiuNian[];
  wuXingCount: Record<WuXing, number>;
  wuXingMissing: WuXing[];
  wuXingStrong: WuXing[];
}

export interface ZiWeiGong {
  name: string;
  position: number;
  zhuXing: string[];
  fuXing: string[];
  siHua: string[];
  jiXiong: JiXiong;
}

export interface ZiWeiResult {
  gongWei: ZiWeiGong[];
  mingGong: number;
  shenZhi: DiZhi;
  siHua: {
    huaLu: { star: string; gong: string };
    huaQuan: { star: string; gong: string };
    huaKe: { star: string; gong: string };
    huaJi: { star: string; gong: string };
  };
}

export interface BaZhaiResult {
  mingGua: string;
  mingGuaWuXing: WuXing;
  siJiFang: {
    name: string;
    direction: string;
    angle: number;
    description: string;
  }[];
  siXiongFang: {
    name: string;
    direction: string;
    angle: number;
    description: string;
  }[];
}

export interface FortuneScore {
  career: number;
  love: number;
  wealth: number;
  health: number;
}

export interface MonthlyFortune {
  month: number;
  jiXiong: JiXiong;
  keywords: string[];
  advice: string;
}

export interface PlainResult {
  summary: string;
  personality: string;
  wuXingAnalysis: string;
  fortuneScore: FortuneScore;
  fortuneDetails: {
    career: { score: number; description: string; advice: string };
    love: { score: number; description: string; advice: string };
    wealth: { score: number; description: string; advice: string };
    health: { score: number; description: string; advice: string };
  };
  monthlyFortune: MonthlyFortune[];
  fengShuiAdvice: string;
}

export interface CalculationResult {
  id: string;
  createdAt: string;
  birthInfo: BirthInfo;
  baZi: BaZiResult;
  ziWei: ZiWeiResult;
  baZhai: BaZhaiResult;
  plainResult: PlainResult;
}

export interface Term {
  name: string;
  category: '天干' | '地支' | '十神' | '神煞' | '星曜' | '宫位' | '风水' | '五行' | '卦象';
  wuXing?: WuXing;
  jiXiong?: JiXiong;
  meaning: string;
  plainMeaning: string;
  influence: string;
  icon?: string;
}

export type ViewMode = 'plain' | 'professional';
export type ThemeMode = 'light' | 'dark' | 'system';
export type DeviceMode = 'desktop' | 'mobile';
