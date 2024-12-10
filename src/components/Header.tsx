import React from 'react';
import { Activity, Building2 } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gray-900 p-4 border-b border-gray-800">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold text-white">ArenaControl</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Active Arenas:</span>
            <span className="text-white font-semibold">12</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-green-500" />
            <span className="text-green-500">System Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;