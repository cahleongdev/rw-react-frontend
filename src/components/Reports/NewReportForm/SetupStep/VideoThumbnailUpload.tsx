import React, { useState } from 'react';
import DOMPurify from 'dompurify';

import { Button } from '@components/base/Button';
import { XMarkIcon } from '@heroicons/react/24/solid';

import { Dialog, DialogContent, DialogTitle } from '@/components/base/Dialog';
import { FileUploadInput } from '@/components/base/FileUploadInput';

interface VideoThumbnailUploadProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFilesSelected: (file: File | null) => void;
  isLoading: boolean;
  initialVideoCover: string | null;
}

const VideoThumbnailUpload: React.FC<VideoThumbnailUploadProps> = ({
  isOpen,
  onOpenChange,
  onFilesSelected,
  isLoading,
  initialVideoCover,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialVideoCover,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle file selection
  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      if (objectUrl.startsWith('blob:')) {
        setPreviewUrl(DOMPurify.sanitize(objectUrl));
      } else {
        console.error('Invalid file preview URL');
      }
    }
  };

  const handleSave = () => {
    onFilesSelected(selectedFile);
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  const handleRemovePhoto = () => {
    if (!isLoading) {
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  };

  // we need to ensure that the previewUrl is validated before being used as the src attribute
  const isValidPreviewUrl = (urlString: string): boolean => {
    // if initialVideoCover is set, then we don't need to check if the url is valid
    if (initialVideoCover) return true;
    try {
      const url = new URL(urlString);
      return url.protocol === 'blob:';
    } catch (error) {
      console.error('Invalid URL:', error);
      return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[520px] bg-white rounded-lg gap-0 p-0"
        showClose={false}
      >
        <DialogTitle className="hidden" />
        <div className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
          <h3 className="text-slate-700">Upload Video Thumbnail</h3>
          <XMarkIcon
            className="w-6 h-6 cursor-pointer"
            onClick={() => onOpenChange(false)}
          />
        </div>
        <div className="p-6 flex flex-col gap-2 h-[250px] justify-center items-center text-center">
          {previewUrl ? (
            <>
              {initialVideoCover ||
              (previewUrl && isValidPreviewUrl(previewUrl)) ? (
                <img
                  src={previewUrl}
                  width={144}
                  height={144}
                  className="rounded-md object-cover"
                  alt="Profile preview"
                />
              ) : (
                <p className="text-red-500">Invalid preview URL</p>
              )}
              <Button
                variant="outline"
                className="mt-2 rounded-[3px] border border-slate-500 px-3 py-2 body2-semibold text-slate-700"
                onClick={handleRemovePhoto}
              >
                Remove Photo
              </Button>
            </>
          ) : (
            <FileUploadInput
              className="w-full"
              onFilesSelected={handleFileSelected}
              allowedTypes={['.png', '.jpg', '.jpeg']}
            />
          )}
        </div>
        <div className="flex flex-row p-4 gap-2 justify-end border-t border-beige-300 bg-beige-50 rounded-b-lg">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={handleSave}
            disabled={isLoading}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoThumbnailUpload;
