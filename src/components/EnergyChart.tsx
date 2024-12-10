import React from 'react';
import { LineChart, Battery } from 'lucide-react';

const EnergyChart = () => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Battery className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-white">Energy Consumption</h3>
        </div>
        <select className="bg-gray-700 text-gray-300 rounded px-2 py-1 text-sm">
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>Last Year</option>
        </select>
      </div>
      
      <div className="h-64 flex items-center justify-center">
        <LineChart className="h-12 w-12 text-gray-600" />
        <span className="text-gray-500 ml-2">Chart visualization will be implemented here</span>
      </div>
    </div>
  );
};

export default EnergyChart;