import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import { Settings } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { DashboardWidget } from '../../types/dashboard';
import WidgetContainer from './WidgetContainer';
import 'react-grid-layout/css/styles.css';

const DEFAULT_LAYOUT: DashboardWidget[] = [
  { i: 'arenaStatus', x: 0, y: 0, w: 8, h: 4, component: 'ArenaStatus' },
  { i: 'quickControls', x: 8, y: 0, w: 4, h: 4, component: 'QuickControls' },
  { i: 'fixtureVisualizer', x: 0, y: 4, w: 12, h: 6, component: 'FixtureVisualizer' },
  { i: 'dmxControls', x: 0, y: 10, w: 8, h: 6, component: 'DMXControls' },
  { i: 'aiControls', x: 8, y: 10, w: 4, h: 6, component: 'AIShowControls' }
];

const DashboardLayout: React.FC = () => {
  const [layout, setLayout] = useLocalStorage('dashboard-layout', DEFAULT_LAYOUT);
  const [isEditing, setIsEditing] = useState(false);

  const handleLayoutChange = (newLayout: GridLayout.Layout[]) => {
    const updatedWidgets = layout.map(widget => {
      const newPos = newLayout.find(item => item.i === widget.i);
      return newPos ? { ...widget, ...newPos } : widget;
    });
    setLayout(updatedWidgets);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Dashboard</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
        >
          <Settings className="h-4 w-4" />
          <span>{isEditing ? 'Save Layout' : 'Edit Layout'}</span>
        </button>
      </div>

      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        isDraggable={isEditing}
        isResizable={isEditing}
        onLayoutChange={handleLayoutChange}
        margin={[16, 16]}
      >
        {layout.map(widget => (
          <div key={widget.i} className="bg-gray-800 rounded-lg overflow-hidden">
            <WidgetContainer widget={widget} isEditing={isEditing} />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default DashboardLayout;