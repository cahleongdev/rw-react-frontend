import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateWidgetPositions } from '@/store/slices/widgetLayoutSlice';
import type { RootState } from '@/store';

import OverdueReportsBySchool from '@/components/Home/OverdueReportsBySchool';
import OutstandingReportsByStatus from '@/components/Home/OutstandingReportsByStatus';
import ReportsAtGlance from '@/components/Home/ReportsAtGlance';
import HomeComponent from '@/components/Home';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

interface WidgetConfig {
  id: string;
  component: React.ComponentType;
  isFullWidth: boolean;
}

const WIDGET_CONFIGS: WidgetConfig[] = [
  {
    id: 'reports-at-glance',
    component: ReportsAtGlance,
    isFullWidth: true,
  },
  {
    id: 'overdue-reports',
    component: OverdueReportsBySchool,
    isFullWidth: false,
  },
  {
    id: 'outstanding-reports',
    component: OutstandingReportsByStatus,
    isFullWidth: false,
  },
];

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const Home = () => {
  const dispatch = useDispatch();
  const [customizeDialogOpen, setCustomizeDialogOpen] = useState(false);
  const widgetPositions = useSelector(
    (state: RootState) => state.widgetLayout.positions,
  );

  // Filter only enabled widgets
  const enabledWidgets = widgetPositions.filter((widget) => widget.enabled);

  const generateLayout = (): LayoutItem[] => {
    return enabledWidgets.map((widget) => {
      const isFullWidth = WIDGET_CONFIGS.find(
        (w) => w.id === widget.id,
      )?.isFullWidth;
      return {
        i: widget.id,
        x: isFullWidth ? 0 : widget.column === 1 ? 0 : 1,
        y: widget.order * 2,
        w: isFullWidth ? 2 : 1,
        h: 2,
      };
    });
  };

  const handleLayoutChange = (layout: LayoutItem[]) => {
    const newPositions = layout.map((item) => {
      const isFullWidth = item.w === 2;

      return {
        id: item.i,
        isFullWidth,
        order: Math.floor(item.y / 2),
        column: isFullWidth ? undefined : ((item.x === 0 ? 1 : 2) as 1 | 2),
        enabled: true, // Keep enabled status
      };
    });

    // Preserve disabled widgets in the state
    const disabledWidgets = widgetPositions.filter((widget) => !widget.enabled);

    dispatch(updateWidgetPositions([...newPositions, ...disabledWidgets]));
  };

  return <HomeComponent
    enabledWidgets={enabledWidgets}
    customizeDialogOpen={customizeDialogOpen}
    setCustomizeDialogOpen={setCustomizeDialogOpen}
    generateLayout={generateLayout}
    handleLayoutChange={handleLayoutChange}
  />;
};

export default Home;
