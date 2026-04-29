const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputImage = path.resolve(process.argv[2]);
const outputDir = path.resolve(process.argv[3]);

console.log("🎨 开始生成 favicon 资源...");
console.log(` 输入图片：${inputImage}`);
console.log(`📤 输出目录：${outputDir}`);

async function generateFavicons() {
  try {
    const sizes = [
      { name: "favicon-16x16.png", size: "16x16" },
      { name: "favicon-32x32.png", size: "32x32" },
      { name: "apple-touch-icon.png", size: "180x180" },
      { name: "icon-192.png", size: "192x192" },
      { name: "icon-512.png", size: "512x512" },
      { name: "icon-192-maskable.png", size: "192x192" },
      { name: "icon-512-maskable.png", size: "512x512" },
    ];

    for (const config of sizes) {
      const outputPath = path.join(outputDir, config.name);
      const [width, height] = config.size.split("x").map(Number);

      console.log(`🔄 生成 ${config.name} (${config.size})...`);

      await sharp(inputImage)
        .resize(width, height, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .toFile(outputPath);

      console.log(`✅ 已生成：${config.name}`);
    }

    // 生成 favicon.ico (使用 32x32 PNG)
    const icoPath = path.join(outputDir, "favicon.ico");
    await sharp(inputImage).resize(32, 32).png().toFile(icoPath);
    console.log("✅ 已生成：favicon.ico");

    // 生成 apple-icon.png
    const appleIconPath = path.join(outputDir, "apple-icon.png");
    await sharp(inputImage)
      .resize(180, 180, { fit: "contain" })
      .toFile(appleIconPath);
    console.log("✅ 已生成：apple-icon.png");

    // 生成 manifest.json
    const manifestPath = path.join(outputDir, "manifest.json");
    const manifest = {
      name: "FLARE COVER",
      short_name: "FLARE",
      description: "AI-powered Thumbnail Generator",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#6b46c1",
      icons: [
        {
          src: "/icon-192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/icon-192-maskable.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "/icon-512-maskable.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    };

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log("✅ 已生成：manifest.json");

    console.log("\n✨ Favicon 资源生成完成！");
    console.log("\n📋 生成的文件：");
    sizes.forEach((s) => console.log(`  - ${s.name} (${s.size})`));
    console.log("  - favicon.ico (32x32)");
    console.log("  - apple-icon.png (180x180)");
    console.log("  - manifest.json");
  } catch (error) {
    console.error("❌ 生成 favicon 时出错：", error);
    process.exit(1);
  }
}

generateFavicons();
