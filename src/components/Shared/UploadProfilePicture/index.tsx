import React, { useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { Dialog, DialogContent, DialogTitle } from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { FileUploadInput } from '@/components/base/FileUploadInput';

interface UploadProfilePictureProps {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  onSave: (file: File) => void;
}

const UploadProfilePicture: React.FC<UploadProfilePictureProps> = ({
  open,
  onClose,
  isLoading,
  onSave,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const allowedTypes = ['.png', '.jpg', '.jpeg', '.gif'];

  // Handle file selection
  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      if (objectUrl.startsWith('blob:')) {
        setPreviewUrl(objectUrl);
        setError(null);
      } else {
        setError('Invalid file preview URL');
      }
    }
  };

  const handleSave = () => {
    if (selectedFile) {
      onSave(selectedFile);
    }
  };

  // Remove selected photo
  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-[520px] bg-white rounded-lg p-0 gap-0"
        showClose={false}
      >
        <DialogTitle className="hidden" />
        <div className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
          <h3 className="text-slate-700">Upload Image</h3>
          <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
        </div>
        <div className="p-6 flex flex-col gap-2 h-[250px] justify-center items-center text-center">
          {!selectedFile && (
            <FileUploadInput
              icon={<PhotoIcon className="h-12 w-12 text-slate-400" />}
              label={undefined}
              onFilesSelected={handleFileSelected}
              allowedTypes={allowedTypes}
              multiple={false}
              maxSize={5}
              className="w-full"
              error={error || undefined}
              autoUpload={false}
            />
          )}
          {selectedFile && previewUrl && (
            <>
              {previewUrl.startsWith('blob:') ? (
                <img
                  src={previewUrl}
                  width={144}
                  height={144}
                  className="rounded-md object-cover"
                  alt="Profile preview"
                />
              ) : (
                <div className="text-red-600">Invalid preview URL</div>
              )}
              <Button
                variant="outline"
                className="mt-2 rounded-[3px] border border-slate-500 px-3 py-2 body2-semibold text-slate-700"
                onClick={handleRemovePhoto}
                type="button"
              >
                Remove Photo
              </Button>
            </>
          )}
          {error && <div className="body3-regular text-red-600">{error}</div>}
        </div>
        <div className="flex flex-row p-4 gap-2 justify-end border-t border-beige-300 bg-beige-50 rounded-b-lg">
          <Button
            variant="outline"
            onClick={onClose}
            type="button"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={handleSave}
            type="button"
            disabled={isLoading}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadProfilePicture;
