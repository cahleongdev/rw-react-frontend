import React from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

import { TransparencyDetail } from '@containers/Transparency/index.types';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { FileUploadInput } from '@components/base/FileUploadInput';

// Define props for the presentational component
export interface EditAgencyLogoViewProps {
  open: boolean;
  onClose: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  transparencyDetail: TransparencyDetail;
  previewUrl: string | null;
  handleSelectedFile: (files: File[]) => void;
  handleRemoveLogo: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

const EditAgencyLogo: React.FC<EditAgencyLogoViewProps> = ({
  open,
  onClose,
  handleSubmit,
  transparencyDetail,
  previewUrl,
  handleSelectedFile,
  handleRemoveLogo,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-[520px] bg-white rounded-lg p-0"
        showClose={false}
      >
        <DialogHeader className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
          <DialogTitle className="text-slate-700">
            Upload Agency Logo
          </DialogTitle>
          <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
          <DialogDescription className="text-slate-700 hidden">
            Upload a logo for your agency. This will be used to identify your
            agency in the app.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="p-6 flex flex-col items-center">
            {transparencyDetail.logo_url || previewUrl ? (
              <div className="flex flex-col gap-2 justify-center items-center">
                <img
                  src={previewUrl || transparencyDetail.logo_url}
                  alt="Preview"
                  className="max-h-[300px] max-w-[300px] object-cover mb-4"
                />
                <Button
                  variant="outline"
                  onClick={handleRemoveLogo}
                  type="button"
                >
                  Remove Logo
                </Button>
              </div>
            ) : (
              <FileUploadInput
                icon={<PhotoIcon className="h-12 w-12 text-slate-400" />}
                label="Agency Logo"
                onFilesSelected={handleSelectedFile}
                allowedTypes={['.png', '.jpg']}
                multiple={false}
                maxSize={2}
                className="w-full"
                autoUpload={false}
              />
            )}
          </div>
        </form>
        <DialogFooter className="p-4 gap-2 justify-end border-t border-slate-200 bg-slate-50 rounded-b-lg">
          <Button
            variant="outline"
            className="rounded-[3px] border px-4 py-3 border-slate-500 body3-semibold text-slate-700 leading-[1.0]"
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="rounded-[3px] px-4 py-3 bg-blue-500 body3-semibold text-white leading-[1.0]"
            onClick={handleSubmit}
            type="submit"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAgencyLogo;
