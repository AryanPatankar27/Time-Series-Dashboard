import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { availableCities, loadMultipleCities, cityMetadata } from './utils/csvLoader';

const COLORS = {
  water: '#06b6d4',
  vegetation: '#10b981',
  barren: '#f59e0b',
  urban: '#8b5cf6'
};

export default function LandCoverDashboard() {
  const [selectedCities, setSelectedCities] = useState(['mumbai']);
  const [viewMode, setViewMode] = useState('trend');
  const [cityData, setCityData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cities = availableCities;

  // Load all city data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await loadMultipleCities(availableCities);
        setCityData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading city data:', err);
        setError('Failed to load city data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleCity = (city) => {
    // Single city selection only
    setSelectedCities([city]);
  };

  // Calculate average data across selected cities
  const aggregatedData = useMemo(() => {
    if (selectedCities.length === 0 || Object.keys(cityData).length === 0) return [];
    
    const monthData = {};
    selectedCities.forEach(city => {
      if (!cityData[city] || cityData[city].length === 0) return;
      
      cityData[city].forEach(entry => {
        if (!monthData[entry.month]) {
          monthData[entry.month] = { month: entry.month, water: 0, vegetation: 0, barren: 0, urban: 0, count: 0 };
        }
        monthData[entry.month].water += entry.water;
        monthData[entry.month].vegetation += entry.vegetation;
        monthData[entry.month].barren += entry.barren;
        monthData[entry.month].urban += entry.urban;
        monthData[entry.month].count += 1;
      });
    });

    return Object.values(monthData).map(data => ({
      month: data.month,
      water: +(data.water / data.count).toFixed(1),
      vegetation: +(data.vegetation / data.count).toFixed(1),
      barren: +(data.barren / data.count).toFixed(1),
      urban: +(data.urban / data.count).toFixed(1)
    }));
  }, [selectedCities, cityData]);

  // Generate climate predictions based on latest data
  const climatePredictions = useMemo(() => {
    if (selectedCities.length === 0 || Object.keys(cityData).length === 0) return [];
    
    return selectedCities.map(city => {
      if (!cityData[city] || cityData[city].length === 0) {
        return {
          city: city.charAt(0).toUpperCase() + city.slice(1),
          prediction: 'No Data Available',
          severity: 'moderate',
          recommendations: ['Data not loaded yet'],
          metrics: { water: 0, vegetation: 0, barren: 0, urban: 0 }
        };
      }
      
      const latest = cityData[city][cityData[city].length - 1];
      const { water, vegetation, barren, urban } = latest;
      
      let prediction = '';
      let severity = 'moderate';
      let recommendations = [];
      
      // Rule-based predictions
      if (vegetation < 20 && water < 10) {
        prediction = 'Critical Environmental Stress';
        severity = 'critical';
        recommendations = [
          'Urgent need for green space development',
          'Water conservation measures required',
          'Urban heat island mitigation needed'
        ];
      } else if (vegetation < 20) {
        prediction = 'Low Vegetation Alert';
        severity = 'warning';
        recommendations = [
          'Increase tree plantation drives',
          'Develop urban parks and gardens',
          'Implement rooftop greening'
        ];
      } else if (water < 10) {
        prediction = 'Water Scarcity Risk';
        severity = 'warning';
        recommendations = [
          'Enhance water body conservation',
          'Rainwater harvesting initiatives',
          'Wetland restoration projects'
        ];
      } else if (barren > 25) {
        prediction = 'High Barren Land Coverage';
        severity = 'warning';
        recommendations = [
          'Land reclamation projects needed',
          'Convert barren land to green spaces',
          'Soil conservation measures'
        ];
      } else if (urban > 60) {
        prediction = 'High Urbanization Pressure';
        severity = 'warning';
        recommendations = [
          'Sustainable urban planning required',
          'Preserve remaining green corridors',
          'Implement smart city solutions'
        ];
      } else if (vegetation >= 30 && water >= 10) {
        prediction = 'Healthy Environmental Balance';
        severity = 'good';
        recommendations = [
          'Maintain current conservation efforts',
          'Continue monitoring land use changes',
          'Promote sustainable development'
        ];
      } else {
        prediction = 'Moderate Environmental Status';
        severity = 'moderate';
        recommendations = [
          'Monitor vegetation and water levels',
          'Implement preventive measures',
          'Balance urban growth with conservation'
        ];
      }
      
      return {
        city: city.charAt(0).toUpperCase() + city.slice(1),
        prediction,
        severity,
        recommendations,
        metrics: { water, vegetation, barren, urban }
      };
    });
  }, [selectedCities, cityData]);

  // Latest month data for pie chart
  const latestData = useMemo(() => {
    if (aggregatedData.length === 0) return [];
    const latest = aggregatedData[aggregatedData.length - 1];
    return [
      { name: 'Water', value: latest.water, color: COLORS.water },
      { name: 'Vegetation', value: latest.vegetation, color: COLORS.vegetation },
      { name: 'Barren', value: latest.barren, color: COLORS.barren },
      { name: 'Urban', value: latest.urban, color: COLORS.urban }
    ];
  }, [aggregatedData]);

  // Calculate Green Space Index (Water + Vegetation as % of total)
  const greenSpaceIndex = useMemo(() => {
    if (aggregatedData.length === 0) return 0;
    const latest = aggregatedData[aggregatedData.length - 1];
    return +((latest.water + latest.vegetation)).toFixed(1);
  }, [aggregatedData]);

  // Calculate Urban Density (Urban as % of total)
  const urbanDensity = useMemo(() => {
    if (aggregatedData.length === 0) return 0;
    const latest = aggregatedData[aggregatedData.length - 1];
    return +(latest.urban).toFixed(1);
  }, [aggregatedData]);

  // City comparison data (latest month only)
  const cityComparisonData = useMemo(() => {
    return selectedCities.map(city => {
      if (!cityData[city] || cityData[city].length === 0) {
        return {
          city: city.charAt(0).toUpperCase() + city.slice(1),
          water: 0,
          vegetation: 0,
          barren: 0,
          urban: 0
        };
      }
      
      const latest = cityData[city][cityData[city].length - 1];
      return {
        city: city.charAt(0).toUpperCase() + city.slice(1),
        water: latest.water,
        vegetation: latest.vegetation,
        barren: latest.barren,
        urban: latest.urban
      };
    });
  }, [selectedCities, cityData]);

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#f1f5f9',
        fontFamily: '"DM Sans", sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '3rem' }}>🌍</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Loading city data...</h2>
        <p style={{ color: '#94a3b8' }}>Please wait while we fetch the latest land cover information</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#f1f5f9',
        fontFamily: '"DM Sans", sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem'
      }}>
        <div style={{ fontSize: '3rem' }}>⚠️</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ef4444' }}>Error Loading Data</h2>
        <p style={{ color: '#94a3b8', textAlign: 'center', maxWidth: '500px' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 2rem',
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#f1f5f9',
      fontFamily: '"DM Sans", sans-serif',
      padding: '2rem'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Orbitron:wght@600;800&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        .city-pill {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .city-pill:hover {
          transform: translateY(-2px);
        }
        
        .card {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }
        
        .card:hover {
          border-color: rgba(148, 163, 184, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .stat-box {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
          border-left: 4px solid;
          padding: 1rem;
          border-radius: 8px;
          transition: transform 0.2s;
        }
        
        .stat-box:hover {
          transform: scale(1.02);
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: '"Orbitron", sans-serif',
          fontSize: '3.5rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #06b6d4, #8b5cf6, #10b981)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em'
        }}>
          Land Cover Analytics
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
          Real-time monitoring across {cities.length} major Indian cities
        </p>
      </div>

      {/* City Filters */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
            🏙️ Select Cities
          </h3>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            Select one city to analyze
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {cities.map(city => (
            <button
              key={city}
              onClick={() => toggleCity(city)}
              className="city-pill"
              style={{
                padding: '0.75rem 1.5rem',
                background: selectedCities.includes(city) 
                  ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' 
                  : 'rgba(51, 65, 85, 0.5)',
                border: selectedCities.includes(city) ? 'none' : '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '50px',
                color: selectedCities.includes(city) ? '#fff' : '#cbd5e1',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: selectedCities.includes(city) ? '600' : '500',
                textTransform: 'capitalize',
                boxShadow: selectedCities.includes(city) ? '0 4px 12px rgba(6, 182, 212, 0.3)' : 'none'
              }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {selectedCities.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌍</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Cities Selected</h3>
          <p style={{ color: '#94a3b8' }}>Please select at least one city to view the analytics</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {latestData.map(item => (
              <div
                key={item.name}
                className="stat-box"
                style={{ borderLeftColor: item.color }}
              >
                <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                  {item.name} Coverage
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: item.color }}>
                  {item.value}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Latest Month Average
                </div>
              </div>
            ))}
            
            {/* Green Space Index */}
            <div
              className="stat-box"
              style={{ borderLeftColor: '#22d3ee' }}
            >
              <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                🌿 Green Space Index
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#22d3ee' }}>
                {greenSpaceIndex}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                Water + Vegetation
              </div>
            </div>

            {/* Urban Density */}
            <div
              className="stat-box"
              style={{ borderLeftColor: '#f97316' }}
            >
              <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                🏙️ Urban Density
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f97316' }}>
                {urbanDensity}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                Urbanization Level
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['trend', 'comparison', 'distribution', 'predictions'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '0.75rem 2rem',
                  background: viewMode === mode 
                    ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' 
                    : 'rgba(51, 65, 85, 0.5)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  boxShadow: viewMode === mode ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {mode === 'trend' && '📈'} {mode === 'comparison' && '📊'} {mode === 'distribution' && '🥧'} {mode === 'predictions' && '🔮'} {mode}
              </button>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'trend' ? '1fr' : 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
            {viewMode === 'trend' && (
              <>
                <div className="card">
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                    📊 12-Month Land Cover Composition
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Stacked view showing how land types change over time. Each color represents a different land cover type.
                  </p>
                  <ResponsiveContainer width="100%" height={450}>
                    <AreaChart data={aggregatedData}>
                      <defs>
                        <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.water} stopOpacity={0.9}/>
                          <stop offset="95%" stopColor={COLORS.water} stopOpacity={0.7}/>
                        </linearGradient>
                        <linearGradient id="colorVegetation" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.vegetation} stopOpacity={0.9}/>
                          <stop offset="95%" stopColor={COLORS.vegetation} stopOpacity={0.7}/>
                        </linearGradient>
                        <linearGradient id="colorBarren" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.barren} stopOpacity={0.9}/>
                          <stop offset="95%" stopColor={COLORS.barren} stopOpacity={0.7}/>
                        </linearGradient>
                        <linearGradient id="colorUrban" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.urban} stopOpacity={0.9}/>
                          <stop offset="95%" stopColor={COLORS.urban} stopOpacity={0.7}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#94a3b8" 
                        style={{ fontSize: '0.875rem' }}
                      />
                      <YAxis 
                        stroke="#94a3b8"
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                        style={{ fontSize: '0.875rem' }}
                      />
                      <Tooltip 
                        formatter={(value) => `${value.toFixed(1)}%`}
                        contentStyle={{ 
                          background: 'rgba(15, 23, 42, 0.95)', 
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '8px',
                          color: '#f1f5f9',
                          fontSize: '0.875rem'
                        }} 
                      />
                      <Legend 
                        verticalAlign="top" 
                        height={36}
                        iconType="square"
                        wrapperStyle={{ fontSize: '0.9rem', fontWeight: '500' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="urban" 
                        stackId="1" 
                        stroke={COLORS.urban} 
                        fill="url(#colorUrban)"
                        name="🏙️ Urban"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="barren" 
                        stackId="1" 
                        stroke={COLORS.barren} 
                        fill="url(#colorBarren)"
                        name="🏜️ Barren"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="vegetation" 
                        stackId="1" 
                        stroke={COLORS.vegetation} 
                        fill="url(#colorVegetation)"
                        name="🌳 Vegetation"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="water" 
                        stackId="1" 
                        stroke={COLORS.water} 
                        fill="url(#colorWater)"
                        name="💧 Water"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                    📈 Trend Lines (Actual Percentages)
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Track individual land cover percentages across all months. Hover to see exact values.
                  </p>
                  <ResponsiveContainer width="100%" height={450}>
                    <LineChart data={aggregatedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#94a3b8"
                        style={{ fontSize: '0.875rem' }}
                      />
                      <YAxis 
                        stroke="#94a3b8"
                        label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                        style={{ fontSize: '0.875rem' }}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        formatter={(value) => `${value.toFixed(2)}%`}
                        contentStyle={{ 
                          background: 'rgba(15, 23, 42, 0.95)', 
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '8px',
                          color: '#f1f5f9',
                          fontSize: '0.875rem'
                        }} 
                      />
                      <Legend 
                        verticalAlign="top" 
                        height={36}
                        iconType="line"
                        wrapperStyle={{ fontSize: '0.9rem', fontWeight: '500' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="water" 
                        stroke={COLORS.water} 
                        strokeWidth={3} 
                        dot={{ r: 5, strokeWidth: 2 }}
                        activeDot={{ r: 7 }}
                        name="💧 Water"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="vegetation" 
                        stroke={COLORS.vegetation} 
                        strokeWidth={3} 
                        dot={{ r: 5, strokeWidth: 2 }}
                        activeDot={{ r: 7 }}
                        name="🌳 Vegetation"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="barren" 
                        stroke={COLORS.barren} 
                        strokeWidth={3} 
                        dot={{ r: 5, strokeWidth: 2 }}
                        activeDot={{ r: 7 }}
                        name="🏜️ Barren"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="urban" 
                        stroke={COLORS.urban} 
                        strokeWidth={3} 
                        dot={{ r: 5, strokeWidth: 2 }}
                        activeDot={{ r: 7 }}
                        name="🏙️ Urban"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {viewMode === 'comparison' && (
              <div className="card">
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                  📊 City-wise Comparison (Latest Month)
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={cityComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis dataKey="city" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '8px',
                        color: '#f1f5f9'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="water" fill={COLORS.water} radius={[8, 8, 0, 0]} />
                    <Bar dataKey="vegetation" fill={COLORS.vegetation} radius={[8, 8, 0, 0]} />
                    <Bar dataKey="barren" fill={COLORS.barren} radius={[8, 8, 0, 0]} />
                    <Bar dataKey="urban" fill={COLORS.urban} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {viewMode === 'distribution' && (
              <>
                <div className="card">
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                    🥧 Current Distribution (Latest Month)
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={latestData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, value}) => `${name}: ${value}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {latestData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          background: 'rgba(15, 23, 42, 0.95)', 
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '8px',
                          color: '#f1f5f9'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                    📈 Monthly Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={aggregatedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'rgba(15, 23, 42, 0.95)', 
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '8px',
                          color: '#f1f5f9'
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="water" stroke={COLORS.water} strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="vegetation" stroke={COLORS.vegetation} strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="barren" stroke={COLORS.barren} strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="urban" stroke={COLORS.urban} strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {viewMode === 'predictions' && (
              <div className="card" style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                  🔮 Climate & Environmental Predictions
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>
                  Rule-based predictions based on current land cover metrics. Analysis considers vegetation, water, and barren land coverage.
                </p>
                
                {climatePredictions.map((pred, idx) => {
                  const severityColors = {
                    critical: { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444', text: '#ef4444' },
                    warning: { bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', text: '#f59e0b' },
                    moderate: { bg: 'rgba(59, 130, 246, 0.1)', border: '#3b82f6', text: '#3b82f6' },
                    good: { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', text: '#10b981' }
                  };
                  
                  const colors = severityColors[pred.severity];
                  
                  return (
                    <div 
                      key={idx}
                      style={{
                        background: colors.bg,
                        border: `2px solid ${colors.border}`,
                        borderRadius: '12px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: colors.text, marginBottom: '0.5rem' }}>
                            {pred.city}
                          </h4>
                          <div style={{ fontSize: '1.1rem', fontWeight: '500', color: '#f1f5f9' }}>
                            {pred.prediction}
                          </div>
                        </div>
                        <div style={{
                          padding: '0.5rem 1rem',
                          background: colors.border,
                          borderRadius: '20px',
                          color: '#fff',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {pred.severity}
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(6, 182, 212, 0.2)', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Water</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: COLORS.water }}>{pred.metrics.water}%</div>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Vegetation</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: COLORS.vegetation }}>{pred.metrics.vegetation}%</div>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Barren</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: COLORS.barren }}>{pred.metrics.barren}%</div>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Urban</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: COLORS.urban }}>{pred.metrics.urban}%</div>
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.75rem' }}>
                          📋 Recommendations:
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#cbd5e1' }}>
                          {pred.recommendations.map((rec, i) => (
                            <li key={i} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              📋 Summary Statistics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Cities Analyzed</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: COLORS.water }}>{selectedCities.length}</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Time Period</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: COLORS.vegetation }}>12 Months</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Data Points</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: COLORS.barren }}>{selectedCities.length * 12}</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Last Updated</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: COLORS.urban }}>Latest</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}