import { ZiWeiResult, ZiWeiGong, DiZhi, WuXing, JiXiong, BirthInfo } from '@/types';
import { DI_ZHI, DI_ZHI_WU_XING } from './constants';

const ZHU_XING = [
  '紫微', '天机', '太阳', '武曲', '天同', '廉贞',
  '天府', '太阴', '贪狼', '巨门', '天相', '天梁',
  '七杀', '破军',
];

const FU_XING = [
  '文昌', '文曲', '左辅', '右弼', '天魁', '天钺',
  '擎羊', '陀罗', '火星', '铃星', '地空', '地劫',
];

const GONG_WEI = [
  '命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄',
  '迁移', '交友', '官禄', '田宅', '福德', '父母',
];

const SI_HUA_ORDER = ['化禄', '化权', '化科', '化忌'];

const NIAN_GAN_SI_HUA: Record<string, Record<string, string>> = {
  '甲': { '化禄': '廉贞', '化权': '破军', '化科': '武曲', '化忌': '太阳' },
  '乙': { '化禄': '天机', '化权': '天梁', '化科': '紫微', '化忌': '太阴' },
  '丙': { '化禄': '天同', '化权': '天机', '化科': '文昌', '化忌': '廉贞' },
  '丁': { '化禄': '太阴', '化权': '天同', '化科': '天机', '化忌': '巨门' },
  '戊': { '化禄': '贪狼', '化权': '太阴', '化科': '右弼', '化忌': '天机' },
  '己': { '化禄': '武曲', '化权': '贪狼', '化科': '天梁', '化忌': '文曲' },
  '庚': { '化禄': '太阳', '化权': '武曲', '化科': '太阴', '化忌': '天同' },
  '辛': { '化禄': '巨门', '化权': '太阳', '化科': '文曲', '化忌': '文昌' },
  '壬': { '化禄': '天梁', '化权': '紫微', '化科': '左辅', '化忌': '武曲' },
  '癸': { '化禄': '破军', '化权': '巨门', '化科': '太阴', '化忌': '贪狼' },
};

function getMingGongPosition(month: number, hour: number): number {
  const zhiIndex = Math.floor(hour / 2) % 12;
  const monthIndex = (month - 1) % 12;
  return (monthIndex + 12 - zhiIndex) % 12;
}

function getShenZhi(year: number): DiZhi {
  const zhiIndex = (year - 4) % 12;
  return DI_ZHI[zhiIndex >= 0 ? zhiIndex : zhiIndex + 12];
}

function getStarPosition(star: string, mingGongPos: number, shenZhi: DiZhi): number {
  const starPositions: Record<string, (pos: number, zhi: DiZhi) => number> = {
    '紫微': (pos) => pos,
    '天机': (pos) => (pos + 1) % 12,
    '太阳': (pos) => (pos + 2) % 12,
    '武曲': (pos) => (pos + 3) % 12,
    '天同': (pos) => (pos + 4) % 12,
    '廉贞': (pos) => (pos + 5) % 12,
    '天府': (pos) => (pos + 6) % 12,
    '太阴': (pos) => (pos + 7) % 12,
    '贪狼': (pos) => (pos + 8) % 12,
    '巨门': (pos) => (pos + 9) % 12,
    '天相': (pos) => (pos + 10) % 12,
    '天梁': (pos) => (pos + 11) % 12,
    '七杀': (pos) => (pos + 12) % 12,
    '破军': (pos) => (pos + 11) % 12,
  };
  
  if (starPositions[star]) {
    return starPositions[star](mingGongPos, shenZhi);
  }
  return mingGongPos;
}

function getFuXingPosition(star: string, mingGongPos: number, shenZhi: DiZhi, gender: '男' | '女'): number {
  const zhiIndex = DI_ZHI.indexOf(shenZhi);
  
  const fuXingPositions: Record<string, number> = {
    '文昌': (mingGongPos + 8) % 12,
    '文曲': (mingGongPos + 4) % 12,
    '左辅': (mingGongPos + 2) % 12,
    '右弼': (mingGongPos + 10) % 12,
    '天魁': (zhiIndex + 4) % 12,
    '天钺': (zhiIndex + 8) % 12,
    '擎羊': (zhiIndex + 2) % 12,
    '陀罗': (zhiIndex + 10) % 12,
    '火星': gender === '男' ? (zhiIndex + 3) % 12 : (zhiIndex + 9) % 12,
    '铃星': gender === '男' ? (zhiIndex + 9) % 12 : (zhiIndex + 3) % 12,
    '地空': (mingGongPos + 6) % 12,
    '地劫': (mingGongPos + 6) % 12,
  };
  
  return fuXingPositions[star] ?? mingGongPos;
}

interface StarStatus {
  miao: number[];
  wang: number[];
  lian: number[];
  xian: number[];
}

