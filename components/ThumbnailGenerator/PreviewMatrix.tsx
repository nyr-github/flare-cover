"use client";

import React from "react";
import { Download } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PreviewCanvas } from "@/components/PreviewCanvas";
import { ASPECT_RATIOS, ThemeId } from "@/lib/themes";
import { LanguageConfig, PreviewSelection } from "@/lib/types";

interface PreviewMatrixProps {
  languages: LanguageConfig[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  setSelectedPreview: (selection: PreviewSelection) => void;
  baseImage: HTMLImageElement | null;
  selectedTheme: ThemeId;
  themeColor: string;
  titleColor: string;
  subtitleColor: string;
  titleFont: string;
  subtitleFont: string;
  onBatchExport: () => void;
}

export const PreviewMatrix: React.FC<PreviewMatrixProps> = ({
  languages,
  activeTab,
  setActiveTab,
  setSelectedPreview,
  baseImage,
  selectedTheme,
  themeColor,
  titleColor,
  subtitleColor,
  titleFont,
  subtitleFont,
  onBatchExport,
}) => {
  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="p-6 lg:p-12">
        <div className="max-w-[1800px] mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full space-y-12"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 gap-4">
              <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 h-auto flex-wrap">
                {languages.map((lang) => (
                  <TabsTrigger
                    key={lang.id}
                    value={lang.id}
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-zinc-500 text-[10px] font-black uppercase tracking-widest px-4 sm:px-6 py-2"
                  >
                    {lang.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="flex items-center gap-4">
                <button
                  onClick={onBatchExport}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase rounded transition-colors shadow-lg shadow-red-900/20"
                >
                  <Download className="w-3 h-3" />
                  Export All
                </button>
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">
                    Concurrent Multilingual Stack
                  </span>
                  <span className="text-[9px] text-zinc-700 font-mono">
                    Parallel Sync Active
                  </span>
                </div>
              </div>
            </div>

            {languages.map((lang) => (
              <TabsContent
                key={lang.id}
                value={lang.id}
                className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 outline-none"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                  {ASPECT_RATIOS.map((ratio) => (
                    <div
                      key={`${lang.id}-${ratio.id}`}
                      className="space-y-4 group cursor-pointer"
                      onClick={() => setSelectedPreview({ lang, ratio })}
                    >
                      <div className="flex items-center justify-between px-1 text-zinc-500">
                        <span className="text-[11px] font-black uppercase tracking-[0.25em] group-hover:text-red-500 transition-colors">
                          {ratio.name}
                        </span>
                        <span className="text-[10px] font-mono tracking-tighter">
                          {ratio.width} × {ratio.height}
                        </span>
                      </div>
                      <div className="relative transform group-hover:scale-[1.02] transition-transform duration-300">
                        <PreviewCanvas
                          id={`canvas-${lang.id}-${ratio.id}`}
                          title={lang.title}
                          subtitle={lang.subtitle}
                          image={baseImage}
                          themeId={selectedTheme}
                          color={themeColor}
                          titleColor={titleColor}
                          subtitleColor={subtitleColor}
                          titleFont={titleFont}
                          subtitleFont={subtitleFont}
                          aspectRatio={ratio}
                          langLabel={lang.label}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </ScrollArea>
  );
};
