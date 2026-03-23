import { BaZhaiResult, WuXing, BirthInfo } from '@/types';

const MING_GUA_MAP: Record<string, Record<string, string>> = {
  '男': {
    '0': '坤', '1': '巽', '2': '震', '3': '坤',
    '4': '乾', '5': '兑', '6': '艮', '7': '离',
    '8': '坎', '9': '坤',
  },
  '女': {
    '0': '艮', '1': '乾', '2': '兑', '3': '艮',
    '4': '巽', '5': '震', '6': '坤', '7': '坎',
    '8': '离', '9': '艮',
  },
};

const MING_GUA_WU_XING: Record<string, WuXing> = {
  '乾': '金', '坤': '土', '震': '木', '巽': '木',
  '坎': '水', '离': '火', '艮': '土', '兑': '金',
};

const SI_JI_FANG: Record<string, { name: string; direction: string; angle: number; description: string }[]> = {
  '乾': [
    { name: '生气', direction: '西方', angle: 270, description: '大吉之位，利于事业、财运，适合做卧室或书房' },
    { name: '延年', direction: '西南', angle: 225, description: '次吉之位，利于感情、婚姻，适合做卧室' },
    { name: '天医', direction: '东北', angle: 45, description: '吉位，利于健康，适合做卧室或疗养之所' },
    { name: '伏位', direction: '西北', angle: 315, description: '平稳之位，适合做卧室，利于稳定发展' },
  ],
  '坤': [
    { name: '生气', direction: '东北', angle: 45, description: '大吉之位，利于事业、财运，适合做卧室或书房' },
    { name: '延年', direction: '西北', angle: 315, description: '次吉之位，利于感情、婚姻，适合做卧室' },
    { name: '天医', direction: '西方', angle: 270, description: '吉位，利于健康，适合做卧室或疗养之所' },
    { name: '伏位', direction: '西南', angle: 225, description: '平稳之位，适合做卧室，利于稳定发展' },
  ],
  '震': [
    { name: '生气', direction: '南方', angle: 180, description: '大吉之位，利于事业、财运，适合做卧室或书房' },
    { name: '延年', direction: '东南', angle: 135, description: '次吉之位，利于感情、婚姻，适合做卧室' },
    { name: '天医', direction: '北方', angle: 0, description: '吉位，利于健康，适合做卧室或疗养之所' },
    { name: '伏位', direction: '东方', angle: 90, description: '平稳之位，适合做卧室，利于稳定发展' },
  ],
  '巽': [
    { name: '生气', direction: '北方', angle: 0, description: '大吉之位，利于事业、财运，适合做卧室或书房' },
    { name: '延年', direction: '东方', angle: 90, description: '次吉之位，利于感情、婚姻，适合做卧室' },
    { name: '天医', direction: '南方', angle: 180, description: '吉位，利于健康，适合做卧室或疗养之所' },
    { name: '伏位', direction: '东南', angle: 135, description: '平稳之位，适合做卧室，利于稳定发展' },
  ],
  '坎': [
    { name: '生气', direction: '东南', angle: 135, description: '大吉之位，利于事业、财运，适合做卧室或书房' },
    { name: '延年', direction: '南方', angle: 180, description: '次吉之位，利于感情、婚姻，适合做卧室' },
    { name: '天医', direction: '东方', angle: 90, description: '吉位，利于健康，适合做卧室或疗养之所' },
    { name: '伏位', direction: '北方', angle: 0, description: '平稳之位，适合做卧室，利于稳定发展' },
  ],
  '离': [
    { name: '生气', direction: '东方', angle: 90, description: '大吉之位，利于事业、财运，适合做卧室或书房' },
    { name: '延年', direction: '北方', angle: 0, description: '次吉之位，利于感情、婚姻，适合做卧室' },
    { name: '天医', direction: '东南', angle: 135, description: '吉位，利于健康，适合做卧室或疗养之所' },
    { name: '伏位', direction: '南方', angle: 180, description: '平稳之位，适合做卧室，利于稳定发展' },
  ],
  '艮': [
    { name: '生气', direction: '西南', angle: 225, description: '大吉之位，利于事业、财运，适合做卧室或书房' },
    { name: '延年', direction: '西方', angle: 270, description: '次吉之位，利于感情、婚姻，适合做卧室' },
    { name: '天医', direction: '西北', angle: 315, description: '吉位，利于健康，适合做卧室或疗养之所' },
    { name: '伏位', direction: '东北', angle: 45, description: '平稳之位，适合做卧室，利于稳定发展' },
  ],
  '兑': [
    { name: '生气', direction: '西北', angle: 315, description: '大吉之位，利于事业、财运，适合做卧室或书房' },
    { name: '延年', direction: '东北', angle: 45, description: '次吉之位，利于感情、婚姻，适合做卧室' },
    { name: '天医', direction: '西南', angle: 225, description: '吉位，利于健康，适合做卧室或疗养之所' },
    { name: '伏位', direction: '西方', angle: 270, description: '平稳之位，适合做卧室，利于稳定发展' },
  ],
};

