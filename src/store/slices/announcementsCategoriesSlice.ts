import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import axios from '@/api/axiosInstance';

import { Category } from '@/store/slices/categoriesSlice';

interface AnnouncementsCategoriesState {
  categories: Category[];
  loading: boolean;
  totalItems: number;
  error: string | null;
}

const initialState: AnnouncementsCategoriesState = {
  categories: [],
  loading: false,
  totalItems: 0,
  error: null,
};
// Create the async thunk
export const fetchAnnouncementsCategories = createAsyncThunk(
  'announcements_categories/fetchAnnouncementsCategories',
  async () => {
    const response = await axios.get('/room/announcement/categories/');
    return response.data;
  },
);

export const batchUpdateAnnouncementsCategories = createAsyncThunk(
  'announcements_categories/batchUpdateAnnouncementsCategories',
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
    await axios.put('/room/announcement/categories/', {
      updates,
      deletes,
      adds,
    });
    dispatch(fetchAnnouncementsCategories());
  },
);

const announcementsCategoriesSlice = createSlice({
  name: 'announcements_categories',
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
      .addCase(fetchAnnouncementsCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAnnouncementsCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.categories = action.payload;
        },
      )
      .addCase(fetchAnnouncementsCategories.rejected, (state) => {
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
} = announcementsCategoriesSlice.actions;

export default announcementsCategoriesSlice.reducer;