function getMiaoWangLianXian(star: string, position: number): '庙' | '旺' | '平' | '陷' {
  const starStatus: Record<string, StarStatus> = {
    '紫微': { miao: [0, 1, 2, 3, 4], wang: [5, 6], lian: [7, 8], xian: [9, 10, 11] },
    '天机': { miao: [1, 2], wang: [3, 4], lian: [0, 5], xian: [6, 7, 8, 9, 10, 11] },
    '太阳': { miao: [2, 3, 4], wang: [5, 6], lian: [1, 7], xian: [0, 8, 9, 10, 11] },
    '武曲': { miao: [3, 4], wang: [5, 6], lian: [2, 7], xian: [0, 1, 8, 9, 10, 11] },
    '天同': { miao: [4, 5], wang: [6, 7], lian: [3, 8], xian: [0, 1, 2, 9, 10, 11] },
    '廉贞': { miao: [5, 6], wang: [7, 8], lian: [4, 9], xian: [0, 1, 2, 3, 10, 11] },
    '天府': { miao: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], wang: [], lian: [], xian: [] },
    '太阴': { miao: [8, 9, 10], wang: [11, 0], lian: [7, 1], xian: [2, 3, 4, 5, 6] },
    '贪狼': { miao: [0, 1], wang: [2, 3], lian: [11, 4], xian: [5, 6, 7, 8, 9, 10] },
    '巨门': { miao: [1, 2], wang: [3, 4], lian: [0, 5], xian: [6, 7, 8, 9, 10, 11] },
    '天相': { miao: [2, 3], wang: [4, 5], lian: [1, 6], xian: [0, 7, 8, 9, 10, 11] },
    '天梁': { miao: [3, 4], wang: [5, 6], lian: [2, 7], xian: [0, 1, 8, 9, 10, 11] },
    '七杀': { miao: [4, 5, 6], wang: [7, 8], lian: [3, 9], xian: [0, 1, 2, 10, 11] },
    '破军': { miao: [5, 6], wang: [7, 8], lian: [4, 9], xian: [0, 1, 2, 3, 10, 11] },
  };
  
  const status = starStatus[star];
  if (!status) return '平';
  
  if (status.miao.includes(position)) return '庙';
  if (status.wang.includes(position)) return '旺';
  if (status.lian.includes(position)) return '平';
  if (status.xian.includes(position)) return '陷';
  return '平';
}

function calculateSiHua(nianGan: string, gongWei: ZiWeiGong[]): ZiWeiResult['siHua'] {
  const siHuaStars = NIAN_GAN_SI_HUA[nianGan] || NIAN_GAN_SI_HUA['甲'];
  
  const findGongByStar = (star: string): string => {
    for (const gong of gongWei) {
      if (gong.zhuXing.includes(star) || gong.fuXing.includes(star)) {
        return gong.name;
      }
    }
    return '命宫';
  };
  
  return {
    huaLu: { star: siHuaStars['化禄'], gong: findGongByStar(siHuaStars['化禄']) },
    huaQuan: { star: siHuaStars['化权'], gong: findGongByStar(siHuaStars['化权']) },
    huaKe: { star: siHuaStars['化科'], gong: findGongByStar(siHuaStars['化科']) },
    huaJi: { star: siHuaStars['化忌'], gong: findGongByStar(siHuaStars['化忌']) },
  };
}

function getGongJiXiong(gong: ZiWeiGong): JiXiong {
  const jiXing = ['紫微', '天府', '天相', '天梁', '天同', '太阳', '太阴', '天机', '左辅', '右弼', '天魁', '天钺', '文昌', '文曲'];
  const xiongXing = ['七杀', '破军', '贪狼', '廉贞', '擎羊', '陀罗', '火星', '铃星', '地空', '地劫'];
  
  let jiCount = 0;
  let xiongCount = 0;
  
  [...gong.zhuXing, ...gong.fuXing].forEach(star => {
    if (jiXing.includes(star)) jiCount++;
    if (xiongXing.includes(star)) xiongCount++;
  });
  
  if (jiCount > xiongCount) return '吉';
  if (xiongCount > jiCount) return '凶';
  return '平';
}

export function calculateZiWei(birthInfo: BirthInfo): ZiWeiResult {
  const [year] = birthInfo.date.split('-').map(Number);
  const [hour] = birthInfo.time.split(':').map(Number);
  const [, month] = birthInfo.date.split('-').map(Number);
  
  const shenZhi = getShenZhi(year);
  const mingGongPos = getMingGongPosition(month, hour);
  
  const gongWei: ZiWeiGong[] = GONG_WEI.map((name, index) => {
    const position = (mingGongPos + index) % 12;
    return {
      name,
      position,
      zhuXing: [],
      fuXing: [],
      siHua: [],
      jiXiong: '平',
    };
  });
  
  ZHU_XING.forEach(star => {
    const pos = getStarPosition(star, mingGongPos, shenZhi);
    gongWei[pos].zhuXing.push(star);
  });
  
  FU_XING.forEach(star => {
    const pos = getFuXingPosition(star, mingGongPos, shenZhi, birthInfo.gender);
    gongWei[pos].fuXing.push(star);
  });
  
  gongWei.forEach(gong => {
    gong.jiXiong = getGongJiXiong(gong);
  });
  
  const nianGan = ((year - 4) % 10).toString();
  const ganNames = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const siHua = calculateSiHua(ganNames[parseInt(nianGan) >= 0 ? parseInt(nianGan) : parseInt(nianGan) + 10], gongWei);
  
  return {
    gongWei,
    mingGong: mingGongPos,
    shenZhi,
    siHua,
  };
}
