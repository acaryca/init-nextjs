const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // npm install sharp --save-dev

// Path to the SVG file of the favicon
const faviconSvgPath = path.join(__dirname, 'favicon.svg');
// Output directory for the favicon.ico
const appOutputDir = path.join(__dirname, '..', '..', 'app');

// Icon sizes to generate (in pixels) for the favicon
const faviconSizes = [16, 24, 32, 48, 64, 128, 256];

// Function to create the directory if it doesn't exist
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Function to convert SVG to favicon.ico
async function generateFavicon() {
  try {
    // Create the output directory if it doesn't exist
    ensureDirectoryExists(appOutputDir);
    
    // Generate the temporary PNGs for the favicon
    const tempPngs = [];
    for (const size of faviconSizes) {
      const pngPath = path.join(appOutputDir, `favicon-${size}.png`);
      await sharp(faviconSvgPath)
        .resize(size, size)
        .png()
        .toFile(pngPath);
      console.log(`SVG to PNG conversion (${size}x${size}) for favicon successful!`);
      tempPngs.push(pngPath);
    }
    
    // Create the ICO file using the largest size
    await sharp(faviconSvgPath)
      .resize(256, 256)
      .toFile(path.join(appOutputDir, 'favicon.ico'));
    console.log('Favicon.ico creation successful!');
    
    // Clean the temporary PNG files
    for (const pngPath of tempPngs) {
      fs.unlinkSync(pngPath);
    }
    
    console.log('Favicon generation completed!');
    
  } catch (err) {
    console.error('Error during favicon generation:', err);
  }
}

// Execute the generation
generateFavicon(); 