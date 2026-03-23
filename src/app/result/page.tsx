'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BirthInfo, CalculationResult, PlainResult } from '@/types';
import { useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { calculateBaZi } from '@/utils/bazi';
import { calculateZiWei } from '@/utils/ziwei';
import { calculateBaZhai } from '@/utils/bazhai';
import { generateId, saveToStorage } from '@/utils/storage';
import PlainResultView from '@/components/results/PlainResultView';
import ProfessionalResultView from '@/components/results/ProfessionalResultView';
import LoadingAnimation from '@/components/LoadingAnimation';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentResult, setCurrentResult, saveToHistory, viewMode } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadResult = async () => {
      const date = searchParams.get('date');
      const isLunar = searchParams.get('isLunar') === 'true';
      const time = searchParams.get('time') || '12:00';
      const hourUnknown = searchParams.get('hourUnknown') === 'true';
      const city = searchParams.get('city') || '';
      const longitude = parseFloat(searchParams.get('longitude') || '120');
      const latitude = parseFloat(searchParams.get('latitude') || '30');
      const timezone = parseFloat(searchParams.get('timezone') || '8');
      const gender = (searchParams.get('gender') || '男') as '男' | '女';
      
      if (!date) {
        router.push('/calculate');
        return;
      }
      
      try {
        const birthInfo: BirthInfo = {
          date,
          isLunar,
          time,
          hourUnknown,
          location: { city, longitude, latitude, timezone },
          gender,
        };
        
        const baZi = calculateBaZi(birthInfo);
        const ziWei = calculateZiWei(birthInfo);
        const baZhai = calculateBaZhai(birthInfo);
        
        const plainResult = generatePlainResult(baZi, ziWei, baZhai, birthInfo);
        
        const calculationResult: CalculationResult = {
          id: generateId(),
          createdAt: new Date().toISOString(),
          birthInfo,
          baZi,
          ziWei,
          baZhai,
          plainResult,
        };
        
        setResult(calculationResult);
        setCurrentResult(calculationResult);
        saveToHistory(calculationResult);
        
      } catch (err) {
        console.error('计算失败:', err);
        setError('排盘计算失败，请重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadResult();
  }, [searchParams]);
  
  if (isLoading) {
    return <LoadingAnimation />;
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {error}
            </h2>
            <button
              onClick={() => router.push('/calculate')}
              className="btn-primary mt-4"
            >
              重新测算
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!result) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {viewMode === 'plain' ? (
            <PlainResultView result={result} />
          ) : (
            <ProfessionalResultView result={result} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function generatePlainResult(
  baZi: CalculationResult['baZi'],
  ziWei: CalculationResult['ziWei'],
  baZhai: CalculationResult['baZhai'],
  birthInfo: BirthInfo
): PlainResult {
  const riZhu = baZi.riZhu;
  const riZhuWuXing = baZi.riZhuWuXing;
  const wuXingMissing = baZi.wuXingMissing;
  const wuXingStrong = baZi.wuXingStrong;
  const shenSha = baZi.shenSha;
  
  const wuXingDescriptions: Record<string, string> = {
    '木': '正直有冲劲，富有创造力',
    '火': '热情开朗，善于表达',
    '土': '稳重踏实，有责任心',
    '金': '刚毅果断，追求完美',
    '水': '聪明灵活，善于变通',
  };
  
  const summary = `你属${riZhu}${riZhuWuXing}日主，性格${wuXingDescriptions[riZhuWuXing]}。${
    wuXingMissing.length > 0 ? `五行缺${wuXingMissing.join('、')}，` : ''
  }${
    shenSha.length > 0 ? `命带${shenSha[0].name}，${shenSha[0].plainMeaning.slice(0, 20)}...` : ''
  }`;
  
  const personality = `作为${riZhu}${riZhuWuXing}日主，你天生具有${wuXingDescriptions[riZhuWuXing]}的特质。${
    baZi.shiShen.day === '正官' ? '你做事有原则，责任心强，适合从事管理或公务员工作。' :
    baZi.shiShen.day === '偏财' ? '你对金钱敏感，有投资头脑，适合经商或理财。' :
    baZi.shiShen.day === '食神' ? '你富有创造力，善于表达，适合从事艺术或教育行业。' :
    baZi.shiShen.day === '七杀' ? '你有魄力和决断力，适合高压行业或创业。' :
    '你性格平和，待人真诚，人际关系良好。'
  }${
    shenSha.find(s => s.name === '天乙贵人') ? '命带天乙贵人，遇事常有贵人相助。' : ''
  }${
    shenSha.find(s => s.name === '桃花') ? '命带桃花，人缘好，异性缘佳。' : ''
  }`;
  
  const wuXingAdvice: Record<string, { advice: string; direction: string; color: string }> = {
    '木': { advice: '多接触大自然，适合东方发展', direction: '东方', color: '绿色系' },
    '火': { advice: '多晒太阳，适合南方发展', direction: '南方', color: '红色系' },
    '土': { advice: '多接触土地，适合本地发展', direction: '中央', color: '黄色系' },
    '金': { advice: '多运动锻炼，适合西方发展', direction: '西方', color: '白色系' },
    '水': { advice: '多喝水，适合北方发展', direction: '北方', color: '黑蓝色系' },
  };
  
  const wuXingAnalysis = `你的五行分布：${
    Object.entries(baZi.wuXingCount)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([wuxing, count]) => `${wuxing}${count}个`)
      .join('、')
  }。${
    wuXingMissing.length > 0 
      ? `五行缺${wuXingMissing.join('、')}，建议${wuXingMissing.map(w => wuXingAdvice[w]).map(a => a.advice).join('；')}。`
      : '五行相对平衡。'
  }${
    wuXingStrong.length > 0
      ? `${wuXingStrong.join('、')}较旺，可多穿${wuXingStrong.map(w => wuXingAdvice[w].color).join('、')}衣物。`
      : ''
  }`;
  
  const fortuneScore = {
    career: 3 + Math.floor(Math.random() * 2),
    love: 3 + Math.floor(Math.random() * 2),
    wealth: 3 + Math.floor(Math.random() * 2),
    health: 3 + Math.floor(Math.random() * 2),
  };
  
  const fortuneDetails = {
    career: {
      score: fortuneScore.career,
      description: `事业方面，你的${baZi.shiShen.day === '正官' ? '正官格' : baZi.shiShen.day === '七杀' ? '七杀格' : '命格'}有利于事业发展。`,
      advice: '建议把握机会，稳步前进，注意人际关系。',
    },
    love: {
      score: fortuneScore.love,
      description: shenSha.find(s => s.name === '桃花')
        ? '感情方面，命带桃花，异性缘佳。'
        : '感情方面，需要主动出击，多参加社交活动。',
      advice: '建议保持真诚，多沟通，避免冲动决策。',
    },
    wealth: {
      score: fortuneScore.wealth,
      description: `财运方面，${baZi.shiShen.day === '偏财' || baZi.shiShen.day === '正财' ? '财星得力' : '财运平稳'}。`,
      advice: '建议理性投资，量入为出，避免投机。',
    },
    health: {
      score: fortuneScore.health,
      description: `健康方面，${wuXingMissing.length > 0 ? `五行缺${wuXingMissing[0]}，需注意相关方面` : '整体状况良好'}。`,
      advice: '建议保持规律作息，适度运动，注意饮食均衡。',
    },
  };
  
  const currentMonth = new Date().getMonth() + 1;
  const monthlyFortune = Array.from({ length: 12 }, (_, i) => {
    const month = ((currentMonth + i - 1) % 12) + 1;
    const jiXiong = i < 4 ? '吉' : i < 8 ? '平' : '凶';
    return {
      month,
      jiXiong: jiXiong as '吉' | '平' | '凶',
      keywords: jiXiong === '吉' 
        ? ['机遇', '贵人', '顺利']
        : jiXiong === '平'
        ? ['平稳', '积累', '等待']
        : ['谨慎', '避坑', '低调'],
      advice: jiXiong === '吉'
        ? '把握机会，积极行动'
        : jiXiong === '平'
        ? '稳扎稳打，不宜冒进'
        : '谨慎行事，避免风险',
    };
  });
  
  const fengShuiAdvice = `根据你的命卦「${baZhai.mingGua}」，家中${
    baZhai.siJiFang[0].name
  }方（${baZhai.siJiFang[0].direction}）是最佳方位，适合做卧室或书房。床头宜朝向${
    baZhai.siJiFang[0].direction
  }，财位在${
    baZhai.siJiFang[1].direction
  }方向。避免在${
    baZhai.siXiongFang[0].name
  }方（${baZhai.siXiongFang[0].direction}）做重要房间。`;
  
  return {
    summary,
    personality,
    wuXingAnalysis,
    fortuneScore,
    fortuneDetails,
    monthlyFortune,
    fengShuiAdvice,
  };
}

export default function ResultPage() {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <ResultContent />
    </Suspense>
  );
}
