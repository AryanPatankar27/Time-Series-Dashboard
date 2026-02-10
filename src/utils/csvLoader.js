import Papa from 'papaparse';

// City metadata
export const cityMetadata = {
  mumbai: { climate: 'Tropical', monsoon: 'Southwest', region: 'Western Coast', rainfall: 'Very High' },
  pune: { climate: 'Semi-Arid', monsoon: 'Southwest', region: 'Western Plateau', rainfall: 'Moderate' },
  bangalore: { climate: 'Tropical Savanna', monsoon: 'Southwest', region: 'Southern Plateau', rainfall: 'Moderate' },
  chennai: { climate: 'Tropical Wet-Dry', monsoon: 'Northeast', region: 'Eastern Coast', rainfall: 'Moderate' },
  delhi: { climate: 'Humid Subtropical', monsoon: 'Southwest', region: 'Northern Plains', rainfall: 'Moderate' },
  kolkata: { climate: 'Tropical Wet', monsoon: 'Southwest', region: 'Eastern Plains', rainfall: 'Very High' },
  hyderabad: { climate: 'Semi-Arid', monsoon: 'Southwest', region: 'Deccan Plateau', rainfall: 'Moderate' },
  ahmedabad: { climate: 'Semi-Arid', monsoon: 'Southwest', region: 'Western Plains', rainfall: 'Low' },
  jaipur: { climate: 'Semi-Arid', monsoon: 'Southwest', region: 'Northwestern Plains', rainfall: 'Low' },
  lucknow: { climate: 'Humid Subtropical', monsoon: 'Southwest', region: 'Central Plains', rainfall: 'Moderate' },
  kanpur: { climate: 'Humid Subtropical', monsoon: 'Southwest', region: 'Central Plains', rainfall: 'Moderate' },
  bhopal: { climate: 'Humid Subtropical', monsoon: 'Southwest', region: 'Central Plateau', rainfall: 'High' },
  patna: { climate: 'Humid Subtropical', monsoon: 'Southwest', region: 'Eastern Plains', rainfall: 'High' },
  nagpur: { climate: 'Tropical Wet-Dry', monsoon: 'Southwest', region: 'Central India', rainfall: 'Moderate' },
  ranchi: { climate: 'Humid Subtropical', monsoon: 'Southwest', region: 'Chota Nagpur Plateau', rainfall: 'High' },
  jammu: { climate: 'Humid Subtropical', monsoon: 'Southwest', region: 'Himalayan Foothills', rainfall: 'High' },
  nashik: { climate: 'Semi-Arid', monsoon: 'Southwest', region: 'Western Plateau', rainfall: 'Moderate' }
};

// Available cities based on CSV files
export const availableCities = [
  'mumbai', 'pune', 'bangalore', 'chennai', 'delhi', 
  'kolkata', 'ahmedabad', 'lucknow', 'kanpur', 
  'bhopal', 'patna', 'nagpur', 'ranchi', 'jammu'
];

// Format month from CSV format (2025_Feb) to display format (Feb'25)
const formatMonth = (monthStr) => {
  const [year, month] = monthStr.split('_');
  const shortYear = year.slice(2);
  return `${month}'${shortYear}`;
};

// Load CSV data for a specific city
export const loadCityData = async (cityName) => {
  try {
    // Handle nagpur special case (file is named nagpur_land_cover-2.csv)
    const fileName = cityName === 'nagpur' 
      ? 'nagpur_land_cover-2.csv' 
      : `${cityName}_land_cover.csv`;
    
    const response = await fetch(`/city-wise-data/${fileName}`);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const formattedData = results.data.map(row => ({
            month: formatMonth(row.Month),
            water: parseFloat(row.Water_pct) || 0,
            vegetation: parseFloat(row.Vegetation_pct) || 0,
            barren: parseFloat(row.Barren_pct) || 0,
            urban: parseFloat(row.Urban_pct) || 0
          }));
          resolve(formattedData);
        },
        error: (error) => {
          console.error(`Error parsing CSV for ${cityName}:`, error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error(`Error loading CSV for ${cityName}:`, error);
    throw error;
  }
};

// Load data for multiple cities
export const loadMultipleCities = async (cityNames) => {
  const promises = cityNames.map(city => 
    loadCityData(city).catch(err => {
      console.error(`Failed to load ${city}:`, err);
      return [];
    })
  );
  
  const results = await Promise.all(promises);
  const cityData = {};
  
  cityNames.forEach((city, index) => {
    cityData[city] = results[index];
  });
  
  return cityData;
};
