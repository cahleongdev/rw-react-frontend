import { useState } from 'react';

import {
  getPresignedUrlForUpload,
  uploadFileToS3,
} from '@/utils/fileUploadService';

// Define ProgressCallback type if not imported
type ProgressCallback = (percentage: number) => void;

interface UseFileUploadReturn {
  isUploading: boolean;
  uploadStatus: string | null;
  uploadedFileName: string | null;
  uploadedFileUrl: string | null;
  uploadFile: (
    file: File,
    onProgress?: ProgressCallback,
    type?: string,
  ) => Promise<string>;
}

const useFileUpload = (): UseFileUploadReturn => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  /**
   * Handles the file upload process.
   * @param file - The file to upload.
   * @param onProgress - Optional progress callback.
   */
  const uploadFile = async (
    file: File,
    onProgress?: ProgressCallback,
    type?: string,
  ): Promise<string> => {
    setIsUploading(true);
    setUploadStatus(null);

    try {
      setIsUploading(true);
      // Step 1: Get the presigned URL
      const presignedResponse = await getPresignedUrlForUpload(file, type);
      // Step 2: Upload the file to S3 using the presigned URL
      setUploadedFileName(presignedResponse.file_name);
      await uploadFileToS3(file, presignedResponse.url, onProgress);

      // Step 3: Extract the uploaded file URL (without query parameters)
      //const uploadedUrl = presignedUrl.split('?')[0];s
      setUploadedFileUrl(presignedResponse.url);

      setUploadStatus('File uploaded successfully!');
      return presignedResponse.file_name;
    } catch (error) {
      console.error('File upload failed:', error);
      setUploadStatus('Failed to upload file. Please try again.');
      return '';
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadStatus,
    uploadedFileName,
    uploadedFileUrl,
    uploadFile,
  };
};

export default useFileUpload;
