import React, { useState, useEffect } from 'react';

import { TransparencyDetail } from '@containers/Transparency/index.types';
import { STORAGE_PATH } from '@containers/Settings/index.constants';

import EditAgencyLogo from '@components/Transparency/Details/EditAgencyLogo';

import { useFileUpload } from '@hooks/index';

interface EditAgencyLogoContainerProps {
  open: boolean;
  onSubmit: (formData: TransparencyDetail) => void;
  onClose: () => void;
  transparencyDetail: TransparencyDetail;
  setTransparencyDetail: (formData: TransparencyDetail) => void;
}

const EditAgencyLogoContainer: React.FC<EditAgencyLogoContainerProps> = ({
  open,
  onSubmit,
  onClose,
  transparencyDetail,
  setTransparencyDetail,
}) => {
  const { uploadFile } = useFileUpload();
  const [internalDetail, setInternalDetail] =
    useState<TransparencyDetail>(transparencyDetail);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    transparencyDetail.logo_url || null,
  );
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setInternalDetail(transparencyDetail);
    setPreviewUrl(transparencyDetail.logo_url || null);
    setSelectedFile(null);
  }, [transparencyDetail, open]);

  const handleInternalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;

    setIsUploading(true);
    const detailToSubmit = { ...internalDetail };

    if (selectedFile) {
      try {
        const fileUrl = await uploadFile(selectedFile, undefined, 'avatar');
        detailToSubmit.logo_url = STORAGE_PATH + fileUrl;
        setTransparencyDetail(detailToSubmit);
      } catch (error) {
        console.error('Error uploading file:', error);
        setIsUploading(false);
        return;
      }
    } else if (detailToSubmit.logo_url === '' && transparencyDetail.logo_url) {
      // Logo was removed, no new one selected.
    }

    onSubmit(detailToSubmit);
    setIsUploading(false);
  };

  const handleSelectedFile = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setInternalDetail((prev) => ({ ...prev, logo_url: '' }));
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleClose = () => {
    setInternalDetail(transparencyDetail);
    setPreviewUrl(transparencyDetail.logo_url || null);
    setSelectedFile(null);
    onClose();
  };

  return (
    <EditAgencyLogo
      open={open}
      onClose={handleClose}
      handleSubmit={handleInternalSubmit}
      transparencyDetail={internalDetail}
      previewUrl={previewUrl}
      handleSelectedFile={handleSelectedFile}
      handleRemoveLogo={handleRemoveLogo}
    />
  );
};

export default EditAgencyLogoContainer;
