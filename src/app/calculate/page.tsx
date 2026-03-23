'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BirthInfo } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, ArrowLeft, MapPin, Calendar, Clock, User, Check } from 'lucide-react';

const STEPS = [
  { id: 1, title: '出生日期', description: '请选择您的出生日期', icon: Calendar },
  { id: 2, title: '出生时间', description: '请选择您的出生时间', icon: Clock },
  { id: 3, title: '出生地点', description: '请选择您的出生地点', icon: MapPin },
];

const SHI_CHEN_MAP: Record<number, string> = {
  0: '子时 (23:00-01:00)',
  1: '丑时 (01:00-03:00)',
  2: '寅时 (03:00-05:00)',
  3: '卯时 (05:00-07:00)',
  4: '辰时 (07:00-09:00)',
  5: '巳时 (09:00-11:00)',
  6: '午时 (11:00-13:00)',
  7: '未时 (13:00-15:00)',
  8: '申时 (15:00-17:00)',
  9: '酉时 (17:00-19:00)',
  10: '戌时 (19:00-21:00)',
  11: '亥时 (21:00-23:00)',
};

const MAJOR_CITIES = [
  { name: '北京', longitude: 116.4, latitude: 39.9, timezone: 8 },
  { name: '上海', longitude: 121.5, latitude: 31.2, timezone: 8 },
  { name: '广州', longitude: 113.3, latitude: 23.1, timezone: 8 },
  { name: '深圳', longitude: 114.1, latitude: 22.5, timezone: 8 },
  { name: '杭州', longitude: 120.2, latitude: 30.3, timezone: 8 },
  { name: '成都', longitude: 104.1, latitude: 30.7, timezone: 8 },
  { name: '武汉', longitude: 114.3, latitude: 30.6, timezone: 8 },
  { name: '西安', longitude: 108.9, latitude: 34.3, timezone: 8 },
  { name: '南京', longitude: 118.8, latitude: 32.1, timezone: 8 },
  { name: '重庆', longitude: 106.5, latitude: 29.6, timezone: 8 },
  { name: '天津', longitude: 117.2, latitude: 39.1, timezone: 8 },
  { name: '苏州', longitude: 120.6, latitude: 31.3, timezone: 8 },
  { name: '郑州', longitude: 113.6, latitude: 34.8, timezone: 8 },
  { name: '长沙', longitude: 112.9, latitude: 28.2, timezone: 8 },
  { name: '沈阳', longitude: 123.4, latitude: 41.8, timezone: 8 },
  { name: '青岛', longitude: 120.4, latitude: 36.1, timezone: 8 },
  { name: '厦门', longitude: 118.1, latitude: 24.5, timezone: 8 },
  { name: '济南', longitude: 117.0, latitude: 36.7, timezone: 8 },
  { name: '哈尔滨', longitude: 126.6, latitude: 45.8, timezone: 8 },
  { name: '福州', longitude: 119.3, latitude: 26.1, timezone: 8 },
  { name: '梅州', longitude: 116.1, latitude: 24.3, timezone: 8 },
  { name: '梅州市', longitude: 116.1, latitude: 24.3, timezone: 8 },
  { name: '汕头', longitude: 116.7, latitude: 23.4, timezone: 8 },
  { name: '东莞', longitude: 113.7, latitude: 23.0, timezone: 8 },
  { name: '佛山', longitude: 113.1, latitude: 23.0, timezone: 8 },
  { name: '珠海', longitude: 113.5, latitude: 22.3, timezone: 8 },
  { name: '中山', longitude: 113.4, latitude: 22.5, timezone: 8 },
  { name: '惠州', longitude: 114.4, latitude: 23.1, timezone: 8 },
  { name: '江门', longitude: 113.1, latitude: 22.6, timezone: 8 },
  { name: '湛江', longitude: 110.4, latitude: 21.2, timezone: 8 },
  { name: '肇庆', longitude: 112.5, latitude: 23.1, timezone: 8 },
  { name: '清远', longitude: 113.0, latitude: 23.7, timezone: 8 },
  { name: '韶关', longitude: 113.6, latitude: 24.8, timezone: 8 },
  { name: '揭阳', longitude: 116.4, latitude: 23.5, timezone: 8 },
  { name: '潮州', longitude: 116.6, latitude: 23.7, timezone: 8 },
  { name: '茂名', longitude: 110.9, latitude: 21.7, timezone: 8 },
  { name: '阳江', longitude: 111.9, latitude: 21.9, timezone: 8 },
  { name: '河源', longitude: 114.7, latitude: 23.7, timezone: 8 },
  { name: '汕尾', longitude: 115.4, latitude: 22.8, timezone: 8 },
  { name: '云浮', longitude: 112.0, latitude: 22.9, timezone: 8 },
  { name: '温州', longitude: 120.7, latitude: 28.0, timezone: 8 },
  { name: '宁波', longitude: 121.5, latitude: 29.9, timezone: 8 },
  { name: '无锡', longitude: 120.3, latitude: 31.5, timezone: 8 },
  { name: '合肥', longitude: 117.3, latitude: 31.8, timezone: 8 },
  { name: '南昌', longitude: 115.9, latitude: 28.7, timezone: 8 },
  { name: '昆明', longitude: 102.7, latitude: 25.0, timezone: 8 },
  { name: '贵阳', longitude: 106.7, latitude: 26.6, timezone: 8 },
  { name: '南宁', longitude: 108.3, latitude: 22.8, timezone: 8 },
  { name: '海口', longitude: 110.3, latitude: 20.0, timezone: 8 },
  { name: '三亚', longitude: 109.5, latitude: 18.3, timezone: 8 },
  { name: '兰州', longitude: 103.8, latitude: 36.1, timezone: 8 },
  { name: '西宁', longitude: 101.8, latitude: 36.6, timezone: 8 },
  { name: '银川', longitude: 106.3, latitude: 38.5, timezone: 8 },
  { name: '乌鲁木齐', longitude: 87.6, latitude: 43.8, timezone: 8 },
  { name: '拉萨', longitude: 91.1, latitude: 29.7, timezone: 8 },
  { name: '呼和浩特', longitude: 111.8, latitude: 40.8, timezone: 8 },
  { name: '大连', longitude: 121.6, latitude: 38.9, timezone: 8 },
  { name: '长春', longitude: 125.3, latitude: 43.9, timezone: 8 },
  { name: '石家庄', longitude: 114.5, latitude: 38.0, timezone: 8 },
  { name: '太原', longitude: 112.5, latitude: 37.9, timezone: 8 },
];

