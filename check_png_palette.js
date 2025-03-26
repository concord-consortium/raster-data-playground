import fs from 'fs';
import { PNG } from 'pngjs';

// Read the PNG file
const pngBuffer = fs.readFileSync('GPM_3IMERGM_2025-02-01_rgb_360x180.png');
const png = PNG.sync.read(pngBuffer);

// Debug information
console.log('PNG Properties:');
console.log('==============');
console.log(`Width: ${png.width}`);
console.log(`Height: ${png.height}`);
console.log(`Color Type: ${png.colorType}`);
console.log(`Has Palette: ${!!png.palette}`);
console.log(`Palette Type: ${typeof png.palette}`);
console.log(`Palette Length: ${png.palette ? png.palette.length : 'N/A'}`);

// Inspect the palette object
console.log('\nPalette Object:');
console.log('==============');
if (png.palette) {
    console.log('Keys:', Object.keys(png.palette));
    console.log('Is Array:', Array.isArray(png.palette));
    console.log('toString:', png.palette.toString());
    console.log('Raw palette data:', png.palette);
}

console.log('\nFirst few pixels:');
console.log('================');
for (let i = 0; i < 10; i++) {
    console.log(`Pixel ${i}: ${png.data[i]}`);
}

// Check if the PNG has a palette
if (png.palette) {
    console.log('\nPNG Palette Found:');
    console.log('=================');
    console.log('Index\tR\tG\tB');
    console.log('-------------------');
    png.palette.forEach((color, index) => {
        // Each color is an array of [R,G,B,A]
        console.log(`${index}\t${color[0]}\t${color[1]}\t${color[2]}`);
    });
    console.log(`\nTotal palette entries: ${png.palette.length}`);
} else {
    console.log('No palette found in PNG file');
} 