import React from 'react';
import { DashboardWidget } from '../../types/dashboard';
import ArenaStatus from '../ArenaStatus';
import QuickControls from '../QuickControls';
import FixtureVisualizer from '../FixtureVisualizer';
import DMXControls from '../DMXControls';
import AIShowControls from '../AIShowControls';

const WIDGET_COMPONENTS = {
  ArenaStatus,
  QuickControls,
  FixtureVisualizer,
  DMXControls,
  AIShowControls,
};

interface WidgetContainerProps {
  widget: DashboardWidget;
  isEditing: boolean;
}

const WidgetContainer: React.FC<WidgetContainerProps> = ({ widget, isEditing }) => {
  const Component = WIDGET_COMPONENTS[widget.component as keyof typeof WIDGET_COMPONENTS];

  if (!Component) {
    return <div className="p-4 text-red-500">Widget not found: {widget.component}</div>;
  }

  return (
    <div className="h-full">
      {isEditing && (
        <div className="bg-gray-700 p-2 text-sm text-gray-300">
          {widget.component}
        </div>
      )}
      <div className="p-4">
        <Component />
      </div>
    </div>
  );
};

export default WidgetContainer;