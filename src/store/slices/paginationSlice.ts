import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaginationState {
  [key: string]: {
    page: number;
    itemsPerPage: number;
  };
}

const initialState: PaginationState = {};

const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    setPage: (
      state,
      action: PayloadAction<{ entity: string; page: number }>,
    ) => {
      const { entity, page } = action.payload;
      if (!state[entity]) state[entity] = { page: 1, itemsPerPage: 6 };
      state[entity].page = page;
    },
    setItemsPerPage: (
      state,
      action: PayloadAction<{ entity: string; itemsPerPage: number }>,
    ) => {
      const { entity, itemsPerPage } = action.payload;
      if (!state[entity]) state[entity] = { page: 1, itemsPerPage };
      state[entity].itemsPerPage = itemsPerPage;
    },
  },
});

export const { setPage, setItemsPerPage } = paginationSlice.actions;

export default paginationSlice.reducer;
