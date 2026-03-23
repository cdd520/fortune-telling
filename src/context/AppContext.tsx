'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ViewMode, ThemeMode, DeviceMode, CalculationResult, BirthInfo } from '@/types';
import { loadFromStorage, saveToStorage, removeFromStorage, generateId } from '@/utils/storage';

interface AppState {
  viewMode: ViewMode;
  themeMode: ThemeMode;
  deviceMode: DeviceMode;
  currentResult: CalculationResult | null;
  history: CalculationResult[];
  showPwaPrompt: boolean;
}

interface AppContextType extends AppState {
  setViewMode: (mode: ViewMode) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setDeviceMode: (mode: DeviceMode) => void;
  setCurrentResult: (result: CalculationResult | null) => void;
  saveToHistory: (result: CalculationResult) => void;
  loadFromHistory: (id: string) => void;
  deleteFromHistory: (id: string) => void;
  clearHistory: () => void;
  setShowPwaPrompt: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  HISTORY: 'zhiming_history',
  THEME: 'zhiming_theme',
  VIEW_MODE: 'zhiming_view_mode',
  DEVICE_MODE: 'zhiming_device_mode',
  PWA_PROMPT: 'zhiming_pwa_prompt',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>('plain');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [deviceMode, setDeviceModeState] = useState<DeviceMode>('desktop');
  const [currentResult, setCurrentResultState] = useState<CalculationResult | null>(null);
  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [showPwaPrompt, setShowPwaPromptState] = useState(false);

  useEffect(() => {
    const savedTheme = loadFromStorage<ThemeMode>(STORAGE_KEYS.THEME);
    if (savedTheme) {
      setThemeModeState(savedTheme);
    }
    
    const savedViewMode = loadFromStorage<ViewMode>(STORAGE_KEYS.VIEW_MODE);
    if (savedViewMode) {
      setViewModeState(savedViewMode);
    }
    
    const savedDeviceMode = loadFromStorage<DeviceMode>(STORAGE_KEYS.DEVICE_MODE);
    if (savedDeviceMode) {
      setDeviceModeState(savedDeviceMode);
    } else if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      setDeviceModeState(isMobile ? 'mobile' : 'desktop');
    }
    
    const savedHistory = loadFromStorage<CalculationResult[]>(STORAGE_KEYS.HISTORY);
    if (savedHistory) {
      setHistory(savedHistory);
    }
    
    const pwaPromptShown = loadFromStorage<boolean>(STORAGE_KEYS.PWA_PROMPT);
    if (!pwaPromptShown) {
      setTimeout(() => setShowPwaPromptState(true), 3000);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    if (themeMode === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemDark);
    } else {
      root.classList.toggle('dark', themeMode === 'dark');
    }
    
    if (viewMode === 'professional') {
      root.classList.add('professional');
    } else {
      root.classList.remove('professional');
    }
    
    if (deviceMode === 'mobile') {
      root.classList.add('device-mobile');
      root.classList.remove('device-desktop');
    } else {
      root.classList.add('device-desktop');
      root.classList.remove('device-mobile');
    }
  }, [themeMode, viewMode, deviceMode]);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    saveToStorage(STORAGE_KEYS.VIEW_MODE, mode);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    saveToStorage(STORAGE_KEYS.THEME, mode);
  };

  const setDeviceMode = (mode: DeviceMode) => {
    setDeviceModeState(mode);
    saveToStorage(STORAGE_KEYS.DEVICE_MODE, mode);
  };

  const setCurrentResult = (result: CalculationResult | null) => {
    setCurrentResultState(result);
  };

  const saveToHistory = (result: CalculationResult) => {
    const newHistory = [result, ...history].slice(0, 50);
    setHistory(newHistory);
    saveToStorage(STORAGE_KEYS.HISTORY, newHistory);
  };

  const loadFromHistory = (id: string) => {
    const result = history.find(item => item.id === id);
    if (result) {
      setCurrentResultState(result);
    }
  };

  const deleteFromHistory = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    saveToStorage(STORAGE_KEYS.HISTORY, newHistory);
  };

  const clearHistory = () => {
    setHistory([]);
    removeFromStorage(STORAGE_KEYS.HISTORY);
  };

  const setShowPwaPrompt = (show: boolean) => {
    setShowPwaPromptState(show);
    if (!show) {
      saveToStorage(STORAGE_KEYS.PWA_PROMPT, true);
    }
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        themeMode,
        deviceMode,
        currentResult,
        history,
        showPwaPrompt,
        setViewMode,
        setThemeMode,
        setDeviceMode,
        setCurrentResult,
        saveToHistory,
        loadFromHistory,
        deleteFromHistory,
        clearHistory,
        setShowPwaPrompt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
