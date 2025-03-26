import shapefile from 'shapefile';
import KDBush from 'kdbush';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createSpatialIndex() {
    try {
        // Read the shapefile
        const source = await shapefile.open(path.join(__dirname, 'ne_10m_populated_places_simple', 'ne_10m_populated_places_simple.shp'));
        
        // Arrays to store coordinates and properties
        const coordinates = [];
        const properties = [];
        
        // Read all features
        let result;
        while ((result = await source.read()).done === false) {
            const feature = result.value;
            
            // Extract point coordinates
            if (feature.geometry.type === 'Point') {
                // Store coordinates in a flat array
                coordinates.push(feature.geometry.coordinates[0]); // longitude
                coordinates.push(feature.geometry.coordinates[1]); // latitude
                
                // Only store selected properties
                properties.push({
                    name: feature.properties.name,
                    iso_a2: feature.properties.iso_a2,
                    adm1name: feature.properties.adm1name,
                    min_zoom: feature.properties.min_zoom
                });
            }
        }
        
        // Create kdbush index with the flat array of coordinates
        const index = new KDBush(coordinates.length / 2, 2);
        
        // Add points to the index
        for (let i = 0; i < coordinates.length; i += 2) {
            index.add(coordinates[i], coordinates[i + 1]);
        }
        
        // Build the index
        index.finish();
        
        // Save the raw index data
        await fs.writeFile(
            path.join(__dirname, 'spatial-index.bin'),
            Buffer.from(index.data)
        );
        
        // Save minimal metadata
        await fs.writeFile(
            path.join(__dirname, 'spatial-index-metadata.json'),
            JSON.stringify({
                coordinates: coordinates,
                properties: properties
            })
        );
        
        console.log(`Successfully created spatial index with ${coordinates.length / 2} points`);
        
    } catch (error) {
        console.error('Error creating spatial index:', error);
    }
}

createSpatialIndex();