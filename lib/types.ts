import { ThemeId } from './themes';

export interface LanguageConfig {
  id: string;
  label: string;
  title: string;
  subtitle: string;
}

export interface PreviewSelection {
  lang: LanguageConfig;
  ratio: {
    id: string;
    name: string;
    width: number;
    height: number;
  };
}
