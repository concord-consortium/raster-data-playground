import fs from 'fs';

// Read the CSV file
const csvContent = fs.readFileSync('GPM_3IMERGM_2025-02-01_rgb_360x180.CSV', 'utf-8');

// Split the content into lines and then into values
const values = csvContent
    .split('\n')
    .flatMap(line => line.split(','))
    .map(value => parseFloat(value.trim()));

// Find unique values
const uniqueValues = [...new Set(values)].sort((a, b) => a - b);

// Create CSV content
const csvOutput = uniqueValues
    .map((value, index) => `${index},${value}`)
    .join('\n');

// Write to file
fs.writeFileSync('value_mapping.csv', csvOutput);

// Print results
console.log('Unique values found:');
console.log(uniqueValues);
console.log(`\nTotal number of unique values: ${uniqueValues.length}`);
console.log('\nMapping has been saved to value_mapping.csv'); 