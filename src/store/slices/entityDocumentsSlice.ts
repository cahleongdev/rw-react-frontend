import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Interface matching the API response structure (simplified)
export interface EntityDocument {
  id: string;
  file_url: string; // This is likely the S3 key/path
  name: string;
  type: string;
  year: string; // e.g., '2024', '2023'
  expiration_date: string | null;
  created_at: string; // ISO string
  parent_type?: 'school' | 'network' | 'user'; // Store parent type
  parent_id?: string; // Store parent ID
  created_by?: string; // Optional based on API response detail
  // Add other fields if needed, e.g., expires, added date from other contexts
  section?: string; // Keep for potential section-based grouping if needed later
  entityId?: string; // Store entity ID if needed for filtering, though state is keyed by it
  entityType?: 'School' | 'Network'; // Store entity type
}

interface EntityDocumentsState {
  // Store documents nested by parent ID (entityId/userId) and then by year
  documentsByParentId: Record<string, Record<string, EntityDocument[]>>;
  // Track loading per parent ID and optionally per year, or just per parent?
  loadingByParentId: Record<string, boolean>;
  // Add state for board documents
  boardDocumentsByParentId: Record<string, EntityDocument[]>;
  loadingBoardDocsByParentId: Record<string, boolean>;
}

const initialState: EntityDocumentsState = {
  documentsByParentId: {},
  loadingByParentId: {},
  // Initialize new state
  boardDocumentsByParentId: {},
  loadingBoardDocsByParentId: {},
};

const entityDocumentsSlice = createSlice({
  name: 'entityDocuments',
  initialState,
  reducers: {
    setLoadingForParent(
      state,
      action: PayloadAction<{ parentId: string; isLoading: boolean }>,
    ) {
      state.loadingByParentId[action.payload.parentId] =
        action.payload.isLoading;
    },
    // Action to set all documents for a parent, grouped by year
    setAllDocumentsForParent(
      state,
      action: PayloadAction<{ parentId: string; documents: EntityDocument[] }>,
    ) {
      const { parentId, documents } = action.payload;
      const groupedByYear: Record<string, EntityDocument[]> = {};
      documents.forEach((doc) => {
        // Ensure doc has year, add parent info for context
        const docWithContext = { ...doc, parent_id: parentId };
        const year = doc.year || 'Unknown'; // Group under 'Unknown' if year is missing
        if (!groupedByYear[year]) {
          groupedByYear[year] = [];
        }
        groupedByYear[year].push(docWithContext);
      });
      state.documentsByParentId[parentId] = groupedByYear;
      state.loadingByParentId[parentId] = false; // Mark loading as complete
    },
    // Action specifically for adding a single document (e.g., after upload)
    addDocumentToParent(
      state,
      // Payload should match the structure of a created document from POST /documents/
      action: PayloadAction<{ parentId: string; document: EntityDocument }>,
    ) {
      const { parentId, document } = action.payload;
      const year = document.year || 'Unknown';
      if (!state.documentsByParentId[parentId]) {
        state.documentsByParentId[parentId] = {};
      }
      if (!state.documentsByParentId[parentId][year]) {
        state.documentsByParentId[parentId][year] = [];
      }
      // Add document, ensuring no duplicates if action is dispatched multiple times
      if (
        !state.documentsByParentId[parentId][year].some(
          (d) => d.id === document.id,
        )
      ) {
        state.documentsByParentId[parentId][year].push({
          ...document,
          parent_id: parentId,
        });
      }
    },
    // Action for updating a document (e.g., name, expiration)
    updateDocumentInParent(
      state,
      // Payload contains parentId, year, documentId, and the updates
      action: PayloadAction<{
        parentId: string;
        year: string;
        documentId: string;
        updates: Partial<EntityDocument>;
      }>,
    ) {
      const { parentId, year, documentId, updates } = action.payload;
      const yearDocs = state.documentsByParentId[parentId]?.[year];
      if (yearDocs) {
        const docIndex = yearDocs.findIndex((d) => d.id === documentId);
        if (docIndex !== -1) {
          yearDocs[docIndex] = { ...yearDocs[docIndex], ...updates };
        }
      }
    },
    // Action for deleting a document
    deleteDocumentFromParent(
      state,
      action: PayloadAction<{
        parentId: string;
        year: string;
        documentId: string;
      }>,
    ) {
      const { parentId, year, documentId } = action.payload;
      if (state.documentsByParentId[parentId]?.[year]) {
        state.documentsByParentId[parentId][year] = state.documentsByParentId[
          parentId
        ][year].filter((doc) => doc.id !== documentId);
      }
    },
    clearDocumentsForEntity(state, action: PayloadAction<string>) {
      const entityId = action.payload;
      delete state.documentsByParentId[entityId];
      delete state.loadingByParentId[entityId];
    },
    // --- New Actions/Reducers for Board Documents ---
    setLoadingBoardDocs: (
      state,
      action: PayloadAction<{ parentId: string; isLoading: boolean }>,
    ) => {
      const { parentId, isLoading } = action.payload;
      state.loadingBoardDocsByParentId[parentId] = isLoading;
    },
    setBoardDocumentsForParent: (
      state,
      action: PayloadAction<{ parentId: string; documents: EntityDocument[] }>,
    ) => {
      const { parentId, documents } = action.payload;
      state.boardDocumentsByParentId[parentId] = documents;
      state.loadingBoardDocsByParentId[parentId] = false; // Mark loading as complete
    },
    addBoardDocumentToParent: (
      state,
      action: PayloadAction<{ parentId: string; document: EntityDocument }>,
    ) => {
      const { parentId, document } = action.payload;
      if (!state.boardDocumentsByParentId[parentId]) {
        state.boardDocumentsByParentId[parentId] = [];
      }
      // Add if it doesn't exist already
      if (
        !state.boardDocumentsByParentId[parentId].some(
          (d) => d.id === document.id,
        )
      ) {
        state.boardDocumentsByParentId[parentId].push(document);
      }
    },
    updateBoardDocumentInParent: (
      state,
      action: PayloadAction<{
        parentId: string;
        documentId: string;
        updates: Partial<EntityDocument>;
      }>,
    ) => {
      const { parentId, documentId, updates } = action.payload;
      const boardDocs = state.boardDocumentsByParentId[parentId];
      if (boardDocs) {
        const index = boardDocs.findIndex((d) => d.id === documentId);
        if (index !== -1) {
          boardDocs[index] = { ...boardDocs[index], ...updates };
        }
      }
    },
    deleteBoardDocumentFromParent: (
      state,
      action: PayloadAction<{ parentId: string; documentId: string }>,
    ) => {
      const { parentId, documentId } = action.payload;
      if (state.boardDocumentsByParentId[parentId]) {
        state.boardDocumentsByParentId[parentId] =
          state.boardDocumentsByParentId[parentId].filter(
            (d) => d.id !== documentId,
          );
      }
    },
    // --- End Board Document Actions ---
  },
});

export const {
  setLoadingForParent,
  setAllDocumentsForParent,
  addDocumentToParent,
  updateDocumentInParent,
  deleteDocumentFromParent,
  clearDocumentsForEntity,
  setLoadingBoardDocs,
  setBoardDocumentsForParent,
  addBoardDocumentToParent,
  updateBoardDocumentInParent,
  deleteBoardDocumentFromParent,
} = entityDocumentsSlice.actions;

export default entityDocumentsSlice.reducer;
