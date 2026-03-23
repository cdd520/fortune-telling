'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PwaPrompt from '@/components/PwaPrompt';
import { ArrowRight, Sparkles, Shield, Lock, Star, Moon, Sun, Zap } from 'lucide-react';

export default function HomePage() {
  const { viewMode } = useApp();

  const features = [
    {
      icon: Sparkles,
      title: '八字排盘',
      description: '精准推算四柱八字，洞察命运玄机',
      gradient: 'from-[#4B8B28] to-[#1D4ED8]',
    },
    {
      icon: Star,
      title: '紫微斗数',
      description: '十二宫位详解，揭示人生轨迹',
      gradient: 'from-[#D4AF37] to-[#B81C30]',
    },
    {
      icon: Shield,
      title: '八宅风水',
      description: '吉凶方位指引，趋吉避凶之道',
      gradient: 'from-[#4B8B28] to-[#B89628]',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            {/* 太极Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                {/* 外圈光晕 */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-black/10 to-black/5 blur-2xl animate-pulse-glow" />
                
                {/* 水墨太极图 */}
                <div className="relative w-full h-full animate-float">
                  <img
                    src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20ink%20wash%20taiji%20yin%20yang%20symbol%2C%20traditional%20Chinese%20style%2C%20black%20and%20white%2C%20ink%20splatter%20effect%2C%20high%20quality%2C%20png%20format%2C%20alpha%20channel%2C%20no%20background&image_size=square_hd"
                    alt="太极图"
                    className="w-full h-full drop-shadow-2xl object-contain"
                  />
                </div>
              </div>
            </div>

            {/* 标题 */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">知命</span>
            </h1>

            <p className="text-xl md:text-2xl text-black/85 mb-4 text-shadow">
              传统命理 · 现代解读
            </p>

            <p className="text-base md:text-lg text-black/75 max-w-md mx-auto mb-10">
              专业八字排盘、紫微斗数、八宅风水
              <br />
              大白话解读，零基础也能看懂
            </p>

            {/* CTA按钮 */}
            <Link href="/calculate" className="btn-primary inline-flex items-center gap-3 text-lg">
              <span>开始探索命运</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="glass-card p-6 text-center group cursor-pointer"
                >
                  <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-4`}>
                    <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                      <Icon className="w-6 h-6 text-black" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-black/70">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Privacy Badge */}
          <div className="glass-card inline-flex items-center gap-3 px-6 py-3">
            <div className="w-8 h-8 rounded-lg bg-[#4B8B28]/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#4B8B28]" />
            </div>
            <p className="text-sm text-black/70">
              您的出生信息仅在前端处理，本地加密存储，不上传服务器
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <PwaPrompt />
    </div>
  );
}
