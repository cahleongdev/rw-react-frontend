import axios from 'axios';

import axiosInstance from '@/api/axiosInstance';

/**
 * Fetches a presigned URL for uploading a file.
 */
export async function getPresignedDownloadUrl(
  fileName: string,
): Promise<string> {
  const response = await axiosInstance.get<string>(
    '/files/generate_get_presigned_url/',
    {
      params: {
        file_name: fileName,
      },
    },
  );
  if (!response.data) {
    throw new Error('Failed to get presigned download URL.');
  }
  return response.data;
}

interface PresignedResponse {
  url: string;
  file_name: string;
}

// Define the type for the progress callback
type ProgressCallback = (percentage: number) => void;

/**
 * Fetches a presigned URL for downloading a file.
 */
export async function getPresignedUrlForUpload(
  file: File,
  type?: string,
): Promise<PresignedResponse> {
  try {
    const response = await axiosInstance.get<PresignedResponse>(
      '/files/generate_presigned_url/',
      {
        params: {
          file_name: file.name,
          file_type: file.type,
          type: type || 'default',
        },
      },
    );

    if (!response.data) {
      throw new Error('Presigned URL not returned from server.');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching presigned URL:', error);
    throw new Error('Failed to get presigned URL for upload.');
  }
}

/**
 * Uploads a file to S3 using a presigned URL.
 */
export const uploadFileToS3 = async (
  file: File,
  presignedUrl: string,
  onProgress?: ProgressCallback, // Add optional callback
): Promise<void> => {
  try {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
        'x-amz-meta-file_name': file.name,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentCompleted); // Call the callback
        }
      },
    });
  } catch (error) {
    console.error('Error uploading file directly to S3:', error);
    throw error; // Re-throw the error to be caught by the hook
  }
};
