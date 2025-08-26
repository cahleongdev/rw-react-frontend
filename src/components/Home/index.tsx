import RGL, { WidthProvider } from 'react-grid-layout';

import { WidgetPosition } from '@/store/slices/widgetLayoutSlice';

import { Button } from '@/components/base/Button';
import { ScrollArea } from '@/components/base/ScrollArea';
import CustomizeWidgetsDialog from './CustomizeWidgetsDialog';
import OverdueReportsBySchool from './OverdueReportsBySchool';
import OutstandingReportsByStatus from './OutstandingReportsByStatus';
import ReportsAtGlance from './ReportsAtGlance';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ReactGridLayout = WidthProvider(RGL);

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

interface HomeProps {
  enabledWidgets: WidgetPosition[];
  customizeDialogOpen: boolean;
  setCustomizeDialogOpen: (open: boolean) => void;
  generateLayout: () => LayoutItem[];
  handleLayoutChange: (layout: LayoutItem[]) => void;
}

const Home = ({ enabledWidgets, customizeDialogOpen, setCustomizeDialogOpen, generateLayout, handleLayoutChange }: HomeProps) => {
  const renderWidgets = () => {
    return enabledWidgets.map((position) => {
      const widget = WIDGET_CONFIGS.find((w) => w.id === position.id);
      if (!widget) return null;

      const Component = widget.component;
      return (
        <div key={position.id} className="widget-container">
          <Component />
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center py-4 px-6 border-b-[1px] border-beige-300 bg-beige-100 flex-shrink-0">
        <h3 className="text-slate-900">Home</h3>
        <Button
          variant="outline"
          className="cursor-pointer bg-white border-slate-300 rounded-[6px] hover:bg-slate-100 h-[36px] p-[8px_12px]"
          onClick={() => setCustomizeDialogOpen(true)}
        >
          <span className="text-slate-700 button2">Customize</span>
        </Button>
      </div>

      <div className="flex-1 px-6 py-4 overflow-hidden">
        <ScrollArea className="h-full">
          {enabledWidgets.length > 0 ? (
            <ReactGridLayout
              className="layout"
              layout={generateLayout()}
              cols={2}
              rowHeight={190}
              width={1200}
              margin={[16, 16]}
              onLayoutChange={handleLayoutChange}
              draggableHandle=".drag-handle"
              isResizable={false}
              compactType="vertical"
              preventCollision={false}
              useCSSTransforms={true}
            >
              {renderWidgets()}
            </ReactGridLayout>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-500">
                No widgets selected. Click Customize to add widgets.
              </p>
            </div>
          )}
        </ScrollArea>
      </div>

      <CustomizeWidgetsDialog
        open={customizeDialogOpen}
        onOpenChange={setCustomizeDialogOpen}
      />
    </div>
  );
};

export default Home;
