"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { PreviewCanvas } from "@/components/PreviewCanvas";
import { ThemeId } from "@/lib/themes";
import { PreviewSelection } from "@/lib/types";

interface ModalPreviewProps {
  selectedPreview: PreviewSelection | null;
  setSelectedPreview: (val: PreviewSelection | null) => void;
  baseImage: HTMLImageElement | null;
  selectedTheme: ThemeId;
  themeColor: string;
  titleColor: string;
  subtitleColor: string;
  titleFont: string;
  subtitleFont: string;
}

export const ModalPreview: React.FC<ModalPreviewProps> = ({
  selectedPreview,
  setSelectedPreview,
  baseImage,
  selectedTheme,
  themeColor,
  titleColor,
  subtitleColor,
  titleFont,
  subtitleFont,
}) => {
  return (
    <AnimatePresence>
      {selectedPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-12 bg-[#000000ef] backdrop-blur-sm"
          onClick={() => setSelectedPreview(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden max-w-[90vw] max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-100">
                    {selectedPreview.lang.label} - {selectedPreview.ratio.name}
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {selectedPreview.ratio.width} x{" "}
                    {selectedPreview.ratio.height} PX
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPreview(null)}
                className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden bg-black/40 p-6 lg:p-12 flex items-center justify-center min-h-0 relative">
              <PreviewCanvas
                id="canvas-modal"
                title={selectedPreview.lang.title}
                subtitle={selectedPreview.lang.subtitle}
                image={baseImage}
                themeId={selectedTheme}
                color={themeColor}
                titleColor={titleColor}
                subtitleColor={subtitleColor}
                titleFont={titleFont}
                subtitleFont={subtitleFont}
                aspectRatio={selectedPreview.ratio}
                langLabel={selectedPreview.lang.label}
              />
            </div>
            <div className="p-4 bg-zinc-950/50 flex justify-end gap-3">
              <button
                onClick={() => {
                  const canvas = document.getElementById(
                    "canvas-modal",
                  ) as HTMLCanvasElement;
                  if (canvas) {
                    const link = document.createElement("a");
                    // Format filename: Language-Ratio.png
                    const langName = selectedPreview.lang.label.replace(
                      /\s+/g,
                      "-",
                    );
                    const ratioName = selectedPreview.ratio.name.split(" ")[0]; // Get "16:9" from "16:9 (YouTube)"
                    link.download = `${langName}-${ratioName}.png`;
                    link.href = canvas.toDataURL("image/png", 1.0);
                    link.click();
                  }
                }}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase rounded transition-colors shadow-lg shadow-red-900/20"
              >
                Download PNG
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
