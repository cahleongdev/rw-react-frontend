import axiosInstance from './axiosInstance';
import { EntityDocument } from '@/store/slices/entityDocumentsSlice'; // Assuming type is defined here

interface DocumentUploadPayload {
  name: string;
  file_url: string; // Or File if you handle S3 upload client-side then send form-data
  year?: string; // Make year optional as per usage
  document_type: string;
  parent_type: 'school' | 'board'; // Use specific types
  parent_id: string;
  expiration_date?: string | null; // Added for updates
}

/**
 * Fetches documents for a given parent entity (school or board).
 */
export const fetchDocumentsForParent = async (
  parentId: string,
  parentType: 'school' | 'board',
): Promise<EntityDocument[]> => {
  if (!parentId || !parentType) {
    console.error(
      'fetchDocumentsForParent: parentId and parentType are required',
    );
    return [];
  }
  try {
    const response = await axiosInstance.get<EntityDocument[]>(
      `/documents/?parent_type=${parentType}&parent_id=${parentId}`,
    );
    return response.data || [];
  } catch (error) {
    console.error(
      `Error fetching ${parentType} documents for ${parentId}:`,
      error,
    );
    throw error;
  }
};

/**
 * Uploads a new document.
 */
export const uploadDocument = async (
  payload: DocumentUploadPayload,
): Promise<EntityDocument> => {
  try {
    const response = await axiosInstance.post<EntityDocument>(
      '/documents/',
      payload,
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

/**
 * Deletes a document by its ID.
 */
export const deleteDocumentById = async (documentId: string): Promise<void> => {
  if (!documentId) {
    console.error('deleteDocumentById: documentId is required');
    return;
  }
  try {
    await axiosInstance.delete(`/documents/${documentId}/`);
  } catch (error) {
    console.error(`Error deleting document ${documentId}:`, error);
    throw error;
  }
};

/**
 * Updates a document (e.g., name, expiration_date).
 */
export const updateDocumentDetails = async (
  documentId: string,
  updates: Partial<Pick<DocumentUploadPayload, 'name' | 'expiration_date'>>,
): Promise<EntityDocument> => {
  if (!documentId) {
    throw new Error('updateDocumentDetails: documentId is required');
  }
  try {
    const response = await axiosInstance.put<EntityDocument>(
      `/documents/${documentId}/`,
      updates,
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating document ${documentId}:`, error);
    throw error;
  }
};
