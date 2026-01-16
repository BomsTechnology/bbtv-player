import zustandStorage from '@/utils/zustandStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingStore {
  settings: {
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'fr';
  };
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: 'en' | 'fr') => void;
}

export const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      settings: {
        theme: 'system',
        language: 'en',
      },
      setTheme: (theme) => {
        set((state) => ({ 
          settings: { ...state.settings, theme } 
        }));
      },
      setLanguage: (language) => {
        set((state) => ({ 
          settings: { ...state.settings, language } 
        }));
      },
    }),
    {
      name: 'setting-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);