import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WidgetPosition {
  id: string;
  isFullWidth: boolean;
  order: number;
  column?: 1 | 2; // For half-width widgets
  enabled: boolean; // Add enabled property
}

interface WidgetLayoutState {
  positions: WidgetPosition[];
}

const initialState: WidgetLayoutState = {
  positions: [
    { id: 'reports-at-glance', isFullWidth: true, order: 0, enabled: true },
    {
      id: 'overdue-reports',
      isFullWidth: false,
      order: 1,
      column: 1,
      enabled: true,
    },
    {
      id: 'outstanding-reports',
      isFullWidth: false,
      order: 1,
      column: 2,
      enabled: true,
    },
  ],
};

const widgetLayoutSlice = createSlice({
  name: 'widgetLayout',
  initialState,
  reducers: {
    updateWidgetPositions: (state, action: PayloadAction<WidgetPosition[]>) => {
      state.positions = action.payload;
    },
    updateWidgetVisibility: (
      state,
      action: PayloadAction<{ id: string; enabled: boolean }>,
    ) => {
      const { id, enabled } = action.payload;
      const widget = state.positions.find((w) => w.id === id);
      if (widget) {
        widget.enabled = enabled;
      }
    },
    updateAllWidgetsVisibility: (state, action: PayloadAction<string[]>) => {
      // First disable all widgets
      state.positions.forEach((widget) => {
        widget.enabled = false;
      });

      // Then enable only the selected ones
      action.payload.forEach((id) => {
        const widget = state.positions.find((w) => w.id === id);
        if (widget) {
          widget.enabled = true;
        }
      });

      // Recalculate order and columns for enabled widgets
      let currentOrder = 0;
      let currentColumn = 1;

      const enabledWidgets = state.positions.filter((w) => w.enabled);

      enabledWidgets.forEach((widget) => {
        if (widget.isFullWidth) {
          widget.order = currentOrder++;
          widget.column = undefined;
          currentColumn = 1;
        } else {
          widget.column = currentColumn as 1 | 2;
          if (currentColumn === 1) {
            widget.order = currentOrder;
            currentColumn = 2;
          } else {
            currentColumn = 1;
            currentOrder++;
          }
        }
      });
    },
  },
});

export const {
  updateWidgetPositions,
  updateWidgetVisibility,
  updateAllWidgetsVisibility,
} = widgetLayoutSlice.actions;

export default widgetLayoutSlice.reducer;
