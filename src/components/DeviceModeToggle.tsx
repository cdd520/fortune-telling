'use client';

import { useApp } from '@/context/AppContext';
import { Monitor, Smartphone } from 'lucide-react';

export default function DeviceModeToggle() {
  const { deviceMode, setDeviceMode } = useApp();

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5">
      <button
        onClick={() => setDeviceMode('desktop')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] min-w-[44px] ${
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
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] min-w-[44px] ${
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
  );
}
