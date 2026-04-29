# FLARE COVER - Parallel Render Engine

FLARE COVER is a high-performance, multilingual thumbnail and cover generation engine built with Next.js. It allows creators to design and preview marketing assets across multiple languages and aspect ratios simultaneously.

## 🚀 Features

- **Concurrent Multilingual Stack**: Design covers for multiple languages at once. Change the title in one tab and see the impact across all localized variations.
- **Dynamic Render Themes**: Switch between various aesthetic layouts:
  - **Classic**: The bold, high-contrast YouTube standard.
  - **Split**: Elegant editorial layout with image-text separation.
  - **Gradient**: Modern vibrant overlaps for tech and lifestyle.
  - **Brutalist**: Raw, typography-focused impact.
  - **Neon**: Cyberpunk-inspired glow and dark aesthetics.
  - **Retro**: Nostalgic scanlines and halftone textures.
  - **Minimal**: Clean, white-space driven design.
  - **Gaming**: Aggressive, action-oriented gaming aesthetics.
- **Multi-Ratio Matrix**: Real-time previews for:
  - **16:9** (YouTube/Widescreen)
  - **1:1** (Instagram/Square)
  - **9:16** (Shorts/TikTok/Reels)
- **Advanced Customization**:
  - Full control over accent colors, title colors, and subtitle colors.
  - Curated font library (Anton, Space Grotesk, Inter).
  - High-resolution background image support.
- **Production Ready**:
  - Offline persistence: Settings are saved automatically via `localStorage`.
  - Responsive configuration: Fully functional on mobile via a configuration sheet.
  - Instant PNG extraction at full canvas resolution.

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [motion/react](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Canvas**: Native HTML5 Canvas for high-fidelity rendering.

## 📖 How to Use

1. **Upload Asset**: Start by uploading a high-quality background image.
2. **Localize**: Add new language variations via the "Add" button in the configuration panel.
3. **Configure**: Adjust titles, subtitles, and choose a theme that fits your brand.
4. **Refine**: Open "Advanced Details" to tweak specific colors and typography.
5. **Preview**: Click on any thumbnail in the matrix to see a full-sized preview.
6. **Export**: Click "Download PNG" in the preview modal to save your asset.

## 📜 License

This project is open-source. Feel free to fork, modify, and use it for your own content creation pipelines.
