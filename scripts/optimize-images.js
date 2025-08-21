const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function optimizeImages() {
  const imageDir = './public/images';
  const optimizedDir = './public/images/optimized';
  
  try {
    // Create optimized directory if it doesn't exist
    await fs.mkdir(optimizedDir, { recursive: true });
    
    // Read all files in the images directory
    const files = await fs.readdir(imageDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });

    console.log(`Found ${imageFiles.length} images to optimize...`);

    for (const imageFile of imageFiles) {
      const inputPath = path.join(imageDir, imageFile);
      const baseName = path.parse(imageFile).name;
      const ext = path.parse(imageFile).ext;
      
      console.log(`Optimizing: ${imageFile}`);
      
      // Get image metadata
      const metadata = await sharp(inputPath).metadata();
      console.log(`  Original: ${metadata.width}x${metadata.height}, ${Math.round(metadata.density || 72)} DPI`);
      
      // Define responsive sizes (320w, 640w, 1024w, 1920w)
      const sizes = [320, 640, 1024, 1920];
      
      for (const size of sizes) {
        // Skip if original image is smaller than target size
        if (metadata.width && metadata.width < size) {
          console.log(`  Skipping ${size}w (original is only ${metadata.width}w)`);
          continue;
        }
        
        // Create WebP version
        const webpPath = path.join(optimizedDir, `${baseName}-${size}w.webp`);
        await sharp(inputPath)
          .resize(size, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ 
            quality: 85,
            effort: 6 // Maximum compression effort
          })
          .toFile(webpPath);
        
        console.log(`  Created: ${baseName}-${size}w.webp`);
        
        // Create JPEG fallback for better compatibility
        const jpegPath = path.join(optimizedDir, `${baseName}-${size}w.jpg`);
        await sharp(inputPath)
          .resize(size, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ 
            quality: 80,
            progressive: true,
            mozjpeg: true
          })
          .toFile(jpegPath);
        
        console.log(`  Created: ${baseName}-${size}w.jpg`);
      }
      
      // Create full-size WebP version
      const fullWebpPath = path.join(optimizedDir, `${baseName}.webp`);
      await sharp(inputPath)
        .webp({ 
          quality: 85,
          effort: 6
        })
        .toFile(fullWebpPath);
      
      console.log(`  Created: ${baseName}.webp (full size)`);
      
      // Create optimized JPEG fallback
      const fullJpegPath = path.join(optimizedDir, `${baseName}.jpg`);
      await sharp(inputPath)
        .jpeg({ 
          quality: 80,
          progressive: true,
          mozjpeg: true
        })
        .toFile(fullJpegPath);
      
      console.log(`  Created: ${baseName}.jpg (full size optimized)`);
      
      // Generate low-quality placeholder for blur-up effect
      const placeholderPath = path.join(optimizedDir, `${baseName}-placeholder.jpg`);
      await sharp(inputPath)
        .resize(20, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ 
          quality: 20
        })
        .blur(2)
        .toFile(placeholderPath);
      
      console.log(`  Created: ${baseName}-placeholder.jpg`);
    }
    
    console.log('\n✅ Image optimization complete!');
    
    // Generate image manifest for easy reference
    await generateImageManifest(optimizedDir);
    
  } catch (error) {
    console.error('❌ Error optimizing images:', error);
    process.exit(1);
  }
}

async function generateImageManifest(optimizedDir) {
  try {
    const files = await fs.readdir(optimizedDir);
    const manifest = {};
    
    // Group files by base name
    files.forEach(file => {
      const parsed = path.parse(file);
      const match = parsed.name.match(/^(.+?)(-\d+w|-placeholder)?$/);
      
      if (match) {
        const baseName = match[1];
        const suffix = match[2] || '';
        
        if (!manifest[baseName]) {
          manifest[baseName] = {
            webp: {},
            jpg: {},
            placeholder: null
          };
        }
        
        if (suffix === '-placeholder') {
          manifest[baseName].placeholder = `/images/optimized/${file}`;
        } else if (suffix.includes('w')) {
          const size = suffix.replace('-', '').replace('w', '');
          if (parsed.ext === '.webp') {
            manifest[baseName].webp[size] = `/images/optimized/${file}`;
          } else if (parsed.ext === '.jpg') {
            manifest[baseName].jpg[size] = `/images/optimized/${file}`;
          }
        } else {
          // Full size images
          if (parsed.ext === '.webp') {
            manifest[baseName].webp.full = `/images/optimized/${file}`;
          } else if (parsed.ext === '.jpg') {
            manifest[baseName].jpg.full = `/images/optimized/${file}`;
          }
        }
      }
    });
    
    // Write manifest file
    const manifestPath = path.join(optimizedDir, 'manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log('📋 Generated image manifest at /public/images/optimized/manifest.json');
    
    // Log summary
    console.log('\n📊 Optimization Summary:');
    Object.keys(manifest).forEach(imageName => {
      const image = manifest[imageName];
      const webpSizes = Object.keys(image.webp).length;
      const jpgSizes = Object.keys(image.jpg).length;
      console.log(`  ${imageName}: ${webpSizes} WebP variants, ${jpgSizes} JPEG variants, ${image.placeholder ? '1 placeholder' : 'no placeholder'}`);
    });
    
  } catch (error) {
    console.error('❌ Error generating manifest:', error);
  }
}

// Run the optimization
optimizeImages();