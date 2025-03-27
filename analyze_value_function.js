import fs from 'fs';

// Read the color mapping CSV
const csvContent = fs.readFileSync('color_mapping.csv', 'utf-8');
const lines = csvContent.split('\n').slice(1); // Skip header
const data = lines.map(line => {
    const [paletteIndex, r, g, b, value] = line.split(',').map(Number);
    return { paletteIndex, r, g, b, value };
});

// Sort by palette index and filter out 99999.00 values
const validData = data.filter(d => d.value !== 99999.00 && d.paletteIndex !== 0).sort((a, b) => a.paletteIndex - b.paletteIndex);

// Extract x (palette index) and y (value) arrays for analysis
const x = validData.map(d => d.paletteIndex);
const y = validData.map(d => d.value);

// Function to calculate mean
function mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Function to calculate standard deviation
function stdDev(arr) {
    const m = mean(arr);
    return Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / arr.length);
}

// Function to calculate correlation coefficient
function correlation(x, y) {
    const xMean = mean(x);
    const yMean = mean(y);
    const xStdDev = stdDev(x);
    const yStdDev = stdDev(y);
    
    const numerator = x.reduce((sum, xi, i) => 
        sum + (xi - xMean) * (y[i] - yMean), 0);
    return numerator / (x.length * xStdDev * yStdDev);
}

// Function to calculate R-squared for a given function
function rSquared(x, y, func) {
    const yMean = mean(y);
    const totalSS = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const residualSS = y.reduce((sum, yi, i) => 
        sum + Math.pow(yi - func(x[i]), 2), 0);
    return 1 - (residualSS / totalSS);
}

// Try different function types
console.log('Analyzing relationship between palette index and value...\n');
console.log(`Total data points: ${validData.length}`);
console.log(`Value range: ${Math.min(...y)} to ${Math.max(...y)}\n`);

// 1. Linear function: f(x) = mx + b
const correlationCoeff = correlation(x, y);
console.log(`Linear correlation coefficient: ${correlationCoeff.toFixed(4)}`);

// Calculate linear regression
const xMean = mean(x);
const yMean = mean(y);
const m = x.reduce((sum, xi, i) => sum + (xi - xMean) * (y[i] - yMean), 0) / 
         x.reduce((sum, xi) => sum + Math.pow(xi - xMean, 2), 0);
const b = yMean - m * xMean;

const linearFunc = x => m * x + b;
const linearRSquared = rSquared(x, y, linearFunc);
console.log(`Linear function: f(x) = ${m.toFixed(4)}x + ${b.toFixed(4)}`);
console.log(`R-squared for linear fit: ${linearRSquared.toFixed(4)}`);

// 2. Exponential function: f(x) = ae^(bx)
// First, try to fit ln(y) = ln(a) + bx
const lnY = y.map(yi => Math.log(yi));
const lnCorrelation = correlation(x, lnY);
console.log(`\nLog correlation coefficient: ${lnCorrelation.toFixed(4)}`);

// Calculate exponential regression
const bExp = x.reduce((sum, xi, i) => sum + (xi - xMean) * (lnY[i] - mean(lnY)), 0) / 
             x.reduce((sum, xi) => sum + Math.pow(xi - xMean, 2), 0);
const lnA = mean(lnY) - bExp * xMean;
const a = Math.exp(lnA);

const expFunc = x => a * Math.exp(bExp * x);
const expRSquared = rSquared(x, y, expFunc);
console.log(`Exponential function: f(x) = ${a}e^(${bExp}x)`);
console.log(`R-squared for exponential fit: ${expRSquared.toFixed(4)}`);

// 3. Power function: f(x) = ax^b
// Try to fit ln(y) = ln(a) + bln(x)
const lnX = x.map(xi => Math.log(xi));
const lnXMean = mean(lnX);
const lnYMean = mean(lnY);
const bPow = lnX.reduce((sum, xi, i) => sum + (xi - lnXMean) * (lnY[i] - lnYMean), 0) / 
             lnX.reduce((sum, xi) => sum + Math.pow(xi - lnXMean, 2), 0);
const lnAPow = lnYMean - bPow * lnXMean;
const aPow = Math.exp(lnAPow);

const powerFunc = x => aPow * Math.pow(x, bPow);
const powerRSquared = rSquared(x, y, powerFunc);
console.log(`\nPower function: f(x) = ${aPow.toFixed(4)}x^${bPow.toFixed(4)}`);
console.log(`R-squared for power fit: ${powerRSquared.toFixed(4)}`);

// Print summary of best fit
console.log('\nBest fit analysis:');
const fits = [
    { name: 'Linear', rSquared: linearRSquared, func: linearFunc },
    { name: 'Exponential', rSquared: expRSquared, func: expFunc },
    { name: 'Power', rSquared: powerRSquared, func: powerFunc }
];

const bestFit = fits.reduce((best, current) => 
    current.rSquared > best.rSquared ? current : best
);

console.log(`Best fit: ${bestFit.name} function (R-squared = ${bestFit.rSquared.toFixed(4)})`);

// Generate some example predictions
console.log('\nExample predictions:');
const testIndices = [0, 64, 128, 192, 255];
testIndices.forEach(index => {
    const actual = validData.find(d => d.paletteIndex === index)?.value;
    const predicted = bestFit.func(index);
    console.log(`Palette index ${index}:`);
    console.log(`  Actual value: ${actual?.toFixed(2) || 'N/A'}`);
    console.log(`  Predicted value: ${predicted.toFixed(2)}`);
    if (actual) {
        const error = Math.abs(actual - predicted);
        const errorPercent = (error / actual) * 100;
        console.log(`  Error: ${error.toFixed(2)} (${errorPercent.toFixed(2)}%)`);
    }
}); 