"use client";

import React, { useState, useRef, useEffect } from "react";
import { Zap, Menu, Download } from "lucide-react";
import { THEMES, ThemeId, FONTS, ASPECT_RATIOS } from "@/lib/themes";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ConfigPanel } from "@/components/ThumbnailGenerator/ConfigPanel";
import { PreviewMatrix } from "@/components/ThumbnailGenerator/PreviewMatrix";
import { ModalPreview } from "@/components/ThumbnailGenerator/ModalPreview";
import { LanguageConfig, PreviewSelection } from "@/lib/types";

export default function ThumbnailGenerator() {
  // State
  const [mounted, setMounted] = useState(false);
  const [languages, setLanguages] = useState<LanguageConfig[]>([
    {
      id: "en",
      label: "English",
      title: "MINIMALIST ROUTINE",
      subtitle: "CHANGE YOUR LIFESTYLE FOREVER",
    },
  ]);
  const [activeTab, setActiveTab] = useState<string>("en");
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>("classic");
  const [themeColor, setThemeColor] = useState("#EF4444");
  const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] =
    useState<PreviewSelection | null>(null);

  // Advanced Customization
  const [titleColor, setTitleColor] = useState("#FFFFFF");
  const [subtitleColor, setSubtitleColor] = useState("#FFFFFF");
  const [titleFont, setTitleFont] = useState(FONTS[0].id);
  const [subtitleFont, setSubtitleFont] = useState(FONTS[1].id);
  const isInitialLoad = useRef(true);

  // Persistence: Load from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("flare-cover-settings-v2");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.languages) setLanguages(data.languages);
        if (data.selectedTheme) setSelectedTheme(data.selectedTheme);
        if (data.themeColor) setThemeColor(data.themeColor);
        if (data.titleColor) setTitleColor(data.titleColor);
        if (data.subtitleColor) setSubtitleColor(data.subtitleColor);
        if (data.titleFont) setTitleFont(data.titleFont);
        if (data.subtitleFont) setSubtitleFont(data.subtitleFont);
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
  }, []);

  // Persistence: Save to localStorage
  useEffect(() => {
    const settings = {
      languages,
      selectedTheme,
      themeColor,
      titleColor,
      subtitleColor,
      titleFont,
      subtitleFont,
    };
    localStorage.setItem("flare-cover-settings-v2", JSON.stringify(settings));
  }, [
    languages,
    selectedTheme,
    themeColor,
    titleColor,
    subtitleColor,
    titleFont,
    subtitleFont,
  ]);

  // Sync color when theme changes
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    const theme = THEMES.find((t) => t.id === selectedTheme);
    if (theme) {
      setThemeColor(theme.defaultColor);

      if (["split", "minimal"].includes(selectedTheme)) {
        setTitleColor("#111827");
        setSubtitleColor("#4B5563");
      } else {
        setTitleColor("#FFFFFF");
        setSubtitleColor(
          ["classic", "gaming", "retro"].includes(selectedTheme)
            ? theme.defaultColor
            : "#FFFFFF",
        );
      }

      if (["classic", "brutalist", "retro", "gaming"].includes(selectedTheme)) {
        setTitleFont("Anton, sans-serif");
      } else if (["neon", "gradient", "minimal"].includes(selectedTheme)) {
        setTitleFont("Space Grotesk, sans-serif");
      } else {
        setTitleFont("Inter, sans-serif");
      }

      setSubtitleFont(
        ["neon", "gradient", "minimal", "retro"].includes(selectedTheme)
          ? "Space Grotesk, sans-serif"
          : "Inter, sans-serif",
      );
    }
  }, [selectedTheme]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setBaseImage(img);
        setImagePreview(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const addLanguage = () => {
    const newId = `lang-${Date.now()}`;
    setLanguages([
      ...languages,
      {
        id: newId,
        label: "New Language",
        title: "TITLE HERE",
        subtitle: "SUBTITLE HERE",
      },
    ]);
    setActiveTab(newId);
  };

  const removeLanguage = (id: string) => {
    if (languages.length > 1) {
      const remaining = languages.filter((l) => l.id !== id);
      setLanguages(remaining);
      if (activeTab === id) {
        setActiveTab(remaining[0].id);
      }
    }
  };

  const updateLang = (id: string, updates: Partial<LanguageConfig>) => {
    setLanguages((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    );
  };

  const handleBatchExport = async () => {
    const zip = new JSZip();
    const folder = zip.folder("flare-cover-exports");
    if (!folder) return;

    // Create a temporary off-screen canvas for rendering
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    // Import the draw function logic
    const renderCover = (
      lang: LanguageConfig,
      ratio: (typeof ASPECT_RATIOS)[0],
    ): Promise<Blob> => {
      return new Promise((resolve) => {
        let width = ratio.width;
        let height = ratio.height;

        if (width === 0 || height === 0) {
          if (baseImage) {
            width = 1280;
            height = 1280 / (baseImage.width / baseImage.height);
          } else {
            width = 1280;
            height = 720;
          }
        }

        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCtx.clearRect(0, 0, width, height);

        // Draw background image or gradient
        if (baseImage) {
          const imgRatio = baseImage.width / baseImage.height;
          const canvasRatio = width / height;
          let renderWidth, renderHeight, x, y;

          if (imgRatio > canvasRatio) {
            renderHeight = height;
            renderWidth = baseImage.width * (height / baseImage.height);
            x = (width - renderWidth) / 2;
            y = 0;
          } else {
            renderWidth = width;
            renderHeight = baseImage.height * (width / baseImage.width);
            x = 0;
            y = (height - renderHeight) / 2;
          }
          tempCtx.drawImage(baseImage, x, y, renderWidth, renderHeight);
        } else {
          const grad = tempCtx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, "#1a1a1a");
          grad.addColorStop(1, "#000000");
          tempCtx.fillStyle = grad;
          tempCtx.fillRect(0, 0, width, height);
        }

        // Apply theme rendering (simplified version)
        const padding = 60;
        const isEnglish = lang.label === "English";
        const displayTitle = isEnglish ? lang.title : lang.title.toUpperCase();
        const displaySubtitle = isEnglish
          ? lang.subtitle
          : lang.subtitle.toUpperCase();

        // Apply theme overlay
        tempCtx.textAlign = "left";
        tempCtx.textBaseline = "top";

        // Draw title and subtitle based on theme
        switch (selectedTheme) {
          case "classic": {
            const overlay = tempCtx.createLinearGradient(0, 0, width * 0.8, 0);
            overlay.addColorStop(0, "rgba(0,0,0,0.85)");
            overlay.addColorStop(1, "rgba(0,0,0,0)");
            tempCtx.fillStyle = overlay;
            tempCtx.fillRect(0, 0, width, height);

            tempCtx.font = `900 110px ${titleFont}`;
            tempCtx.fillStyle = titleColor;
            tempCtx.shadowColor = "rgba(0,0,0,0.8)";
            tempCtx.shadowBlur = 15;
            tempCtx.shadowOffsetX = 8;
            tempCtx.shadowOffsetY = 8;
            tempCtx.fillText(displayTitle, padding, 100, width * 0.9);

            tempCtx.font = `600 50px ${subtitleFont}`;
            tempCtx.fillStyle = subtitleColor;
            tempCtx.shadowBlur = 0;
            tempCtx.fillText(
              displaySubtitle,
              padding,
              height - 160,
              width * 0.6,
            );
            break;
          }
          default: {
            // Generic rendering for other themes
            tempCtx.font = `900 110px ${titleFont}`;
            tempCtx.fillStyle = titleColor;
            tempCtx.fillText(displayTitle, padding, 100, width * 0.9);

            tempCtx.font = `600 50px ${subtitleFont}`;
            tempCtx.fillStyle = subtitleColor;
            tempCtx.fillText(
              displaySubtitle,
              padding,
              height - 160,
              width * 0.6,
            );
          }
        }

        tempCanvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, "image/png");
      });
    };

    try {
      // Generate all combinations and add to ZIP
      let count = 0;
      for (const lang of languages) {
        for (const ratio of ASPECT_RATIOS) {
          try {
            const blob = await renderCover(lang, ratio);

            // Format filename: Language-Ratio.png
            const langName = lang.label.replace(/\s+/g, "-");
            const ratioName = ratio.name.split(" ")[0]; // Get "16:9" from "16:9 (YouTube)"
            const fileName = `${langName}-${ratioName}.png`;

            folder.file(fileName, blob);
            count++;
          } catch (error) {
            console.error(
              `Failed to export ${lang.label}-${ratio.name}:`,
              error,
            );
          }
        }
      }

      // Generate and download ZIP file
      if (count > 0) {
        const content = await zip.generateAsync({ type: "blob" });
        const timestamp = new Date().toISOString().slice(0, 10);
        saveAs(content, `flare-cover-${timestamp}.zip`);
      }
    } catch (error) {
      console.error("Failed to generate ZIP:", error);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#0F0F0F]" />;

  return (
    <div className="flex bg-[#0F0F0F] font-sans text-zinc-100 overflow-hidden h-screen">
      {/* Desktop Sidebar */}
      <aside
        suppressHydrationWarning
        className="hidden lg:flex w-[360px] h-full border-r border-zinc-800 shrink-0 flex-col overflow-hidden"
      >
        <ConfigPanel
          handleImageUpload={handleImageUpload}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          setBaseImage={setBaseImage}
          addLanguage={addLanguage}
          removeLanguage={removeLanguage}
          updateLang={updateLang}
          languages={languages}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          themeColor={themeColor}
          setThemeColor={setThemeColor}
          titleColor={titleColor}
          setTitleColor={setTitleColor}
          subtitleColor={subtitleColor}
          setSubtitleColor={setSubtitleColor}
          titleFont={titleFont}
          setTitleFont={setTitleFont}
          subtitleFont={subtitleFont}
          setSubtitleFont={setSubtitleFont}
        />
      </aside>

      {/* Main Area */}
      <main className="flex-1 bg-[#0a0a0a] flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2 text-red-500 italic font-black text-sm tracking-tighter">
            <Zap className="w-4 h-4 fill-current" />
            FLARE
          </div>

          <Sheet>
            <SheetTrigger className="p-2 text-zinc-400 hover:text-white transition-colors">
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 border-r border-zinc-800 bg-zinc-900 w-[300px] sm:w-[360px]"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Configuration Panel</SheetTitle>
              </SheetHeader>
              <ConfigPanel
                handleImageUpload={handleImageUpload}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                setBaseImage={setBaseImage}
                addLanguage={addLanguage}
                removeLanguage={removeLanguage}
                updateLang={updateLang}
                languages={languages}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
                themeColor={themeColor}
                setThemeColor={setThemeColor}
                titleColor={titleColor}
                setTitleColor={setTitleColor}
                subtitleColor={subtitleColor}
                setSubtitleColor={setSubtitleColor}
                titleFont={titleFont}
                setTitleFont={setTitleFont}
                subtitleFont={subtitleFont}
                setSubtitleFont={setSubtitleFont}
              />
            </SheetContent>
          </Sheet>
        </div>

        <PreviewMatrix
          languages={languages}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedPreview={setSelectedPreview}
          baseImage={baseImage}
          selectedTheme={selectedTheme}
          themeColor={themeColor}
          titleColor={titleColor}
          subtitleColor={subtitleColor}
          titleFont={titleFont}
          subtitleFont={subtitleFont}
          onBatchExport={handleBatchExport}
        />
      </main>

      {/* Modal Toolroom */}
      <ModalPreview
        selectedPreview={selectedPreview}
        setSelectedPreview={setSelectedPreview}
        baseImage={baseImage}
        selectedTheme={selectedTheme}
        themeColor={themeColor}
        titleColor={titleColor}
        subtitleColor={subtitleColor}
        titleFont={titleFont}
        subtitleFont={subtitleFont}
      />
    </div>
  );
}
