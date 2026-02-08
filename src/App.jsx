import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

// City metadata
const cityMetadata = {
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

// All city data embedded
const cityData = {
  mumbai: [
    { month: "Feb'25", water: 8.5, vegetation: 18.2, barren: 8.3, urban: 65.0 },
    { month: "Mar'25", water: 7.8, vegetation: 16.5, barren: 9.2, urban: 66.5 },
    { month: "Apr'25", water: 7.2, vegetation: 14.8, barren: 10.5, urban: 67.5 },
    { month: "May'25", water: 6.8, vegetation: 13.2, barren: 11.8, urban: 68.2 },
    { month: "Jun'25", water: 12.5, vegetation: 22.5, barren: 7.2, urban: 57.8 },
    { month: "Jul'25", water: 15.8, vegetation: 28.4, barren: 5.3, urban: 50.5 },
    { month: "Aug'25", water: 16.2, vegetation: 29.8, barren: 4.8, urban: 49.2 },
    { month: "Sep'25", water: 14.5, vegetation: 27.3, barren: 6.0, urban: 52.2 },
    { month: "Oct'25", water: 11.8, vegetation: 23.6, barren: 7.8, urban: 56.8 },
    { month: "Nov'25", water: 10.2, vegetation: 20.8, barren: 8.5, urban: 60.5 },
    { month: "Dec'25", water: 9.3, vegetation: 19.4, barren: 8.8, urban: 62.5 },
    { month: "Jan'26", water: 8.8, vegetation: 18.7, barren: 8.5, urban: 64.0 }
  ],
  pune: [
    { month: "Feb'25", water: 4.2, vegetation: 22.5, barren: 15.8, urban: 57.5 },
    { month: "Mar'25", water: 3.8, vegetation: 20.3, barren: 17.2, urban: 58.7 },
    { month: "Apr'25", water: 3.2, vegetation: 17.8, barren: 19.5, urban: 59.5 },
    { month: "May'25", water: 2.8, vegetation: 15.2, barren: 21.8, urban: 60.2 },
    { month: "Jun'25", water: 8.5, vegetation: 28.6, barren: 12.4, urban: 50.5 },
    { month: "Jul'25", water: 11.2, vegetation: 35.8, barren: 8.5, urban: 44.5 },
    { month: "Aug'25", water: 12.5, vegetation: 37.2, barren: 7.8, urban: 42.5 },
    { month: "Sep'25", water: 10.8, vegetation: 33.5, barren: 9.2, urban: 46.5 },
    { month: "Oct'25", water: 7.5, vegetation: 28.4, barren: 11.8, urban: 52.3 },
    { month: "Nov'25", water: 5.8, vegetation: 25.6, barren: 13.5, urban: 55.1 },
    { month: "Dec'25", water: 4.8, vegetation: 23.8, barren: 14.7, urban: 56.7 },
    { month: "Jan'26", water: 4.5, vegetation: 23.1, barren: 15.2, urban: 57.2 }
  ],
  bangalore: [
    { month: "Feb'25", water: 6.5, vegetation: 32.8, barren: 12.2, urban: 48.5 },
    { month: "Mar'25", water: 5.8, vegetation: 30.2, barren: 14.5, urban: 49.5 },
    { month: "Apr'25", water: 5.2, vegetation: 27.5, barren: 16.8, urban: 50.5 },
    { month: "May'25", water: 4.5, vegetation: 24.8, barren: 19.2, urban: 51.5 },
    { month: "Jun'25", water: 8.2, vegetation: 35.5, barren: 11.8, urban: 44.5 },
    { month: "Jul'25", water: 9.8, vegetation: 38.2, barren: 9.5, urban: 42.5 },
    { month: "Aug'25", water: 10.5, vegetation: 39.8, barren: 8.7, urban: 41.0 },
    { month: "Sep'25", water: 9.5, vegetation: 37.5, barren: 10.2, urban: 42.8 },
    { month: "Oct'25", water: 8.8, vegetation: 36.2, barren: 11.5, urban: 43.5 },
    { month: "Nov'25", water: 7.8, vegetation: 34.5, barren: 12.8, urban: 44.9 },
    { month: "Dec'25", water: 7.2, vegetation: 33.6, barren: 12.5, urban: 46.7 },
    { month: "Jan'26", water: 6.8, vegetation: 33.0, barren: 12.3, urban: 47.9 }
  ],
  chennai: [
    { month: "Feb'25", water: 7.8, vegetation: 18.5, barren: 14.2, urban: 59.5 },
    { month: "Mar'25", water: 7.2, vegetation: 16.8, barren: 16.5, urban: 59.5 },
    { month: "Apr'25", water: 6.5, vegetation: 14.5, barren: 18.8, urban: 60.2 },
    { month: "May'25", water: 5.8, vegetation: 12.8, barren: 21.2, urban: 60.2 },
    { month: "Jun'25", water: 7.5, vegetation: 16.5, barren: 17.5, urban: 58.5 },
    { month: "Jul'25", water: 8.2, vegetation: 18.2, barren: 15.8, urban: 57.8 },
    { month: "Aug'25", water: 8.8, vegetation: 19.5, barren: 14.5, urban: 57.2 },
    { month: "Sep'25", water: 9.5, vegetation: 20.8, barren: 13.2, urban: 56.5 },
    { month: "Oct'25", water: 11.5, vegetation: 24.5, barren: 11.5, urban: 52.5 },
    { month: "Nov'25", water: 13.2, vegetation: 26.8, barren: 9.8, urban: 50.2 },
    { month: "Dec'25", water: 11.8, vegetation: 24.2, barren: 11.5, urban: 52.5 },
    { month: "Jan'26", water: 9.5, vegetation: 21.5, barren: 13.2, urban: 55.8 }
  ],
  delhi: [
    { month: "Feb'25", water: 3.5, vegetation: 22.5, barren: 18.5, urban: 55.5 },
    { month: "Mar'25", water: 3.2, vegetation: 21.2, barren: 20.8, urban: 54.8 },
    { month: "Apr'25", water: 2.8, vegetation: 18.5, barren: 23.5, urban: 55.2 },
    { month: "May'25", water: 2.5, vegetation: 15.8, barren: 26.2, urban: 55.5 },
    { month: "Jun'25", water: 3.8, vegetation: 19.5, barren: 22.2, urban: 54.5 },
    { month: "Jul'25", water: 6.5, vegetation: 28.5, barren: 15.5, urban: 49.5 },
    { month: "Aug'25", water: 7.8, vegetation: 32.2, barren: 12.8, urban: 47.2 },
    { month: "Sep'25", water: 6.8, vegetation: 29.5, barren: 14.5, urban: 49.2 },
    { month: "Oct'25", water: 5.2, vegetation: 26.8, barren: 16.8, urban: 51.2 },
    { month: "Nov'25", water: 4.5, vegetation: 25.2, barren: 18.5, urban: 51.8 },
    { month: "Dec'25", water: 4.0, vegetation: 24.0, barren: 19.2, urban: 52.8 },
    { month: "Jan'26", water: 3.8, vegetation: 23.2, barren: 18.8, urban: 54.2 }
  ],
  kolkata: [
    { month: "Feb'25", water: 12.5, vegetation: 28.5, barren: 10.5, urban: 48.5 },
    { month: "Mar'25", water: 11.8, vegetation: 26.8, barren: 12.2, urban: 49.2 },
    { month: "Apr'25", water: 10.5, vegetation: 24.5, barren: 14.5, urban: 50.5 },
    { month: "May'25", water: 9.8, vegetation: 22.8, barren: 16.8, urban: 50.6 },
    { month: "Jun'25", water: 15.5, vegetation: 32.5, barren: 9.5, urban: 42.5 },
    { month: "Jul'25", water: 18.2, vegetation: 36.8, barren: 7.2, urban: 37.8 },
    { month: "Aug'25", water: 19.5, vegetation: 38.5, barren: 6.5, urban: 35.5 },
    { month: "Sep'25", water: 17.8, vegetation: 36.2, barren: 8.2, urban: 37.8 },
    { month: "Oct'25", water: 15.5, vegetation: 33.5, barren: 10.2, urban: 40.8 },
    { month: "Nov'25", water: 14.2, vegetation: 31.8, barren: 11.5, urban: 42.5 },
    { month: "Dec'25", water: 13.5, vegetation: 30.5, barren: 11.2, urban: 44.8 },
    { month: "Jan'26", water: 12.8, vegetation: 29.2, barren: 10.8, urban: 47.2 }
  ],
  hyderabad: [
    { month: "Feb'25", water: 5.8, vegetation: 24.5, barren: 16.2, urban: 53.5 },
    { month: "Mar'25", water: 5.2, vegetation: 22.8, barren: 18.5, urban: 53.5 },
    { month: "Apr'25", water: 4.5, vegetation: 20.5, barren: 21.2, urban: 53.8 },
    { month: "May'25", water: 3.8, vegetation: 18.2, barren: 24.5, urban: 53.5 },
    { month: "Jun'25", water: 6.5, vegetation: 26.5, barren: 18.5, urban: 48.5 },
    { month: "Jul'25", water: 9.2, vegetation: 32.8, barren: 13.5, urban: 44.5 },
    { month: "Aug'25", water: 10.5, vegetation: 35.2, barren: 11.8, urban: 42.5 },
    { month: "Sep'25", water: 9.5, vegetation: 33.5, barren: 13.2, urban: 43.8 },
    { month: "Oct'25", water: 8.2, vegetation: 30.8, barren: 15.5, urban: 45.5 },
    { month: "Nov'25", water: 7.2, vegetation: 28.5, barren: 16.8, urban: 47.5 },
    { month: "Dec'25", water: 6.5, vegetation: 26.8, barren: 17.2, urban: 49.5 },
    { month: "Jan'26", water: 6.0, vegetation: 25.5, barren: 16.8, urban: 51.7 }
  ],
  ahmedabad: [
    { month: "Feb'25", water: 3.2, vegetation: 16.5, barren: 22.8, urban: 57.5 },
    { month: "Mar'25", water: 2.8, vegetation: 14.8, barren: 25.2, urban: 57.2 },
    { month: "Apr'25", water: 2.5, vegetation: 12.5, barren: 28.5, urban: 56.5 },
    { month: "May'25", water: 2.2, vegetation: 10.8, barren: 31.5, urban: 55.5 },
    { month: "Jun'25", water: 4.5, vegetation: 15.8, barren: 26.2, urban: 53.5 },
    { month: "Jul'25", water: 7.8, vegetation: 24.5, barren: 19.2, urban: 48.5 },
    { month: "Aug'25", water: 9.2, vegetation: 28.8, barren: 16.5, urban: 45.5 },
    { month: "Sep'25", water: 7.5, vegetation: 26.5, barren: 18.5, urban: 47.5 },
    { month: "Oct'25", water: 5.5, vegetation: 22.5, barren: 21.2, urban: 50.8 },
    { month: "Nov'25", water: 4.5, vegetation: 19.8, barren: 23.5, urban: 52.2 },
    { month: "Dec'25", water: 3.8, vegetation: 18.2, barren: 24.2, urban: 53.8 },
    { month: "Jan'26", water: 3.5, vegetation: 17.5, barren: 23.5, urban: 55.5 }
  ],
  jaipur: [
    { month: "Feb'25", water: 2.8, vegetation: 14.5, barren: 27.2, urban: 55.5 },
    { month: "Mar'25", water: 2.5, vegetation: 12.8, barren: 30.2, urban: 54.5 },
    { month: "Apr'25", water: 2.2, vegetation: 10.5, barren: 33.8, urban: 53.5 },
    { month: "May'25", water: 1.8, vegetation: 8.5, barren: 37.2, urban: 52.5 },
    { month: "Jun'25", water: 3.2, vegetation: 12.8, barren: 32.5, urban: 51.5 },
    { month: "Jul'25", water: 6.5, vegetation: 22.5, barren: 24.5, urban: 46.5 },
    { month: "Aug'25", water: 8.2, vegetation: 28.8, barren: 20.5, urban: 42.5 },
    { month: "Sep'25", water: 6.8, vegetation: 26.5, barren: 23.2, urban: 43.5 },
    { month: "Oct'25", water: 4.8, vegetation: 21.8, barren: 27.2, urban: 46.2 },
    { month: "Nov'25", water: 3.8, vegetation: 18.5, barren: 29.5, urban: 48.2 },
    { month: "Dec'25", water: 3.2, vegetation: 16.5, barren: 29.8, urban: 50.5 },
    { month: "Jan'26", water: 3.0, vegetation: 15.2, barren: 28.5, urban: 53.3 }
  ],
  lucknow: [
    { month: "Feb'25", water: 4.5, vegetation: 26.5, barren: 16.5, urban: 52.5 },
    { month: "Mar'25", water: 4.0, vegetation: 24.8, barren: 18.8, urban: 52.4 },
    { month: "Apr'25", water: 3.5, vegetation: 22.5, barren: 21.5, urban: 52.5 },
    { month: "May'25", water: 3.0, vegetation: 19.8, barren: 24.8, urban: 52.4 },
    { month: "Jun'25", water: 5.5, vegetation: 25.5, barren: 20.5, urban: 48.5 },
    { month: "Jul'25", water: 8.5, vegetation: 33.5, barren: 14.5, urban: 43.5 },
    { month: "Aug'25", water: 10.2, vegetation: 36.8, barren: 12.5, urban: 40.5 },
    { month: "Sep'25", water: 8.8, vegetation: 34.5, barren: 14.2, urban: 42.5 },
    { month: "Oct'25", water: 6.8, vegetation: 31.2, barren: 16.5, urban: 45.5 },
    { month: "Nov'25", water: 5.8, vegetation: 29.5, barren: 17.8, urban: 46.9 },
    { month: "Dec'25", water: 5.2, vegetation: 28.2, barren: 17.5, urban: 49.1 },
    { month: "Jan'26", water: 4.8, vegetation: 27.5, barren: 17.2, urban: 50.5 }
  ],
  kanpur: [
    { month: "Feb'25", water: 5.2, vegetation: 24.8, barren: 18.5, urban: 51.5 },
    { month: "Mar'25", water: 4.8, vegetation: 23.2, barren: 20.5, urban: 51.5 },
    { month: "Apr'25", water: 4.2, vegetation: 21.5, barren: 22.8, urban: 51.5 },
    { month: "May'25", water: 3.8, vegetation: 19.2, barren: 25.5, urban: 51.5 },
    { month: "Jun'25", water: 6.5, vegetation: 24.5, barren: 21.5, urban: 47.5 },
    { month: "Jul'25", water: 9.5, vegetation: 32.5, barren: 16.5, urban: 41.5 },
    { month: "Aug'25", water: 11.2, vegetation: 35.8, barren: 14.5, urban: 38.5 },
    { month: "Sep'25", water: 9.8, vegetation: 33.5, barren: 16.2, urban: 40.5 },
    { month: "Oct'25", water: 7.5, vegetation: 29.8, barren: 18.8, urban: 43.9 },
    { month: "Nov'25", water: 6.5, vegetation: 27.5, barren: 20.2, urban: 45.8 },
    { month: "Dec'25", water: 5.8, vegetation: 26.2, barren: 20.5, urban: 47.5 },
    { month: "Jan'26", water: 5.5, vegetation: 25.5, barren: 19.5, urban: 49.5 }
  ],
  bhopal: [
    { month: "Feb'25", water: 8.5, vegetation: 28.5, barren: 15.5, urban: 47.5 },
    { month: "Mar'25", water: 7.8, vegetation: 26.8, barren: 17.8, urban: 47.6 },
    { month: "Apr'25", water: 7.0, vegetation: 24.5, barren: 20.5, urban: 48.0 },
    { month: "May'25", water: 6.2, vegetation: 22.0, barren: 23.8, urban: 48.0 },
    { month: "Jun'25", water: 10.5, vegetation: 29.5, barren: 18.5, urban: 41.5 },
    { month: "Jul'25", water: 14.2, vegetation: 36.8, barren: 13.5, urban: 35.5 },
    { month: "Aug'25", water: 15.5, vegetation: 39.2, barren: 11.8, urban: 33.5 },
    { month: "Sep'25", water: 13.8, vegetation: 36.5, barren: 13.5, urban: 36.2 },
    { month: "Oct'25", water: 11.5, vegetation: 32.8, barren: 15.8, urban: 39.9 },
    { month: "Nov'25", water: 10.2, vegetation: 30.5, barren: 16.8, urban: 42.5 },
    { month: "Dec'25", water: 9.5, vegetation: 29.5, barren: 16.5, urban: 44.5 },
    { month: "Jan'26", water: 8.8, vegetation: 29.0, barren: 16.0, urban: 46.2 }
  ],
  patna: [
    { month: "Feb'25", water: 8.8, vegetation: 30.5, barren: 15.2, urban: 45.5 },
    { month: "Mar'25", water: 8.2, vegetation: 28.8, barren: 17.5, urban: 45.5 },
    { month: "Apr'25", water: 7.5, vegetation: 26.5, barren: 20.5, urban: 45.5 },
    { month: "May'25", water: 6.8, vegetation: 24.2, barren: 23.5, urban: 45.5 },
    { month: "Jun'25", water: 11.5, vegetation: 31.5, barren: 18.5, urban: 38.5 },
    { month: "Jul'25", water: 15.2, vegetation: 38.8, barren: 12.5, urban: 33.5 },
    { month: "Aug'25", water: 17.5, vegetation: 42.5, barren: 10.5, urban: 29.5 },
    { month: "Sep'25", water: 15.8, vegetation: 39.8, barren: 12.2, urban: 32.2 },
    { month: "Oct'25", water: 12.8, vegetation: 35.5, barren: 14.8, urban: 36.9 },
    { month: "Nov'25", water: 10.8, vegetation: 33.2, barren: 16.5, urban: 39.5 },
    { month: "Dec'25", water: 9.8, vegetation: 32.0, barren: 16.2, urban: 42.0 },
    { month: "Jan'26", water: 9.2, vegetation: 31.2, barren: 15.8, urban: 43.8 }
  ],
  nagpur: [
    { month: "Feb'25", water: 4.8, vegetation: 26.5, barren: 18.2, urban: 50.5 },
    { month: "Mar'25", water: 4.2, vegetation: 24.8, barren: 20.5, urban: 50.5 },
    { month: "Apr'25", water: 3.5, vegetation: 22.5, barren: 23.5, urban: 50.5 },
    { month: "May'25", water: 2.8, vegetation: 19.8, barren: 27.2, urban: 50.2 },
    { month: "Jun'25", water: 6.5, vegetation: 27.5, barren: 21.5, urban: 44.5 },
    { month: "Jul'25", water: 10.2, vegetation: 35.8, barren: 15.5, urban: 38.5 },
    { month: "Aug'25", water: 11.8, vegetation: 38.5, barren: 13.2, urban: 36.5 },
    { month: "Sep'25", water: 10.5, vegetation: 36.2, barren: 15.0, urban: 38.3 },
    { month: "Oct'25", water: 8.2, vegetation: 32.5, barren: 17.5, urban: 41.8 },
    { month: "Nov'25", water: 6.8, vegetation: 29.8, barren: 19.2, urban: 44.2 },
    { month: "Dec'25", water: 5.8, vegetation: 28.2, barren: 19.5, urban: 46.5 },
    { month: "Jan'26", water: 5.2, vegetation: 27.5, barren: 18.8, urban: 48.5 }
  ],
  ranchi: [
    { month: "Feb'25", water: 6.5, vegetation: 35.8, barren: 16.2, urban: 41.5 },
    { month: "Mar'25", water: 5.8, vegetation: 33.5, barren: 18.5, urban: 42.2 },
    { month: "Apr'25", water: 5.0, vegetation: 30.8, barren: 21.5, urban: 42.7 },
    { month: "May'25", water: 4.2, vegetation: 27.5, barren: 25.0, urban: 43.3 },
    { month: "Jun'25", water: 9.5, vegetation: 36.5, barren: 18.5, urban: 35.5 },
    { month: "Jul'25", water: 13.5, vegetation: 44.5, barren: 12.5, urban: 29.5 },
    { month: "Aug'25", water: 15.2, vegetation: 47.8, barren: 10.5, urban: 26.5 },
    { month: "Sep'25", water: 13.8, vegetation: 45.5, barren: 12.2, urban: 28.5 },
    { month: "Oct'25", water: 11.2, vegetation: 41.8, barren: 14.8, urban: 32.2 },
    { month: "Nov'25", water: 9.2, vegetation: 39.5, barren: 16.2, urban: 35.1 },
    { month: "Dec'25", water: 7.8, vegetation: 37.8, barren: 16.8, urban: 37.6 },
    { month: "Jan'26", water: 7.0, vegetation: 36.5, barren: 16.5, urban: 40.0 }
  ],
  jammu: [
    { month: "Feb'25", water: 4.5, vegetation: 22.5, barren: 28.5, urban: 44.5 },
    { month: "Mar'25", water: 5.2, vegetation: 26.8, barren: 25.5, urban: 42.5 },
    { month: "Apr'25", water: 6.5, vegetation: 32.5, barren: 21.5, urban: 39.5 },
    { month: "May'25", water: 7.2, vegetation: 35.8, barren: 19.5, urban: 37.5 },
    { month: "Jun'25", water: 8.5, vegetation: 38.5, barren: 17.5, urban: 35.5 },
    { month: "Jul'25", water: 10.8, vegetation: 42.5, barren: 14.2, urban: 32.5 },
    { month: "Aug'25", water: 11.5, vegetation: 44.8, barren: 12.5, urban: 31.2 },
    { month: "Sep'25", water: 10.2, vegetation: 42.2, barren: 14.5, urban: 33.1 },
    { month: "Oct'25", water: 8.5, vegetation: 37.5, barren: 17.8, urban: 36.2 },
    { month: "Nov'25", water: 6.8, vegetation: 32.5, barren: 22.2, urban: 38.5 },
    { month: "Dec'25", water: 5.5, vegetation: 27.5, barren: 26.0, urban: 41.0 },
    { month: "Jan'26", water: 4.8, vegetation: 24.2, barren: 27.5, urban: 43.5 }
  ],
  nashik: [
    { month: "Feb'25", water: 5.5, vegetation: 24.5, barren: 20.5, urban: 49.5 },
    { month: "Mar'25", water: 4.8, vegetation: 22.8, barren: 22.8, urban: 49.6 },
    { month: "Apr'25", water: 4.0, vegetation: 20.5, barren: 25.5, urban: 50.0 },
    { month: "May'25", water: 3.5, vegetation: 18.0, barren: 28.5, urban: 50.0 },
    { month: "Jun'25", water: 7.5, vegetation: 27.5, barren: 21.5, urban: 43.5 },
    { month: "Jul'25", water: 11.5, vegetation: 35.8, barren: 16.2, urban: 36.5 },
    { month: "Aug'25", water: 13.2, vegetation: 38.5, barren: 14.3, urban: 34.0 },
    { month: "Sep'25", water: 11.8, vegetation: 36.2, barren: 16.0, urban: 36.0 },
    { month: "Oct'25", water: 9.2, vegetation: 31.5, barren: 18.8, urban: 40.5 },
    { month: "Nov'25", water: 7.5, vegetation: 28.5, barren: 20.5, urban: 43.5 },
    { month: "Dec'25", water: 6.5, vegetation: 26.5, barren: 21.0, urban: 46.0 },
    { month: "Jan'26", water: 6.0, vegetation: 25.5, barren: 20.8, urban: 47.7 }
  ]
};

const COLORS = {
  water: '#06b6d4',
  vegetation: '#10b981',
  barren: '#f59e0b',
  urban: '#8b5cf6'
};

export default function LandCoverDashboard() {
  const [selectedCities, setSelectedCities] = useState(['mumbai', 'delhi', 'bangalore']);
  const [viewMode, setViewMode] = useState('trend'); // trend, comparison, distribution

  const cities = Object.keys(cityData);

  const toggleCity = (city) => {
    setSelectedCities(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  // Calculate average data across selected cities
  const aggregatedData = useMemo(() => {
    if (selectedCities.length === 0) return [];
    
    const monthData = {};
    selectedCities.forEach(city => {
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
  }, [selectedCities]);

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
      const latest = cityData[city][cityData[city].length - 1];
      return {
        city: city.charAt(0).toUpperCase() + city.slice(1),
        water: latest.water,
        vegetation: latest.vegetation,
        barren: latest.barren,
        urban: latest.urban
      };
    });
  }, [selectedCities]);

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
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setSelectedCities(cities)}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(6, 182, 212, 0.2)',
                border: '1px solid #06b6d4',
                borderRadius: '8px',
                color: '#06b6d4',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Select All
            </button>
            <button
              onClick={() => setSelectedCities([])}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Clear All
            </button>
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
                  Jan 2026 Average
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
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {['trend', 'comparison', 'distribution'].map(mode => (
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
                {mode === 'trend' && '📈'} {mode === 'comparison' && '📊'} {mode === 'distribution' && '🥧'} {mode}
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
                    <AreaChart data={aggregatedData} stackOffset="expand">
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
                        tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                        style={{ fontSize: '0.875rem' }}
                      />
                      <Tooltip 
                        formatter={(value) => `${(value * 100).toFixed(1)}%`}
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
                      />
                      <Tooltip 
                        formatter={(value) => `${value}%`}
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
                  📊 City-wise Comparison (Jan 2026)
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
                    🥧 Current Distribution (Jan 2026)
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
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: COLORS.urban }}>Jan 2026</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}