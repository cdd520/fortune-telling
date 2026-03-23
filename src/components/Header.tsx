'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Sparkles, History, Home, Compass, Menu, X, Monitor, Smartphone } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const { viewMode, setViewMode, deviceMode, setDeviceMode } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-[60]">
        <div className="glass border-b border-black/10">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-black/10 to-black/5 group-hover:opacity-40 transition-opacity" />
                {mounted && (
                  <img
                    src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20ink%20wash%20taiji%20yin%20yang%20symbol%2C%20traditional%20Chinese%20style%2C%20black%20and%20white%2C%20ink%20splatter%20effect%2C%20high%20quality%2C%20png%20format%2C%20alpha%20channel%2C%20no%20background&image_size=square_hd"
                    alt="太极图"
                    className="w-10 h-10 animate-rotate-slow object-contain relative z-10"
                  />
                )}
              </div>
              <span className="text-xl font-bold text-gradient hidden sm:inline">知命</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="px-4 py-2 rounded-lg text-black/80 hover:text-black hover:bg-black/5 transition-all duration-200 min-h-[44px]"
              >
                首页
              </Link>
              <Link
                href="/calculate"
                className="px-4 py-2 rounded-lg text-black/80 hover:text-black hover:bg-black/5 transition-all duration-200 min-h-[44px]"
              >
                开始测算
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              {mounted && (
                <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5">
                  <button
                    onClick={() => setDeviceMode('desktop')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] min-w-[44px] ${
                      deviceMode === 'desktop'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B81C30] text-white shadow-lg'
                        : 'text-black/80 hover:text-black hover:bg-black/5'
                    }`}
                    title="电脑端"
                  >
                    <Monitor className="w-4 h-4" />
                    <span className="hidden sm:inline">电脑端</span>
                  </button>
                  <button
                    onClick={() => setDeviceMode('mobile')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] min-w-[44px] ${
                      deviceMode === 'mobile'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B81C30] text-white shadow-lg'
                        : 'text-black/80 hover:text-black hover:bg-black/5'
                    }`}
                    title="手机端"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="hidden sm:inline">手机端</span>
                  </button>
                </div>
              )}

              {viewMode && (
                <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-black/5">
                  <button
                    onClick={() => setViewMode('plain')}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px]',
                      viewMode === 'plain'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B81C30] text-white shadow-lg'
                        : 'text-black/80 hover:text-black'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span className="hidden lg:inline">通俗</span>
                    </span>
                  </button>
                  <button
                    onClick={() => setViewMode('professional')}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px]',
                      viewMode === 'professional'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B81C30] text-white shadow-lg'
                        : 'text-black/80 hover:text-black'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Compass className="w-4 h-4" />
                      <span className="hidden lg:inline">专业</span>
                    </span>
                  </button>
                </div>
              )}

              <Link
                href="/history"
                className="p-2.5 rounded-xl bg-black/5 hover:bg-black/10 text-black/80 hover:text-black transition-all duration-200 min-h-[44px] min-w-[44px]"
                title="历史记录"
              >
                <History className="w-5 h-5" />
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl bg-black/5 hover:bg-black/10 text-black/80 hover:text-black transition-all duration-200 min-h-[44px] min-w-[44px]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden glass border-b border-black/10">
            <div className="max-w-6xl mx-auto px-4 py-4 space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-black/80 hover:text-black hover:bg-black/5 transition-all duration-200 min-h-[44px]"
              >
                首页
              </Link>
              <Link
                href="/calculate"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-black/80 hover:text-black hover:bg-black/5 transition-all duration-200 min-h-[44px]"
              >
                开始测算
              </Link>
              
              {viewMode && (
                <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5">
                  <button
                    onClick={() => {
                      setViewMode('plain');
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px]',
                      viewMode === 'plain'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B81C30] text-white shadow-lg'
                        : 'text-black/80 hover:text-black'
                    )}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      通俗
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('professional');
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px]',
                      viewMode === 'professional'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B81C30] text-white shadow-lg'
                        : 'text-black/80 hover:text-black'
                    )}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Compass className="w-4 h-4" />
                      专业
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {mounted && deviceMode === 'mobile' && (
        <nav className="bottom-nav md:hidden">
          <div className="flex items-center justify-around h-16">
            <Link
              href="/"
              className="bottom-nav-item flex-1 min-h-[44px] min-w-[44px]"
            >
              <Home className="w-6 h-6 mb-1" />
              <span className="text-xs">首页</span>
            </Link>
            <Link
              href="/calculate"
              className="bottom-nav-item flex-1 min-h-[44px] min-w-[44px]"
            >
              <Sparkles className="w-6 h-6 mb-1" />
              <span className="text-xs">测算</span>
            </Link>
            {viewMode && (
              <button
                onClick={() => setViewMode(viewMode === 'plain' ? 'professional' : 'plain')}
                className="bottom-nav-item flex-1 min-h-[44px] min-w-[44px]"
              >
                {viewMode === 'plain' ? (
                  <>
                    <Compass className="w-6 h-6 mb-1" />
                    <span className="text-xs">专业</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mb-1" />
                    <span className="text-xs">通俗</span>
                  </>
                )}
              </button>
            )}
            <Link
              href="/history"
              className="bottom-nav-item flex-1 min-h-[44px] min-w-[44px]"
            >
              <History className="w-6 h-6 mb-1" />
              <span className="text-xs">历史</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
