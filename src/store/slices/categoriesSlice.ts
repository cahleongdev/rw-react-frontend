import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import axios from '@/api/axiosInstance';

export interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoriesState {
  categories: Category[]; // Store reports by page number
  totalItems: number;
  loading: boolean;
}

const initialState: CategoriesState = {
  categories: [],
  totalItems: 0,
  loading: false,
};

// Create the async thunk
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await axios.get('/reports/categories/report_category/');
    return response.data;
  },
);

export const batchUpdateCategories = createAsyncThunk(
  'categories/batchUpdateCategories',
  async (
    {
      updates,
      deletes,
      adds,
    }: {
      updates: { id: string; color: string }[];
      deletes: string[];
      adds: { name: string; color: string }[];
    },
    { dispatch },
  ) => {
    await axios.put('/reports/categories/report_category/', {
      updates,
      deletes,
      adds,
    });
    dispatch(fetchCategories());
  },
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setTotalItems: (state, action: PayloadAction<number>) => {
      state.totalItems = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearCategories: (state) => {
      state.categories = [];
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      // Add the new report to page 1 if it exists
      state.categories.push(action.payload);
      state.totalItems += 1;
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      // Remove the report from all pages where it exists
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload,
      );
      state.totalItems -= 1;
    },
    updateCategory: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Category> }>,
    ) => {
      // Update the report in all pages where it exists
      const categoryIndex = state.categories.findIndex(
        (category) => category.id === action.payload.id,
      );

      if (categoryIndex !== -1) {
        // Update the report at its original position
        state.categories[categoryIndex] = {
          ...state.categories[categoryIndex],
          ...action.payload.updates,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.categories = action.payload;
        },
      )
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
        // You might want to add an error field to your state
      });
  },
});

export const {
  setCategories,
  setTotalItems,
  setLoading,
  clearCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
