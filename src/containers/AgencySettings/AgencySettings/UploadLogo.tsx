import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import UploadProfilePictureComponent from '@/components/Shared/UploadProfilePicture';
import { RootState, AppDispatch } from '@/store/index';
import { updateAgency } from '@store/slices/agencySlice';
import useFileUpload from '@/hooks/useFileUpload';
import { STORAGE_PATH } from '@/containers/Settings/index.constants';

interface UploadLogoProps {
  open: boolean;
  onClose: () => void;
  agencyId: string;
}

const UploadLogo: React.FC<UploadLogoProps> = ({
  open,
  onClose,
  agencyId,
}: UploadLogoProps) => {
  const { uploadFile, isUploading } = useFileUpload();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const handleUpload = async (file: File) => {
    if (file && agencyId) {
      const filename = await uploadFile(file, undefined, 'avatar');
      const logoUrl = STORAGE_PATH + filename;
      try {
        await dispatch(
          updateAgency({
            agencyId,
            updates: { logo_url: logoUrl },
          }),
        ).unwrap();
        toast.success('Agency logo updated successfully');
        onClose();
      } catch (error) {
        console.error(error);
        toast.error('Failed to update agency logo');
      }
    }
  };

  return (
    <UploadProfilePictureComponent
      open={open}
      onClose={onClose}
      isLoading={isLoading || isUploading}
      onSave={handleUpload}
    />
  );
};

export default UploadLogo;
