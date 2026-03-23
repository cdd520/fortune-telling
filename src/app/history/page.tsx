'use client';

import { useApp } from '@/context/AppContext';
import { Trash2, Calendar, Clock, MapPin, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HistoryPage() {
  const { history, loadFromHistory, deleteFromHistory, clearHistory } = useApp();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffDays === 0) {
      if (diffHours === 0) {
        return '刚刚';
      }
      return `${diffHours}小时前`;
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)}周前`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)}个月前`;
    }
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这条记录吗？')) {
      deleteFromHistory(id);
    }
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      clearHistory();
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-6">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">历史记录</h1>
          <p className="text-black/70">查看您之前的测算结果</p>
        </div>

        {history.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-black/50" />
            <h3 className="text-xl font-semibold text-black mb-2">暂无历史记录</h3>
            <p className="text-black/70 mb-6">
              您还没有进行过测算，开始第一次探索命运吧！
            </p>
            <a
              href="/calculate"
              className="btn-primary inline-flex items-center gap-2"
            >
              开始测算
            </a>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-black/70">
                共 <span className="text-[#D4AF37] font-semibold">{history.length}</span> 条记录
              </p>
              {history.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-sm text-[#B81C30] hover:text-[#9A1727] transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  清空全部
                </button>
              )}
            </div>

            <div className="space-y-4">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadFromHistory(item.id)}
                  className="glass-card w-full text-left p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/40 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B81C30]/20 to-[#D4AF37]/20 flex items-center justify-center border border-[#D4AF37]/30">
                        <Calendar className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-sm text-black/60 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.createdAt)}
                        </span>
                        <span className="text-sm text-[#B81C30] flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {item.birthInfo.gender}命
                        </span>
                        <span className="text-sm text-[#D4AF37] flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.birthInfo.location.city}
                        </span>
                      </div>

                      <div className="text-base text-black mb-2">
                        <span className="text-[#D4AF37] font-medium">{item.birthInfo.date}</span>
                        <span className="text-black/50 mx-2">·</span>
                        <span className="text-black/70">
                          {item.birthInfo.isLunar ? '农历' : '公历'}
                        </span>
                        {!item.birthInfo.hourUnknown && (
                          <>
                            <span className="text-black/50 mx-2">·</span>
                            <span className="text-black/70">{item.birthInfo.time}</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="glass px-3 py-1 rounded-full text-xs text-black/70">
                          八字
                        </div>
                        <div className="glass px-3 py-1 rounded-full text-xs text-black/70">
                          紫微
                        </div>
                        <div className="glass px-3 py-1 rounded-full text-xs text-black/70">
                          八宅
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#B81C30]/10 hover:bg-[#B81C30]/20 flex items-center justify-center text-[#B81C30] hover:text-[#9A1727] transition-all duration-200 border border-[#B81C30]/20 group-hover:scale-110"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
