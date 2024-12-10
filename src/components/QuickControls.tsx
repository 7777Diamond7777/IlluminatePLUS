import React from 'react';
import { Sun, Zap, Calendar } from 'lucide-react';

const QuickControls = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <button className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all">
        <Sun className="h-6 w-6 text-yellow-500 mb-2" />
        <span className="text-sm text-gray-300">Full Brightness</span>
      </button>
      
      <button className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all">
        <Calendar className="h-6 w-6 text-purple-500 mb-2" />
        <span className="text-sm text-gray-300">Event Mode</span>
      </button>
      
      <button className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all">
        <Zap className="h-6 w-6 text-green-500 mb-2" />
        <span className="text-sm text-gray-300">Energy Save</span>
      </button>
    </div>
  );
};

export default QuickControls;