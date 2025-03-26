import shapefile from 'shapefile';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function examineProperties() {
    try {
        const source = await shapefile.open(path.join(__dirname, 'ne_10m_populated_places_simple', 'ne_10m_populated_places_simple.shp'));
        
        // Initialize ranges
        const ranges = {
            scalerank: { min: Infinity, max: -Infinity },
            natscale: { min: Infinity, max: -Infinity },
            labelrank: { min: Infinity, max: -Infinity },
            min_zoom: { min: Infinity, max: -Infinity },
            rank_max: { min: Infinity, max: -Infinity },
            rank_min: { min: Infinity, max: -Infinity }
        };
        
        // Read all features
        let result;
        while ((result = await source.read()).done === false) {
            const props = result.value.properties;
            
            // Update ranges for each property
            for (const [key, range] of Object.entries(ranges)) {
                if (props[key] !== null && props[key] !== undefined) {
                    range.min = Math.min(range.min, props[key]);
                    range.max = Math.max(range.max, props[key]);
                }
            }
        }
        
        console.log('Property ranges:');
        console.log(JSON.stringify(ranges, null, 2));
        
    } catch (error) {
        console.error('Error examining properties:', error);
    }
}

examineProperties(); 