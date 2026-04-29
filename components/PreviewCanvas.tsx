'use client';

import React, { useEffect, useRef } from 'react';
import { ThemeId } from '@/lib/themes';

interface PreviewCanvasProps {
  id: string;
  title: string;
  subtitle: string;
  image: HTMLImageElement | null;
  themeId: ThemeId;
  langLabel: string;
  color: string;
  titleColor: string;
  subtitleColor: string;
  titleFont: string;
  subtitleFont: string;
  aspectRatio: { width: number; height: number };
  onUpdate?: (blob: Blob | null) => void;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  id,
  title,
  subtitle,
  image,
  themeId,
  langLabel,
  color,
  titleColor,
  subtitleColor,
  titleFont,
  subtitleFont,
  aspectRatio,
  onUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      let width = aspectRatio.width;
      let height = aspectRatio.height;

      if (width === 0 || height === 0) {
        if (image) {
          width = 1280;
          height = 1280 / (image.width / image.height);
        } else {
          width = 1280;
          height = 720;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      if (image) {
        const imgRatio = image.width / image.height;
        const canvasRatio = width / height;
        let renderWidth, renderHeight, x, y;

        if (imgRatio > canvasRatio) {
          renderHeight = height;
          renderWidth = image.width * (height / image.height);
          x = (width - renderWidth) / 2;
          y = 0;
        } else {
          renderWidth = width;
          renderHeight = image.height * (width / image.width);
          x = 0;
          y = (height - renderHeight) / 2;
        }
        ctx.drawImage(image, x, y, renderWidth, renderHeight);
      } else {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#1a1a1a');
        grad.addColorStop(1, '#000000');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 50) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, height);
          ctx.stroke();
        }
        for (let i = 0; i < height; i += 50) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(width, i);
          ctx.stroke();
        }
      }

      ctx.textAlign = 'left'; 
      ctx.textBaseline = 'top';

      const padding = 60;
      const isEnglish = langLabel === 'English';
      const displayTitle = isEnglish ? title : title.toUpperCase();
      const displaySubtitle = isEnglish ? subtitle : subtitle.toUpperCase();

      switch (themeId) {
        case 'classic': {
          const overlay = ctx.createLinearGradient(0, 0, width * 0.8, 0);
          overlay.addColorStop(0, 'rgba(0,0,0,0.85)');
          overlay.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = overlay;
          ctx.fillRect(0, 0, width, height);

          drawAdaptiveText(ctx, {
            text: displayTitle,
            x: padding,
            y: 100,
            maxWidth: width * 0.9,
            maxHeight: 200,
            baseFontSize: 110,
            fontFamily: titleFont,
            color: titleColor,
            shadow: { color: 'rgba(0,0,0,0.8)', blur: 15, offset: 8 },
            lineHeight: 1.1,
            singleLine: true
          });

          drawAdaptiveText(ctx, {
            text: displaySubtitle,
            x: padding,
            y: height - 160,
            maxWidth: width * 0.6,
            maxHeight: 120,
            baseFontSize: 50,
            fontFamily: subtitleFont,
            color: subtitleColor,
            fontWeight: '600',
            lineHeight: 1.2
          });
          break;
        }

        case 'split': {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
          ctx.fillRect(0, 0, width * 0.45, height);
          
          ctx.strokeStyle = color;
          ctx.lineWidth = 15;
          ctx.strokeRect(width * 0.45 - 7.5, 0, 15, height);

          drawAdaptiveText(ctx, {
            text: displayTitle,
            x: 50,
            y: 100,
            maxWidth: width * 0.35,
            maxHeight: 450,
            baseFontSize: 90,
            fontFamily: titleFont,
            color: titleColor,
            fontWeight: '900',
            lineHeight: 1.05,
            singleLine: true
          });

          drawAdaptiveText(ctx, {
            text: displaySubtitle,
            x: 50,
            y: height - 180,
            maxWidth: width * 0.35,
            maxHeight: 120,
            baseFontSize: 40,
            fontFamily: subtitleFont,
            color: subtitleColor,
            fontWeight: '500',
            lineHeight: 1.3
          });
          break;
        }

        case 'gradient': {
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, color + '77');
          grad.addColorStop(1, 'rgba(0,0,0,0.7)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          drawAdaptiveText(ctx, {
            text: displayTitle,
            x: width / 2,
            y: height / 2 - 40,
            maxWidth: width * 0.8,
            maxHeight: 300,
            baseFontSize: 110,
            fontFamily: titleFont,
            color: titleColor,
            fontWeight: '800',
            textAlign: 'center',
            textBaseline: 'middle',
            singleLine: true
          });

          drawAdaptiveText(ctx, {
            text: displaySubtitle,
            x: width / 2,
            y: height / 2 + 100,
            maxWidth: width * 0.7,
            maxHeight: 120,
            baseFontSize: 45,
            fontFamily: subtitleFont,
            color: subtitleColor,
            fontWeight: '400',
            textAlign: 'center',
            textBaseline: 'middle'
          });
          break;
        }

        case 'brutalist': {
          ctx.font = '900 300px Anton, sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          ctx.fillText(isEnglish ? langLabel : langLabel.toUpperCase(), -20, 250);

          ctx.fillStyle = '#000000';
          const titleY = 100;
          const { fontSize: finalTitleSize } = drawAdaptiveText(ctx, {
            text: displayTitle,
            x: 70,
            y: titleY + 90,
            maxWidth: width - 200,
            maxHeight: 200,
            baseFontSize: 100,
            fontFamily: titleFont,
            color: titleColor,
            render: false,
            singleLine: true
          });

          // Draw Black Box for Title
          const titleBoxHeight = (finalTitleSize * 1.3) + 20;
          ctx.fillStyle = '#000000';
          ctx.fillRect(40, titleY, width - 80, titleBoxHeight);
          
          drawAdaptiveText(ctx, {
            text: displayTitle,
            x: 70,
            y: titleY + (finalTitleSize * 0.15) + 5,
            maxWidth: width - 200,
            maxHeight: 200,
            baseFontSize: finalTitleSize,
            fontFamily: titleFont,
            color: titleColor,
            singleLine: true
          });

          // Subtitle box at bottom
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(40, height - 160, width - 80, 100);
          
          drawAdaptiveText(ctx, {
            text: displaySubtitle,
            x: 60,
            y: height - 110,
            maxWidth: width - 120,
            maxHeight: 80,
            baseFontSize: 50,
            fontFamily: subtitleFont,
            color: subtitleColor,
            textBaseline: 'middle'
          });
          break;
        }

        case 'neon': {
          ctx.fillStyle = 'rgba(10, 10, 30, 0.7)';
          ctx.fillRect(0, 0, width, height);

          drawAdaptiveText(ctx, {
            text: title,
            x: width / 2,
            y: height / 2 - 40,
            maxWidth: width * 0.9,
            maxHeight: 350,
            baseFontSize: 130,
            fontFamily: titleFont,
            color: titleColor,
            fontWeight: '800',
            textAlign: 'center',
            textBaseline: 'middle',
            shadow: { color: color, blur: 40, offset: 0 },
            singleLine: true
          });
          
          drawAdaptiveText(ctx, {
            text: subtitle,
            x: width / 2,
            y: height / 2 + 120,
            maxWidth: width * 0.8,
            maxHeight: 120,
            baseFontSize: 50,
            fontFamily: subtitleFont,
            color: subtitleColor,
            fontWeight: '400',
            textAlign: 'center',
            textBaseline: 'middle',
            shadow: { color: '#3B82F6', blur: 20, offset: 0 }
          });
          break;
        }

        case 'retro': {
           ctx.fillStyle = color;
           for(let i=0; i<width; i+=40) {
              for(let j=0; j<height; j+=40) {
                 if((i+j)%80===0) ctx.fillRect(i, j, 4, 4);
              }
           }
           
           ctx.strokeStyle = '#000000';
           ctx.lineWidth = 15;
           ctx.strokeRect(40, 40, width-80, height-80);
           
           drawAdaptiveText(ctx, {
             text: displayTitle,
             x: 80,
             y: 80,
             maxWidth: width - 160,
             maxHeight: 350,
             baseFontSize: 140,
             fontFamily: titleFont,
             color: titleColor,
             singleLine: true
           });
           
           drawAdaptiveText(ctx, {
             text: displaySubtitle,
             x: 80,
             y: height - 160,
             maxWidth: width - 160,
             maxHeight: 100,
             baseFontSize: 60,
             fontFamily: subtitleFont,
             color: subtitleColor,
             shadow: { color: '#000000', blur: 0, offset: 4 }
           });
           break;
        }

        case 'minimal': {
           ctx.fillStyle = 'rgba(255,255,255,0.92)';
           ctx.fillRect(width*0.05, height*0.05, width*0.9, height*0.9);
           
           drawAdaptiveText(ctx, {
             text: displayTitle,
             x: width / 2,
             y: height / 2 - 40,
             maxWidth: width * 0.7,
             maxHeight: 300,
             baseFontSize: 90,
             fontFamily: titleFont,
             color: titleColor,
             fontWeight: '300',
             textAlign: 'center',
             textBaseline: 'middle',
             singleLine: true
           });
           
           ctx.letterSpacing = '12px';
           drawAdaptiveText(ctx, {
             text: displaySubtitle,
             x: width / 2,
             y: height / 2 + 80,
             maxWidth: width * 0.7,
             maxHeight: 80,
             baseFontSize: 24,
             fontFamily: subtitleFont,
             color: subtitleColor,
             fontWeight: '600',
             textAlign: 'center',
             textBaseline: 'middle'
           });
           ctx.letterSpacing = '0px';
           break;
        }

        case 'gaming': {
           const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width*0.6);
           grad.addColorStop(0, 'rgba(0,0,0,0)');
           grad.addColorStop(1, color + 'bb');
           ctx.fillStyle = grad;
           ctx.fillRect(0,0,width,height);
           
           ctx.strokeStyle = color;
           ctx.lineWidth = 25;
           ctx.strokeRect(0,0,width,height);
           
           drawAdaptiveText(ctx, {
             text: displayTitle,
             x: width / 2,
             y: height / 2,
             maxWidth: width * 0.85,
             maxHeight: 400,
             baseFontSize: 150,
             fontFamily: titleFont,
             color: titleColor,
             textAlign: 'center',
             textBaseline: 'middle',
             fontWeight: '900',
             shadow: { color: '#000000', blur: 30, offset: 0 },
             singleLine: true
           });
           
           drawAdaptiveText(ctx, {
             text: displaySubtitle,
             x: width / 2,
             y: height / 2 + 130,
             maxWidth: width * 0.8,
             maxHeight: 100,
             baseFontSize: 65,
             fontFamily: subtitleFont,
             color: subtitleColor,
             textAlign: 'center',
             textBaseline: 'middle',
             fontWeight: '900',
             shadow: { color: '#000000', blur: 10, offset: 0 }
           });
           break;
        }
      }

      ctx.shadowBlur = 0;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      canvas.toBlob((blob) => {
        onUpdate?.(blob);
      }, 'image/png');
    };

    if (document.fonts) {
      document.fonts.ready.then(draw);
    } else {
      draw();
    }
  }, [title, subtitle, image, themeId, langLabel, color, aspectRatio, titleColor, subtitleColor, titleFont, subtitleFont, onUpdate]);

  return (
    <div className="relative group w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full transition-transform duration-500 group-hover:scale-[1.01] object-contain cursor-default"
        id={id}
        style={{ 
          aspectRatio: `${aspectRatio.width} / ${aspectRatio.height}`
        }}
      />
    </div>
  );
};

