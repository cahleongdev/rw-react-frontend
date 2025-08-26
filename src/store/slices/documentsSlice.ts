import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EntityType } from '@containers/EntitySideDrawer/index.types';

// Define document interfaces
interface Document {
  id: string;
  name: string;
  type: string;
  expires: string | null;
  section?: string; // For organizing documents (e.g., by year or category)
  entityId: string; // ID of the user or entity that owns the document
  entityType: EntityType; // Type of entity that owns the document
}

interface DocumentsState {
  documents: Document[];
  loading: boolean;
  error: string | null;
}

const initialState: DocumentsState = {
  documents: [],
  loading: false,
  error: null,
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setDocuments: (state, action: PayloadAction<Document[]>) => {
      state.documents = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addDocument: (state, action: PayloadAction<Document>) => {
      state.documents.push(action.payload);
    },
    updateDocument: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Document> }>,
    ) => {
      const index = state.documents.findIndex(
        (doc) => doc.id === action.payload.id,
      );
      if (index !== -1) {
        state.documents[index] = {
          ...state.documents[index],
          ...action.payload.updates,
        };
      }
    },
    deleteDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter(
        (doc) => doc.id !== action.payload,
      );
    },
    clearDocuments: (state) => {
      state.documents = [];
    },
  },
});

export const {
  setDocuments,
  setLoading,
  setError,
  addDocument,
  updateDocument,
  deleteDocument,
  clearDocuments,
} = documentsSlice.actions;

export default documentsSlice.reducer;
