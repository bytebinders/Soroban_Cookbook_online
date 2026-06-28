const fs = require('fs');
const path = require('path');

try {
  const sharp = require('sharp');

  async function optimizeImages() {
    const imgDir = path.join(__dirname, 'static', 'img');

    const images = [
      { name: '404.png',                   quality: 85, resize: 600 },
      { name: 'docusaurus.png',            quality: 85 },
      { name: 'docusaurus-social-card.jpg', quality: 85 },
      { name: 'soroban-social-card.png',   quality: 85 },
    ];

    for (const img of images) {
      const inputPath = path.join(imgDir, img.name);
      const outputPath = path.join(imgDir, img.name.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

      if (!fs.existsSync(inputPath)) continue;
      if (fs.existsSync(outputPath)) {
        console.log(`Skipping ${img.name} — WebP already exists`);
        continue;
      }

      console.log(`\nOptimizing ${img.name}...`);
      const originalStats = fs.statSync(inputPath);
      console.log(`  Original : ${(originalStats.size / 1024).toFixed(2)} KB`);

      let pipeline = sharp(inputPath);
      if (img.resize) {
        pipeline = pipeline.resize(img.resize, null, {
          withoutEnlargement: true,
          fit: 'inside',
        });
      }
      await pipeline.webp({ quality: img.quality }).toFile(outputPath);

      const newStats = fs.statSync(outputPath);
      const saved = ((1 - newStats.size / originalStats.size) * 100).toFixed(1);
      console.log(`  WebP     : ${(newStats.size / 1024).toFixed(2)} KB  (-${saved}%)`);
    }

    console.log('\nDone.');
  }

  optimizeImages().catch(console.error);
} catch {
  console.error('sharp is not installed. Run: bun add -d sharp');
}
