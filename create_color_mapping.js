import fs from 'fs';
import { PNG } from 'pngjs';

// Read the CSV file
const csvContent = fs.readFileSync('GPM_3IMERGM_2025-02-01_rgb_360x180.CSV', 'utf-8');
const csvValues = csvContent
    .split('\n')
    .map(line => line.split(',').map(value => parseFloat(value.trim())));

// Read the PNG file
const pngBuffer = fs.readFileSync('GPM_3IMERGM_2025-02-01_rgb_360x180.png');
const png = PNG.sync.read(pngBuffer);

if (!png.palette) {
    console.error('No palette found in PNG file');
    process.exit(1);
}

if (png.colorType !== 3) {
    console.error('PNG is not in indexed color mode');
    process.exit(1);
}

// Create a map to store palette index -> value mappings
const indexToValue = new Map();

// Process each pixel
for (let y = 0; y < png.height; y++) {
    const csvY = y;
    
    for (let x = 0; x < png.width; x++) {
        // Skip if we don't have corresponding CSV data
        if (!csvValues[csvY] || !csvValues[csvY][x]) continue;
        
        const csvValue = csvValues[csvY][x];

        // In indexed color mode, the PNG library still returns RGBA data
        // Each pixel is 4 bytes (R,G,B,A)
        const idx = (y * png.width + x) * 4;
        const r = png.data[idx];
        const g = png.data[idx + 1];
        const b = png.data[idx + 2];
        
        // Find the palette index that matches this RGB color
        const paletteIndex = png.palette.findIndex(color => 
            color[0] === r && color[1] === g && color[2] === b
        );
        
        if (paletteIndex === -1) {
            console.error(`No matching palette entry found for RGB(${r},${g},${b})`);
            continue;
        }
        
        // Store the mapping
        if (!indexToValue.has(csvValue)) {
            indexToValue.set(csvValue, {
                paletteIndex,
                r,
                g,
                b,
                value: csvValue
            });
        }
    }
}

// Convert map to array and sort by palette index
const mappings = Array.from(indexToValue.values())
    .sort((a, b) => a.value - b.value);

// Create CSV output
const csvOutput = ['palette_index,r,g,b,value'];
mappings.forEach(mapping => {
    csvOutput.push(`${mapping.paletteIndex},${mapping.r},${mapping.g},${mapping.b},${mapping.value}`);
});

// Write to file
fs.writeFileSync('color_mapping.csv', csvOutput.join('\n'));

// Print summary
console.log(`PNG Dimensions: ${png.width}x${png.height}`);
console.log(`CSV Dimensions: ${csvValues[0].length}x${csvValues.length}`);
console.log('Color mapping has been saved to color_mapping.csv');
console.log(`Total number of unique colors: ${mappings.length}`);

// Print value range
const values = mappings.map(m => m.value);
console.log(`Value range: ${Math.min(...values)} to ${Math.max(...values)}`);

// Print palette index range
const indices = mappings.map(m => m.paletteIndex);
console.log(`Palette index range: ${Math.min(...indices)} to ${Math.max(...indices)}`);

// Validate the mapping
console.log('\nValidating color mapping...');
let totalPixels = 0;
let correctPredictions = 0;
let incorrectPredictions = 0;
let skippedPixels = 0;

// Create a reverse mapping from palette index to value
const paletteToValue = new Map(mappings.map(m => [m.paletteIndex, m.value]));

for (let y = 0; y < png.height; y++) {
    const csvY = y;
    
    for (let x = 0; x < png.width; x++) {
        totalPixels++;
        
        // Skip if we don't have corresponding CSV data
        if (!csvValues[csvY] || !csvValues[csvY][x]) {
            skippedPixels++;
            continue;
        }
        
        const csvValue = csvValues[csvY][x];
        
        // Get the RGB values from the PNG
        const idx = (y * png.width + x) * 4;
        const r = png.data[idx];
        const g = png.data[idx + 1];
        const b = png.data[idx + 2];
        
        // Find the palette index
        const paletteIndex = png.palette.findIndex(color => 
            color[0] === r && color[1] === g && color[2] === b
        );
        
        if (paletteIndex === -1) {
            console.error(`No matching palette entry found for RGB(${r},${g},${b}) at (${x},${y})`);
            incorrectPredictions++;
            continue;
        }
        
        // Get the predicted value from our mapping
        const predictedValue = paletteToValue.get(paletteIndex);
        
        if (predictedValue === undefined) {
            console.error(`No value mapping found for palette index ${paletteIndex} at (${x},${y})`);
            incorrectPredictions++;
            continue;
        }
        
        // Compare with actual value
        if (Math.abs(predictedValue - csvValue) < 0.001) { // Using small epsilon for float comparison
            correctPredictions++;
        } else {
            console.error(`Mismatch at (${x},${y}): predicted ${predictedValue}, actual ${csvValue}`);
            incorrectPredictions++;
        }
    }
}

console.log('\nValidation Results:');
console.log(`Total pixels: ${totalPixels}`);
console.log(`Skipped pixels (no CSV data): ${skippedPixels}`);
console.log(`Correct predictions: ${correctPredictions}`);
console.log(`Incorrect predictions: ${incorrectPredictions}`);
console.log(`Accuracy: ${((correctPredictions / (correctPredictions + incorrectPredictions)) * 100).toFixed(2)}%`); 