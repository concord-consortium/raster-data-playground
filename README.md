# Raster Data Playground

This project contains various scripts for processing and analyzing spatial and raster data, particularly focused on Natural Earth data and color mapping for raster images.

## Project Structure

### Spatial Indexing
- `create-index.js`: Creates a spatial index from Natural Earth populated places data using the kdbush library
  - Processes shapefile data from `ne_10m_populated_places_simple`
  - Generates a binary spatial index (`spatial-index.bin`) and metadata (`spatial-index-metadata.json`)
  - Includes properties like city name, country code, admin region, and minimum zoom level

### Raster Data Processing
- `create_color_mapping.js`: Creates a mapping between color indices and data values from raster images
  - Processes PNG files with indexed color palettes
  - Matches colors with corresponding CSV data values
  - Generates `color_mapping.csv` with palette indices and their corresponding values
  - Includes validation to ensure accurate color-to-value mapping

### Analysis Tools
- `analyze_value_function.js`: Analyzes value functions in the data
- `check_png_palette.js`: Validates PNG palette information
- `find_unique_values.js`: Identifies unique values in the dataset
- `examine-properties.js`: Examines properties of the spatial data

## Data Files
- `spatial-index.bin`: Binary spatial index for quick point lookups
- `spatial-index-metadata.json`: Metadata for the spatial index
- `color_mapping.csv`: Mapping between color indices and data values
- `value_mapping.csv`: Mapping of data values
- `GPM_3IMERGM_2025-02-01_rgb_360x180.png`: Sample raster image
- `GPM_3IMERGM_2025-02-01_rgb_360x180.CSV`: Corresponding data values

## Notes
- The spatial index metadata is compressed (163KB gzipped)
- Coordinates could potentially be reduced in resolution for further optimization
- The min_zoom level can be used to identify appropriate cities based on map zoom level
- Data is stored in columns to minimize redundancy in key names

## Dependencies
- Node.js
- kdbush: For spatial indexing
- shapefile: For processing shapefile data
- pngjs: For PNG image processing