const SI_XIONG_FANG: Record<string, { name: string; direction: string; angle: number; description: string }[]> = {
  '乾': [
    { name: '绝命', direction: '南方', angle: 180, description: '大凶之位，不宜做卧室，可做储物间或卫生间' },
    { name: '五鬼', direction: '东方', angle: 90, description: '凶位，易生口舌是非，不宜做卧室或书房' },
    { name: '六煞', direction: '北方', angle: 0, description: '凶位，易招惹是非，不宜做卧室' },
    { name: '祸害', direction: '东南', angle: 135, description: '小凶之位，不宜做重要房间' },
  ],
  '坤': [
    { name: '绝命', direction: '北方', angle: 0, description: '大凶之位，不宜做卧室，可做储物间或卫生间' },
    { name: '五鬼', direction: '东南', angle: 135, description: '凶位，易生口舌是非，不宜做卧室或书房' },
    { name: '六煞', direction: '南方', angle: 180, description: '凶位，易招惹是非，不宜做卧室' },
    { name: '祸害', direction: '东方', angle: 90, description: '小凶之位，不宜做重要房间' },
  ],
  '震': [
    { name: '绝命', direction: '西方', angle: 270, description: '大凶之位，不宜做卧室，可做储物间或卫生间' },
    { name: '五鬼', direction: '西北', angle: 315, description: '凶位，易生口舌是非，不宜做卧室或书房' },
    { name: '六煞', direction: '东北', angle: 45, description: '凶位，易招惹是非，不宜做卧室' },
    { name: '祸害', direction: '西南', angle: 225, description: '小凶之位，不宜做重要房间' },
  ],
  '巽': [
    { name: '绝命', direction: '东北', angle: 45, description: '大凶之位，不宜做卧室，可做储物间或卫生间' },
    { name: '五鬼', direction: '西南', angle: 225, description: '凶位，易生口舌是非，不宜做卧室或书房' },
    { name: '六煞', direction: '西方', angle: 270, description: '凶位，易招惹是非，不宜做卧室' },
    { name: '祸害', direction: '西北', angle: 315, description: '小凶之位，不宜做重要房间' },
  ],
  '坎': [
    { name: '绝命', direction: '西南', angle: 225, description: '大凶之位，不宜做卧室，可做储物间或卫生间' },
    { name: '五鬼', direction: '东北', angle: 45, description: '凶位，易生口舌是非，不宜做卧室或书房' },
    { name: '六煞', direction: '西北', angle: 315, description: '凶位，易招惹是非，不宜做卧室' },
    { name: '祸害', direction: '西方', angle: 270, description: '小凶之位，不宜做重要房间' },
  ],
  '离': [
    { name: '绝命', direction: '西北', angle: 315, description: '大凶之位，不宜做卧室，可做储物间或卫生间' },
    { name: '五鬼', direction: '西方', angle: 270, description: '凶位，易生口舌是非，不宜做卧室或书房' },
    { name: '六煞', direction: '东北', angle: 45, description: '凶位，易招惹是非，不宜做卧室' },
    { name: '祸害', direction: '西南', angle: 225, description: '小凶之位，不宜做重要房间' },
  ],
  '艮': [
    { name: '绝命', direction: '东南', angle: 135, description: '大凶之位，不宜做卧室，可做储物间或卫生间' },
    { name: '五鬼', direction: '北方', angle: 0, description: '凶位，易生口舌是非，不宜做卧室或书房' },
    { name: '六煞', direction: '东方', angle: 90, description: '凶位，易招惹是非，不宜做卧室' },
    { name: '祸害', direction: '南方', angle: 180, description: '小凶之位，不宜做重要房间' },
  ],
  '兑': [
    { name: '绝命', direction: '东方', angle: 90, description: '大凶之位，不宜做卧室，可做储物间或卫生间' },
    { name: '五鬼', direction: '南方', angle: 180, description: '凶位，易生口舌是非，不宜做卧室或书房' },
    { name: '六煞', direction: '东南', angle: 135, description: '凶位，易招惹是非，不宜做卧室' },
    { name: '祸害', direction: '北方', angle: 0, description: '小凶之位，不宜做重要房间' },
  ],
};

export function calculateBaZhai(birthInfo: BirthInfo): BaZhaiResult {
  const [year] = birthInfo.date.split('-').map(Number);
  const lastTwoDigits = year % 100;
  const sum = Math.floor(lastTwoDigits / 10) + (lastTwoDigits % 10);
  const remainder = sum % 10;
  
  const mingGua = MING_GUA_MAP[birthInfo.gender][remainder.toString()];
  const mingGuaWuXing = MING_GUA_WU_XING[mingGua];
  
  const siJiFang = SI_JI_FANG[mingGua];
  const siXiongFang = SI_XIONG_FANG[mingGua];
  
  return {
    mingGua,
    mingGuaWuXing,
    siJiFang,
    siXiongFang,
  };
}
