import { Layout } from 'react-grid-layout';

export interface DashboardWidget extends Layout {
  component: string;
}

export interface WidgetConfig {
  id: string;
  title: string;
  description: string;
  defaultSize: {
    w: number;
    h: number;
  };
  minSize?: {
    w: number;
    h: number;
  };
  maxSize?: {
    w: number;
    h: number;
  };
}