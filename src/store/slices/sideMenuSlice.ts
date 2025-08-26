import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SideMenuState {
  isCollapsed: boolean;
}

const initialState: SideMenuState = {
  isCollapsed: false,
};

const sideMenuSlice = createSlice({
  name: 'sideMenu',
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
    setMenuState: (state, action: PayloadAction<boolean>) => {
      state.isCollapsed = action.payload;
    },
  },
});

export const { toggleMenu, setMenuState } = sideMenuSlice.actions;

export default sideMenuSlice.reducer;
