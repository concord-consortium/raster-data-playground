# Natural Earth Populated Places Properties

This document describes the properties available in the Natural Earth 10m populated places shapefile. These properties provide detailed information about each populated place in the dataset.

## Core Properties

### Location and Names
- `name`: The primary name of the populated place
- `nameascii`: The name using only ASCII characters
- `namealt`: Alternative name (if any)
- `namepar`: Parent name or alternative name in parentheses (if any)
- `latitude`: The latitude coordinate of the place
- `longitude`: The longitude coordinate of the place

### Population Data
- `pop_max`: Maximum population count
- `pop_min`: Minimum population count
- `pop_other`: Population count of surrounding area
- `rank_max`: Population rank category (maximum), range: 0-14
- `rank_min`: Population rank category (minimum), range: 0-14
- `worldcity`: Boolean flag (0/1) indicating if it's a world city
- `megacity`: Boolean flag (0/1) indicating if it's a mega city
- `meganame`: Name used for the megacity (if applicable)

### Administrative Information
- `adm0name`: Country name
- `adm0_a3`: Three-letter country code
- `adm1name`: First-level administrative division name (e.g., state, province)
- `sov0name`: Sovereign country name
- `sov_a3`: Three-letter sovereign country code
- `iso_a2`: Two-letter ISO country code
- `adm0cap`: Boolean flag (0/1) indicating if it's a country capital
- `capalt`: Boolean flag (0/1) indicating if it's an alternative capital
- `capin`: Capital information (if applicable)

### Display and Classification
- `scalerank`: Importance ranking for cartographic display, range: 0-10 (0 = most important)
- `natscale`: Natural Earth scale ranking, range: 1-600 (higher = more important)
- `labelrank`: Ranking for label display, range: 0-50 (0 = highest priority)
- `featurecla`: Feature class (e.g., "Admin-1 capital")
- `min_zoom`: Minimum zoom level for display, range: 1.7-9.0
- `ls_name`: Landscan name (if applicable)

### Technical Information
- `ne_id`: Natural Earth unique identifier
- `note`: Additional notes (if any)

## Usage Notes

1. Population ranks (`rank_max` and `rank_min`) are categories based on population size:
   - Range: 0-14
   - Higher numbers indicate larger populations
   - Used for determining display prominence

2. Scale-related fields help determine display priority:
   - `scalerank`: 0-10 (0 = most important)
   - `natscale`: 1-600 (higher = more important)
   - `labelrank`: 0-50 (0 = highest priority)
   - `min_zoom`: 1.7-9.0 (when to show the place on a map)

3. Boolean fields (like `adm0cap`, `worldcity`, `megacity`) use:
   - 0 for false
   - 1 for true 