export default function CalculatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<BirthInfo>({
    date: '',
    isLunar: false,
    time: '12:00',
    hourUnknown: false,
    location: {
      city: '',
      longitude: 120.0,
      latitude: 30.0,
      timezone: 8,
    },
    gender: '男',
  });

  const [citySearch, setCitySearch] = useState('');
  const [filteredCities, setFilteredCities] = useState<typeof MAJOR_CITIES>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  useEffect(() => {
    if (citySearch && citySearch.length > 0) {
      const filtered = MAJOR_CITIES.filter(city =>
        city.name.includes(citySearch)
      );
      setFilteredCities(filtered);
      setShowCityDropdown(filtered.length > 0);
    } else {
      setFilteredCities([]);
      setShowCityDropdown(false);
    }
  }, [citySearch]);

  const today = new Date().toISOString().split('T')[0];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.date) {
        newErrors.date = '请选择出生日期';
      } else if (formData.date > today) {
        newErrors.date = '请选择正确的出生日期';
      }
    }

    if (step === 2) {
      if (!formData.hourUnknown && !formData.time) {
        newErrors.time = '请选择出生时间';
      }
    }

    if (step === 3) {
      if (!formData.location.city) {
        newErrors.location = '请选择出生地点';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    try {
      const queryString = new URLSearchParams({
        date: formData.date,
        isLunar: formData.isLunar.toString(),
        time: formData.time,
        hourUnknown: formData.hourUnknown.toString(),
        city: formData.location.city,
        longitude: formData.location.longitude.toString(),
        latitude: formData.location.latitude.toString(),
        timezone: formData.location.timezone.toString(),
        gender: formData.gender,
      }).toString();

      router.push(`/result?${queryString}`);
    } catch (error) {
      console.error('提交失败:', error);
      setErrors({ submit: '网络异常，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCitySelect = (city: typeof MAJOR_CITIES[0]) => {
    setFormData(prev => ({
      ...prev,
      location: {
        city: city.name,
        longitude: city.longitude,
        latitude: city.latitude,
        timezone: city.timezone,
      },
    }));
    setCitySearch(city.name);
    setShowCityDropdown(false);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              longitude: parseFloat(position.coords.longitude.toFixed(1)),
              latitude: parseFloat(position.coords.latitude.toFixed(1)),
            },
          }));
          setCitySearch('当前位置');
        },
        () => {
          alert('无法获取当前位置，请手动选择城市');
        }
      );
    }
  };

  const progress = (currentStep / 3) * 100;
  const currentStepData = STEPS[currentStep - 1];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />

      <main className="flex-1 px-4 py-8 md:py-12 relative z-10 pb-24 md:pb-8">
        <div className="max-w-lg mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-black/75">
                步骤 {currentStep} / 3
              </span>
              <span className="text-sm text-black/75">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Step indicators */}
            <div className="flex justify-between mt-4">
              {STEPS.map((step, index) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-[#D4AF37] to-[#B81C30] text-white'
                          : isCurrent
                          ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37] text-[#D4AF37]'
                          : 'bg-black/5 text-black/30'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-xs mt-2 ${isCurrent ? 'text-black' : 'text-black/70'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B81C30]/20 flex items-center justify-center">
                <StepIcon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">
                  {currentStepData.title}
                </h2>
                <p className="text-sm text-black/70">
                  {currentStepData.description}
                </p>
              </div>
            </div>

            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2">
                    出生日期
                  </label>
                  <input
                    type="date"
                    max={today}
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="input-field"
                  />
                  {errors.date && (
                    <p className="mt-2 text-sm text-[#B81C30]">{errors.date}</p>
                  )}
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="isLunar"
                      checked={formData.isLunar}
                      onChange={(e) => setFormData(prev => ({ ...prev, isLunar: e.target.checked }))}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                      formData.isLunar
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B81C30] border-transparent'
                        : 'border-black/20 group-hover:border-black/40'
                    }`}>
                      {formData.isLunar && (
                        <Check className="w-full h-full text-white p-0.5" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-black/75 group-hover:text-black transition-colors">
                    使用农历日期
                  </span>
                </label>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2">
                    出生时间
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    disabled={formData.hourUnknown}
                    className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {formData.time && !formData.hourUnknown && (
                    <p className="mt-2 text-sm text-black/70">
                      对应{SHI_CHEN_MAP[Math.floor(parseInt(formData.time.split(':')[0]) / 2) % 12]}
                    </p>
                  )}
                  {errors.time && (
                    <p className="mt-2 text-sm text-[#B81C30]">{errors.time}</p>
                  )}
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="hourUnknown"
                      checked={formData.hourUnknown}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, hourUnknown: e.target.checked }));
                        if (e.target.checked) {
                          alert('时辰不确定会影响排盘结果的准确性，建议尽量回忆，结果仅供参考');
                        }
                      }}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                      formData.hourUnknown
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B81C30] border-transparent'
                        : 'border-black/20 group-hover:border-black/40'
                    }`}>
                      {formData.hourUnknown && (
                        <Check className="w-full h-full text-white p-0.5" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-black/75 group-hover:text-black transition-colors">
                    时辰未知
                  </span>
                </label>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2">
                    出生地点
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="输入城市名搜索..."
                      value={citySearch}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCitySearch(value);
                        setFormData(prev => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            city: value,
                            longitude: 116.4,
                            latitude: 24.3,
                            timezone: 8,
                          },
                        }));
                      }}
                      onFocus={() => {
                        if (citySearch && filteredCities.length > 0) {
                          setShowCityDropdown(true);
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowCityDropdown(false), 200);
                      }}
                      className="input-field pr-12"
                    />
                    <button
                      type="button"
                      onClick={handleGetCurrentLocation}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-[#D4AF37] transition-colors"
                      title="获取当前位置"
                    >
                      <MapPin className="w-5 h-5" />
                    </button>

                    {showCityDropdown && filteredCities.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 glass-card max-h-60 overflow-y-auto scrollbar-thin">
                        {filteredCities.map((city) => (
                          <button
                            key={city.name}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleCitySelect(city);
                            }}
                            className="w-full px-4 py-3 text-left text-black/80 hover:text-black hover:bg-black/5 transition-colors"
                          >
                            {city.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.location && (
                    <p className="mt-2 text-sm text-[#B81C30]">{errors.location}</p>
                  )}
                  <p className="mt-2 text-xs text-black/60">
                    可直接输入城市名，或从下拉列表选择
                  </p>
                </div>

                {formData.location.city && (
                  <div className="glass p-4 rounded-xl">
                    <p className="text-sm text-black/70">
                      经度: {formData.location.longitude}° | 纬度: {formData.location.latitude}°
                    </p>
                    <p className="text-sm text-black/60 mt-1">
                      时区: UTC+{formData.location.timezone}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-black/70 mb-3">
                    性别
                  </label>
                  <div className="flex gap-4">
                    {['男', '女'].map((gender) => (
                      <label
                        key={gender}
                        className="flex-1 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={() => setFormData(prev => ({ ...prev, gender }))}
                          className="sr-only"
                        />
                        <div className={`glass-card p-4 text-center transition-all duration-200 ${
                          formData.gender === gender
                            ? 'border-[#D4AF37]/50 bg-[#D4AF37]/10'
                            : 'hover:border-black/20'
                        }`}>
                          <User className={`w-6 h-6 mx-auto mb-2 ${
                            formData.gender === gender ? 'text-[#D4AF37]' : 'text-black/60'
                          }`} />
                          <span className={`text-sm ${
                            formData.gender === gender ? 'text-black' : 'text-black/75'
                          }`}>
                            {gender}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 glass-card border-[#B81C30]/30 bg-[#B81C30]/10">
              <p className="text-sm text-[#B81C30]">{errors.submit}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                上一步
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className={`btn-primary flex items-center justify-center gap-2 ${
                currentStep === 1 ? 'w-full' : 'flex-1'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  计算中...
                </>
              ) : (
                <>
                  {currentStep === 3 ? '开始测算' : '下一步'}
                  {currentStep < 3 && <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
