import { useSettingStore } from "@/hooks/use-settingstore";
import { ColorSchemeName, useColorScheme } from 'react-native';

export const useTheme = () => {
  const { settings, setTheme, setLanguage } = useSettingStore();
  const systemColorScheme = useColorScheme();

  const effectiveTheme: ColorSchemeName = settings.theme === 'system' 
    ? systemColorScheme 
    : settings.theme;

  const isDark = effectiveTheme === 'dark';

  return {
    theme: effectiveTheme,
    isDark,
    userTheme: settings.theme,
    language: settings.language,
    setTheme,
    setLanguage,
  };
};