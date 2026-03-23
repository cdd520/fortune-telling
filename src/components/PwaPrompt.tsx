'use client';

import { useApp } from '@/context/AppContext';

export default function PwaPrompt() {
  const { showPwaPrompt, setShowPwaPrompt } = useApp();
  
  if (!showPwaPrompt) return null;
  
  const handleAddToHome = () => {
    const isIos = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    
    if (isIos) {
      alert('请点击浏览器底部的"分享"按钮，然后选择"添加到主屏幕"');
    } else {
      alert('请点击浏览器菜单中的"添加到主屏幕"或"安装应用"选项');
    }
    
    setShowPwaPrompt(false);
  };
  
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="max-w-md mx-auto bg-white dark:bg-traditional-card rounded-2xl shadow-2xl border border-gray-200 dark:border-traditional-gold/30 p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-lucky/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">📱</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">
              添加到桌面
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              将知命添加到主屏幕，下次使用更便捷，支持离线访问历史记录
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleAddToHome}
                className="flex-1 py-2 bg-lucky hover:bg-lucky-dark text-white rounded-lg text-sm font-medium transition-colors"
              >
                立即添加
              </button>
              <button
                onClick={() => setShowPwaPrompt(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-traditional-bg hover:bg-gray-200 dark:hover:bg-traditional-border text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
              >
                暂不需要
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
