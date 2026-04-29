export type ThemeId = 'classic' | 'split' | 'gradient' | 'brutalist' | 'neon' | 'retro' | 'minimal' | 'gaming';

export interface AspectRatio {
  id: string;
  name: string;
  width: number;
  height: number;
}

export const ASPECT_RATIOS: AspectRatio[] = [
  { id: '16_9', name: '16:9 (YouTube)', width: 1280, height: 720 },
  { id: '4_3', name: '4:3 (Classic)', width: 960, height: 720 },
  { id: '1_1', name: '1:1 (Square)', width: 1080, height: 1080 },
  { id: '3_4', name: '3:4 (Portrait)', width: 810, height: 1080 },
  { id: '9_16', name: '9:16 (TikTok)', width: 720, height: 1280 },
  { id: 'original', name: 'Original', width: 0, height: 0 },
];

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  defaultColor: string;
}

export const FONTS = [
  { id: 'Anton, sans-serif', name: 'Bold Impact' },
  { id: 'Inter, sans-serif', name: 'Clean Sans' },
  { id: 'Space Grotesk, sans-serif', name: 'Modern Tech' },
];

export const THEMES: ThemeConfig[] = [
  { id: 'classic', name: 'Classic Bold', description: 'High-contrast text on background.', defaultColor: '#FF0000' },
  { id: 'split', name: 'Split Pane', description: 'Visuals and message separated.', defaultColor: '#3B82F6' },
  { id: 'gradient', name: 'Soft Modern', description: 'Clean overlays for professional look.', defaultColor: '#8B5CF6' },
  { id: 'brutalist', name: 'Brutalist', description: 'Edgy blocks and massive fonts.', defaultColor: '#22C55E' },
  { id: 'neon', name: 'Cyber Neon', description: 'Glowing effect with dark overlays.', defaultColor: '#F43F5E' },
  { id: 'retro', name: 'Vintage 90s', description: 'Bold patterns and retro typography.', defaultColor: '#FACC15' },
  { id: 'minimal', name: 'Pure Design', description: 'Focus on typography and white space.', defaultColor: '#111827' },
  { id: 'gaming', name: 'Pro Gaming', description: 'Intense energy and dynamic frames.', defaultColor: '#A855F7' },
];
