import React, { useEffect, useState } from 'react';
import DocViewer, {
  DocViewerRenderers,
  IDocument,
} from '@cyntler/react-doc-viewer';

import { getPresignedDownloadUrl } from '@/utils/fileUploadService';

interface FilePreviewProps {
  file?: {
    file_url: string;
    file_name: string;
  };
}

const getFileType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension;
};

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  const [doc, setDoc] = useState<IDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      if (!file) return;

      setIsLoading(true);
      try {
        const url = await getPresignedDownloadUrl(file.file_url);
        setDoc({
          uri: url,
          fileType: getFileType(file.file_name),
          fileName: file.file_name,
        });
      } catch (error) {
        console.error('Failed to fetch document:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoc();
  }, [file]);

  if (!file) {
    return (
      <div className="text-center">
        <h5 className="text-slate-700 button2-medium mb-2">File Preview</h5>
        <p className="text-slate-500 text-sm">
          Select a file to preview its contents
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-700">Loading document...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {doc ? (
        <DocViewer
          documents={[doc]}
          pluginRenderers={DocViewerRenderers}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'white',
          }}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-700">Unable to preview this file</p>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
