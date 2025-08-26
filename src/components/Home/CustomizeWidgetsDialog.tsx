import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { Checkbox } from '@/components/base/Checkbox';
import { ScrollArea } from '@/components/base/ScrollArea';

import { RootState } from '@/store';
import { updateAllWidgetsVisibility } from '@/store/slices/widgetLayoutSlice';

interface Widget {
  id: string;
  title: string;
  description: string;
  isRecommended?: boolean;
  categories: string[];
}

interface CustomizeWidgetsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES = ['Recommended', 'School Performance', 'Submissions'];

const AVAILABLE_WIDGETS: Widget[] = [
  {
    id: 'reports-at-glance',
    title: 'Reports at a glance',
    description:
      'Show report metrics sortable by school, time period and team.',
    isRecommended: true,
    categories: ['Recommended'],
  },
  {
    id: 'overdue-reports',
    title: 'Overdue reports by school',
    description: 'Show which schools have overdue reports.',
    categories: ['Recommended'],
  },
  {
    id: 'outstanding-reports',
    title: 'Outstanding reports by status',
    description:
      'Show which reports are in complete, returned or pending status.',
    categories: ['Recommended'],
  },
];

const CustomizeWidgetsDialog = ({
  open,
  onOpenChange,
}: CustomizeWidgetsDialogProps) => {
  const dispatch = useDispatch();
  const widgetPositions = useSelector(
    (state: RootState) => state.widgetLayout.positions,
  );

  // Initialize selected widgets from Redux state
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Recommended');

  // Update selected widgets when dialog opens
  useEffect(() => {
    if (open) {
      const enabledWidgets = widgetPositions
        .filter((widget) => widget.enabled)
        .map((widget) => widget.id);
      setSelectedWidgets(enabledWidgets);
    }
  }, [open, widgetPositions]);

  const handleToggleWidget = (widgetId: string) => {
    setSelectedWidgets((prev) =>
      prev.includes(widgetId)
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId],
    );
  };

  const handleSave = () => {
    dispatch(updateAllWidgetsVisibility(selectedWidgets));
    onOpenChange(false);
  };

  const filteredWidgets = AVAILABLE_WIDGETS.filter((widget) =>
    widget.categories.includes(selectedCategory),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[633px] h-[407px] bg-white p-0 gap-0 flex flex-col">
        <DialogHeader className="border-b-[1px] border-slate-200 p-4">
          <DialogTitle>
            <h3 className="text-slate-700 body1-medium">Add report cards</h3>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden p-[24px_16px]">
          {/* Categories Section */}
          <div className="w-[200px]">
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-4">
                {CATEGORIES.map((category) => (
                  <div className="flex" key={category}>
                    <span
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-md cursor-pointer mb-2 body2-medium ${selectedCategory === category
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                      {category}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Widgets Section */}
          <div className="flex-1">
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-4">
                <h3>{selectedCategory}</h3>

                <div className="flex flex-col gap-6">
                  {filteredWidgets.map((widget) => (
                    <div
                      key={widget.id}
                      className="flex items-start gap-3 cursor-pointer"
                      onClick={() => handleToggleWidget(widget.id)}
                    >
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedWidgets.includes(widget.id)}
                          onCheckedChange={() => handleToggleWidget(widget.id)}
                          className="mt-1 border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:text-white cursor-pointer"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-900 text-base">
                          {widget.title}
                        </span>
                        <span className="text-slate-600 text-sm">
                          {widget.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-slate-200">
          <Button
            variant="outline"
            className="border-slate-500 bg-white rounded-[3px] w-[72px] h-[34px]"
            onClick={() => onOpenChange(false)}
          >
            <span className="text-slate-700 button3">Cancel</span>
          </Button>
          <Button
            className="bg-blue-500 rounded-[3px] w-[72px] h-[34px]"
            onClick={handleSave}
          >
            <span className="text-white button3">Save</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizeWidgetsDialog;
