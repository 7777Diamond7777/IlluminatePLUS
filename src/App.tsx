import React from 'react';
import Header from './components/Header';
import DashboardLayout from './components/dashboard/DashboardLayout';

function App() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <DashboardLayout />
    </div>
  );
}

export default App;