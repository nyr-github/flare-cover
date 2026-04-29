import type { Metadata } from "next";
import { Inter, Anton, Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-tech",
});

export const metadata: Metadata = {
  title: "FLARE COVER - AI-powered Thumbnail Generator",
  description:
    "Create stunning video thumbnails in seconds with professional themes.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        anton.variable,
        spaceGrotesk.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body
        suppressHydrationWarning
        className="bg-[#0F0F0F] text-zinc-100 antialiased"
      >
        {children}
        <script
          async
          src="https://plausible.aivaded.com/api/loader/flarecover.js"
        ></script>
      </body>
    </html>
  );
}