interface TextOptions {
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  maxHeight: number;
  baseFontSize: number;
  fontFamily: string;
  color: string;
  fontWeight?: string;
  lineHeight?: number;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  shadow?: { color: string; blur: number; offset: number };
  render?: boolean;
  singleLine?: boolean;
}

function drawAdaptiveText(ctx: CanvasRenderingContext2D, options: TextOptions) {
  const {
    text, x, y, maxWidth, maxHeight, baseFontSize, fontFamily, color,
    fontWeight = 'normal', lineHeight = 1.2, textAlign = 'left',
    textBaseline = 'top', shadow, render = true, singleLine = false
  } = options;

  let fontSize = baseFontSize;
  let lines: string[] = [];

  while (fontSize > 8) {
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    
    if (singleLine) {
      const metrics = ctx.measureText(text);
      if (metrics.width <= maxWidth) {
        lines = [text];
        break;
      }
    } else {
      lines = [];
      let currentLine = '';
      const chars = text.split('');
      
      for (let n = 0; n < chars.length; n++) {
        const testLine = currentLine + chars[n];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(currentLine);
          currentLine = chars[n];
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);

      const totalHeight = lines.length * fontSize * lineHeight;
      if (totalHeight <= maxHeight) break;
    }
    fontSize -= 1;
  }

  if (render) {
    ctx.save();
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    
    if (shadow) {
      ctx.shadowColor = shadow.color;
      ctx.shadowBlur = shadow.blur;
      ctx.shadowOffsetX = shadow.offset;
      ctx.shadowOffsetY = shadow.offset;
    }

    let startY = y;
    if (textBaseline === 'middle') {
       startY = y - ((lines.length - 1) * fontSize * lineHeight) / 2;
    } else if (textBaseline === 'bottom') {
       startY = y - (lines.length * fontSize * lineHeight);
    }

    lines.forEach((line, i) => {
      ctx.fillText(line, x, startY + i * fontSize * lineHeight);
    });
    ctx.restore();
  }

  return { fontSize, lines };
}
