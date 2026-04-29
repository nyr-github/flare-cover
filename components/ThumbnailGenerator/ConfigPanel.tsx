'use client';

import React from 'react';
import { Zap, Image as ImageIcon } from 'lucide-react';
import { THEMES, ThemeId, FONTS } from '@/lib/themes';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LanguageConfig } from '@/lib/types';

interface ConfigPanelProps {
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
  setImagePreview: (val: string | null) => void;
  setBaseImage: (val: HTMLImageElement | null) => void;
  addLanguage: () => void;
  removeLanguage: (id: string) => void;
  updateLang: (id: string, updates: Partial<LanguageConfig>) => void;
  languages: LanguageConfig[];
  activeTab: string;
  setActiveTab: (val: string) => void;
  selectedTheme: ThemeId;
  setSelectedTheme: (val: ThemeId) => void;
  themeColor: string;
  setThemeColor: (val: string) => void;
  titleColor: string;
  setTitleColor: (val: string) => void;
  subtitleColor: string;
  setSubtitleColor: (val: string) => void;
  titleFont: string;
  setTitleFont: (val: string) => void;
  subtitleFont: string;
  setSubtitleFont: (val: string) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  handleImageUpload,
  imagePreview,
  setImagePreview,
  setBaseImage,
  addLanguage,
  removeLanguage,
  updateLang,
  languages,
  activeTab,
  setActiveTab,
  selectedTheme,
  setSelectedTheme,
  themeColor,
  setThemeColor,
  titleColor,
  setTitleColor,
  subtitleColor,
  setSubtitleColor,
  titleFont,
  setTitleFont,
  subtitleFont,
  setSubtitleFont,
}) => {
  return (
    <div className="flex flex-col h-full bg-zinc-900 overflow-hidden">
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-6 lg:p-8 space-y-8">
          <header>
            <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2 text-red-500 italic uppercase">
              <Zap className="w-6 h-6 fill-current" />
              FLARE COVER
            </h1>
            <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-[0.3em] font-bold">Parallel Render Engine</p>
          </header>

          <div className="space-y-6">
            {/* Image Upload */}
            <div className="group">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2 block">Original Asset</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className={`
                  h-28 w-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all overflow-hidden relative
                  ${imagePreview ? 'border-red-500/50 bg-red-500/5' : 'border-zinc-700 bg-zinc-800 hover:border-red-500'}
                `}>
                  {imagePreview && (
                    <>
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setBaseImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 z-20 p-1.5 bg-black/60 hover:bg-red-600 rounded-md transition-colors border border-white/10"
                        title="Remove Image"
                      >
                         <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </>
                  )}
                  <div className={`${imagePreview ? 'absolute' : 'relative'} flex flex-col items-center text-center pointer-events-none gap-2`}>
                    {!imagePreview && <ImageIcon className="w-5 h-5 text-zinc-500" />}
                    <span className="text-[10px] font-bold text-zinc-400 group-hover:text-red-500 transition-colors uppercase tracking-widest">
                      {imagePreview ? 'Replace Background' : 'Upload Base Asset'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Language Editor */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Language Variations</label>
                <button 
                  onClick={addLanguage}
                  className="text-[10px] bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded font-bold uppercase transition-colors"
                >
                  + Add
                </button>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-zinc-800 border border-zinc-700 w-full justify-start overflow-x-auto h-auto p-1 mb-4 flex-wrap">
                  {languages.map((lang) => (
                    <TabsTrigger
                      key={lang.id}
                      value={lang.id}
                      className="data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-900 text-[9px] font-black uppercase tracking-widest text-zinc-500"
                    >
                      {lang.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {languages.map((lang) => (
                  <TabsContent key={lang.id} value={lang.id} className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-800 space-y-4">
                      <div className="flex items-center justify-between gap-2 border-b border-zinc-700 pb-2 mb-2">
                         <input
                          value={lang.label}
                          onChange={(e) => updateLang(lang.id, { label: e.target.value })}
                          className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-zinc-300 w-full focus:outline-none"
                          placeholder="TAB LABEL"
                        />
                        {languages.length > 1 && (
                          <button 
                            onClick={() => removeLanguage(lang.id)}
                            className="text-zinc-600 hover:text-red-500 transition-all p-1"
                            title="Remove language"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block">Primary Title</label>
                        <input
                          value={lang.title}
                          onChange={(e) => updateLang(lang.id, { title: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded p-2.5 text-xs focus:outline-none focus:border-red-500 transition-colors placeholder-zinc-700"
                          placeholder="ENTER TITLE"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block">Subtitle Overlay</label>
                        <input
                          value={lang.subtitle}
                          onChange={(e) => updateLang(lang.id, { subtitle: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded p-2.5 text-xs focus:outline-none focus:border-red-500 transition-colors placeholder-zinc-700"
                          placeholder="ENTER SUBTITLE"
                        />
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Layout Aesthetics Dropdown */}
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Layout Aesthetics</label>
              <Select value={selectedTheme} onValueChange={(val) => val && setSelectedTheme(val as ThemeId)}>
                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-300 text-[10px] h-10 uppercase font-black tracking-widest">
                  <SelectValue placeholder="Select Style" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-300">
                  {THEMES.map((theme) => (
                    <SelectItem 
                      key={theme.id} 
                      value={theme.id}
                      className="focus:bg-red-600 focus:text-white uppercase text-[10px] font-black tracking-widest"
                    >
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Customization Collapsible */}
            <Accordion className="w-full">
              <AccordionItem value="advanced" className="border-zinc-800">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-zinc-800 rounded">
                      <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-left">Advanced Details</h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6 space-y-6">
                  {/* Customization Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Theme Accent</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={themeColor}
                            onChange={(e) => setThemeColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer bg-transparent"
                          />
                          <span className="text-[10px] font-mono text-zinc-400 uppercase">{themeColor}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Title Color</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={titleColor}
                            onChange={(e) => setTitleColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer bg-transparent"
                          />
                          <span className="text-[10px] font-mono text-zinc-400 uppercase">{titleColor}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Subtitle Color</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={subtitleColor}
                            onChange={(e) => setSubtitleColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer bg-transparent"
                          />
                          <span className="text-[10px] font-mono text-zinc-400 uppercase">{subtitleColor}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2 block">Title Font Face</label>
                        <Select value={titleFont} onValueChange={(val) => val && setTitleFont(val)}>
                          <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-300 text-[10px] h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-300">
                            {FONTS.map(f => <SelectItem key={f.id} value={f.id} className="text-xs">{f.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2 block">Subtitle Font Face</label>
                        <Select value={subtitleFont} onValueChange={(val) => val && setSubtitleFont(val)}>
                          <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-300 text-[10px] h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-300">
                            {FONTS.map(f => <SelectItem key={f.id} value={f.id} className="text-xs">{f.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-zinc-800 shrink-0">
         <p className="text-center text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] italic">Parallel Render v3.0 (Dynamic Matrix)</p>
      </div>
    </div>
  );
};
