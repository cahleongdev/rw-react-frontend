import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import UploadProfilePictureComponent from '@components/Shared/UploadProfilePicture';
import { RootState, AppDispatch } from '@store/index';
import { updatePersonalProfile } from '@store/slices/authSlice';
import useFileUpload from '@hooks/useFileUpload';

import { STORAGE_PATH } from '../index.constants';

interface UploadProfilePictureProps {
  open: boolean;
  onClose: () => void;
}

const UploadProfilePicture: React.FC<UploadProfilePictureProps> = ({
  open,
  onClose,
}: UploadProfilePictureProps) => {
  const { uploadFile, isUploading } = useFileUpload();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const handleUpload = async (file: File) => {
    if (file) {
      const filename = await uploadFile(file, undefined, 'avatar');

      try {
        dispatch(
          updatePersonalProfile({
            profile_image: STORAGE_PATH + filename,
          }),
        ).unwrap();
        toast.success('Profile picture updated successfully');
        onClose();
      } catch (error) {
        console.error(error);
        toast.error('Failed to update profile picture');
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

export default UploadProfilePicture;
