import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';
import {
  ArrowTopRightOnSquareIcon,
  PhotoIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/utils/tailwind';

interface ComplaintFormSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // For now, we'll manage settings internally or with mock data
  // In the future, we'll need props for initial settings and save handlers
  // initialAgencyHomeUrl?: string;
  // initialAgencyLogoUrl?: string;
  // complaintFormUrl?: string;
  // onSaveSettings: (settings: { agencyHomeUrl: string; agencyLogo?: File | string }) => void;
}

const ComplaintFormSettingsModal: React.FC<ComplaintFormSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [agencyHomeUrl, setAgencyHomeUrl] = useState(
    'https://www.website.org/',
  );
  const [agencyLogo, setAgencyLogo] = useState<File | string | null>(null); // Can be File for upload or string for URL
  const [agencyLogoPreview, setAgencyLogoPreview] = useState<string | null>(
    null,
  );
  const [displayedComplaintFormUrl, setDisplayedComplaintFormUrl] = useState(
    'https://app.reportwell.io/version-test/complaint/171452428312', // Mock for display
  );
  const [previewComplaintFormPath] = useState('/complaints/123'); // Assumes this route renders PublicComplaintForm.tsx
  const [agencyHomeUrlError, setAgencyHomeUrlError] = useState<string | null>(
    null,
  );
  const [agencyLogoError, setAgencyLogoError] = useState<string | null>(null);

  useEffect(() => {
    if (agencyLogo instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAgencyLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(agencyLogo);
    } else if (typeof agencyLogo === 'string') {
      setAgencyLogoPreview(agencyLogo);
    } else {
      setAgencyLogoPreview(null);
    }
  }, [agencyLogo]);

  const handleLogoDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setAgencyLogoError(null);
      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        const file = event.dataTransfer.files[0];
        if (
          ['image/png', 'image/jpeg', 'image/gif'].includes(file.type) &&
          file.size <= 2 * 1024 * 1024
        ) {
          setAgencyLogo(file);
        } else {
          setAgencyLogoError('File must be a PNG, JPG, GIF up to 2MB');
        }
      }
    },
    [],
  );

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgencyLogoError(null);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (
        ['image/png', 'image/jpeg', 'image/gif'].includes(file.type) &&
        file.size <= 2 * 1024 * 1024
      ) {
        setAgencyLogo(file);
      } else {
        setAgencyLogo(null);
        setAgencyLogoPreview(null);
        setAgencyLogoError('File must be a PNG, JPG, GIF up to 2MB');
      }
    }
  };

  const removeLogo = () => {
    setAgencyLogo(null);
    setAgencyLogoPreview(null);
    setAgencyLogoError(null);
    // Need to also clear the input field value if it's a file input
    const fileInput = document.getElementById(
      'agency-logo-upload',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateAgencyHomeUrl = () => {
    if (!agencyHomeUrl.trim()) {
      setAgencyHomeUrlError('Agency Home URL is required.');
      return false;
    }
    try {
      new URL(agencyHomeUrl); // Check if it's a valid URL
      setAgencyHomeUrlError(null);
      return true;
    } catch {
      setAgencyHomeUrlError('Please enter a valid URL.');
      return false;
    }
  };

  const handleViewComplaintForm = () => {
    const isUrlValid = validateAgencyHomeUrl();
    if (isUrlValid) {
      window.open(previewComplaintFormPath, '_blank'); // Open the local preview path
      // onClose(); // Optionally close modal after viewing
    }
  };

  // Reset state when modal is closed or props change (if we add initial props later)
  useEffect(() => {
    if (!isOpen) {
      // Reset to defaults or initial props when modal closes
      setAgencyHomeUrl('https://www.website.org/');
      setAgencyLogo(null);
      setAgencyLogoPreview(null);
      // Reset displayed URL to its mock default
      setDisplayedComplaintFormUrl(
        'https://app.reportwell.io/version-test/complaint/171452428312',
      );
      setAgencyHomeUrlError(null);
      setAgencyLogoError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay />
      <DialogContent className="sm:max-w-xl bg-white dark:bg-white text-slate-900 p-0">
        <DialogHeader className="border-b border-slate-200 p-4 pr-12">
          <h3 className="text-lg font-semibold text-slate-900">
            Complaint Form Details
          </h3>
          <DialogClose className="absolute top-3 right-3"></DialogClose>
        </DialogHeader>
        <div className="py-6 px-8 space-y-6">
          <div>
            <label
              htmlFor="agencyHomeUrl"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Agency Home URL <span className="text-red-500">*</span>
            </label>
            <Input
              id="agencyHomeUrl"
              type="url"
              value={agencyHomeUrl}
              onChange={(e) => {
                setAgencyHomeUrl(e.target.value);
                if (agencyHomeUrlError) validateAgencyHomeUrl();
              }}
              onBlur={validateAgencyHomeUrl}
              placeholder="https://www.example.com"
              className={cn(
                'text-slate-900 placeholder-slate-400 border-slate-300 focus:border-blue-500 focus:ring-blue-500',
                agencyHomeUrlError &&
                  'border-red-500 focus:border-red-500 focus:ring-red-500',
              )}
            />
            {agencyHomeUrlError && (
              <p className="mt-1 text-xs text-red-600">{agencyHomeUrlError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Agency Logo
            </label>
            {agencyLogoPreview ? (
              <div className="mt-2 p-4 border border-slate-300 rounded-md flex flex-col items-center justify-center">
                <img
                  src={agencyLogoPreview}
                  alt="Agency Logo Preview"
                  className="max-h-32 max-w-full object-contain"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeLogo}
                  className="mt-3 text-slate-700 border-slate-300 hover:bg-slate-50"
                >
                  Remove Logo
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  'mt-2 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md cursor-pointer hover:border-blue-500',
                  agencyLogoError && 'border-red-500',
                )}
                onDrop={handleLogoDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() =>
                  document.getElementById('agency-logo-upload')?.click()
                }
              >
                <div className="space-y-1 text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-slate-400" />
                  <p className="text-sm text-blue-600">
                    <span className="font-medium">
                      Click to upload an image
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">or drag and drop</p>
                  <p className="text-xs text-slate-500">
                    PNG, JPG, GIF up to 2MB (300 x 300px preferred)
                  </p>
                </div>
                <input
                  id="agency-logo-upload"
                  name="agency-logo-upload"
                  type="file"
                  className="sr-only"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleLogoChange}
                />
              </div>
            )}
            {agencyLogoError && (
              <p className="mt-1 text-xs text-red-600">{agencyLogoError}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="complaintFormUrl"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Complaint Form URL
            </label>
            <div className="relative">
              <Input
                id="complaintFormUrl"
                type="text"
                value={displayedComplaintFormUrl}
                readOnly
                className="pr-10 bg-slate-100 text-slate-700 border-slate-300"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText(displayedComplaintFormUrl)
                  }
                  className="text-slate-500 hover:text-slate-700"
                  title="Copy to clipboard"
                >
                  <ClipboardDocumentIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="border-t border-slate-200 p-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={onClose}
              className="text-slate-700 border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="default"
            onClick={handleViewComplaintForm}
            className="ml-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            View Complaint Form
            <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintFormSettingsModal;
