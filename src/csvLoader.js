import Papa from 'papaparse';

// List of available cities - matches your CSV file names
export const availableCities = [
  'ahmedabad',
  'bangalore',
  'bhopal',
  'chennai',
  'delhi',
  'hyderabad',
  'jaipur',
  'jammu',
  'kanpur',
  'kolkata',
  'lucknow',
  'mumbai',
  'nagpur',
  'nashik',
  'patna',
  'pune',
  'ranchi'
];

// Metadata about each city (you can expand this)
export const cityMetadata = {
  ahmedabad: { name: 'Ahmedabad', state: 'Gujarat' },
  bangalore: { name: 'Bangalore', state: 'Karnataka' },
  bhopal: { name: 'Bhopal', state: 'Madhya Pradesh' },
  chennai: { name: 'Chennai', state: 'Tamil Nadu' },
  delhi: { name: 'Delhi', state: 'Delhi' },
  hyderabad: { name: 'Hyderabad', state: 'Telangana' },
  jaipur: { name: 'Jaipur', state: 'Rajasthan' },
  jammu: { name: 'Jammu', state: 'Jammu & Kashmir' },
  kanpur: { name: 'Kanpur', state: 'Uttar Pradesh' },
  kolkata: { name: 'Kolkata', state: 'West Bengal' },
  lucknow: { name: 'Lucknow', state: 'Uttar Pradesh' },
  mumbai: { name: 'Mumbai', state: 'Maharashtra' },
  nagpur: { name: 'Nagpur', state: 'Maharashtra' },
  nashik: { name: 'Nashik', state: 'Maharashtra' },
  patna: { name: 'Patna', state: 'Bihar' },
  pune: { name: 'Pune', state: 'Maharashtra' },
  ranchi: { name: 'Ranchi', state: 'Jharkhand' }
};

/**
 * Load CSV data for a single city
 * @param {string} cityName - Name of the city (lowercase)
 * @returns {Promise<Array>} Parsed city data
 */
export const loadCityData = async (cityName) => {
  try {
    // Construct the file path based on your structure
    const filePath = `/city-wise-data/${cityName}_land_cover.csv`;
    
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load ${cityName} data: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn(`Parsing warnings for ${cityName}:`, results.errors);
          }
          
          // Transform the data to match your expected format
          const transformedData = results.data.map(row => ({
            month: row.month || row.Month || row.DATE || row.date,
            water: parseFloat(row.water || row.Water || 0),
            vegetation: parseFloat(row.vegetation || row.Vegetation || 0),
            barren: parseFloat(row.barren || row.Barren || row['barren land'] || 0),
            urban: parseFloat(row.urban || row.Urban || row['built-up'] || 0)
          }));
          
          resolve(transformedData);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error(`Error loading ${cityName} data:`, error);
    throw error;
  }
};

/**
 * Load CSV data for multiple cities
 * @param {Array<string>} cityNames - Array of city names
 * @returns {Promise<Object>} Object with city names as keys and data arrays as values
 */
export const loadMultipleCities = async (cityNames) => {
  const promises = cityNames.map(async (city) => {
    try {
      const data = await loadCityData(city);
      return { city, data };
    } catch (error) {
      console.error(`Failed to load data for ${city}:`, error);
      return { city, data: [] };
    }
  });
  
  const results = await Promise.all(promises);
  
  // Convert array of {city, data} to object with city keys
  const cityDataObject = {};
  results.forEach(({ city, data }) => {
    cityDataObject[city] = data;
  });
  
  return cityDataObject;
};

/**
 * Load all available cities
 * @returns {Promise<Object>} Object with all city data
 */
export const loadAllCities = async () => {
  return await loadMultipleCities(availableCities);
};