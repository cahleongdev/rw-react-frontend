import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  selectedSchoolIdForAdmin: string | null;
  // Add other UI-related state here if needed in the future
}

const initialState: UiState = {
  selectedSchoolIdForAdmin: null,
};

const uiStateSlice = createSlice({
  name: 'uiState',
  initialState,
  reducers: {
    setSelectedSchoolIdForAdmin(state, action: PayloadAction<string | null>) {
      state.selectedSchoolIdForAdmin = action.payload;
    },
    // Add other UI state reducers here
  },
});

export const { setSelectedSchoolIdForAdmin } = uiStateSlice.actions;

export default uiStateSlice.reducer;
