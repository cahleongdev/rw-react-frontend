import React, { useState, useEffect } from 'react';
import { z } from 'zod';

import { STORAGE_PATH } from '@/containers/Settings/index.constants';
import {
  TransparencySchool,
  TransparencySchoolSchema,
} from '@containers/Transparency/index.types';

import useFileUpload from '@hooks/useFileUpload';

import EditSchoolTransparencyDetailsComponent from '@components/Transparency/Schools/EditSchoolTransparencyDetails';
import { Loading } from '@components/base/Loading';

interface EditSchoolTransparencyDetailsProps {
  open: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onSubmit: (formData: Omit<TransparencySchool, 'id'>) => void;
  onClose: () => void;
  school: TransparencySchool;
  previewUrl: string | null;
  setPreviewUrl: (previewUrl: string | null) => void;
  selectedFile: File | null;
  setSelectedFile: (selectedFile: File | null) => void;
}

const EditSchoolTransparencyDetails: React.FC<
  EditSchoolTransparencyDetailsProps
> = ({
  loading,
  setLoading,
  open,
  onSubmit,
  onClose,
  school,
  previewUrl,
  setPreviewUrl,
  selectedFile,
  setSelectedFile,
}: EditSchoolTransparencyDetailsProps) => {
  const [gradeServed, setGradeServed] = useState(school.gradeserved || []);
  const [uploadedFileCount, setUploadedFileCount] = useState(0);
  const { uploadFile } = useFileUpload();

  useEffect(() => {
    setGradeServed(school.gradeserved || []);
  }, [school.gradeserved, school]);

  const handleFormSubmit = async (
    formData: z.infer<typeof TransparencySchoolSchema>,
  ) => {
    setLoading(true);
    if (uploadedFileCount > 0 && selectedFile) {
      try {
        const fileUrl = await uploadFile(selectedFile, undefined, 'avatar');
        const updatedFormData = {
          ...school,
          ...formData,
          logo: STORAGE_PATH + fileUrl,
          founded_at: formData.founded_at || undefined,
          contract_expires: formData.contract_expires || undefined,
          contact_phone_number: formData.contact_phone_number || undefined,
          website_url: formData.website_url || undefined,
        };
        onSubmit(updatedFormData);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      onSubmit({
        ...school,
        ...formData,
        logo: school.logo || undefined,
        founded_at: formData.founded_at || undefined,
        contract_expires: formData.contract_expires || undefined,
        contact_phone_number: formData.contact_phone_number || undefined,
        website_url: formData.website_url || undefined,
      });
    }
    setLoading(false);
  };

  const handleFileSelection = (files: File[]) => {
    if (files.length) {
      const file = files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setUploadedFileCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!open || (school.logo === '' && !previewUrl)) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadedFileCount(0);
    }
  }, [open, school.logo, previewUrl, setPreviewUrl, setSelectedFile]);

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <Loading />
      ) : (
        <EditSchoolTransparencyDetailsComponent
          open={open}
          onClose={onClose}
          school={school}
          onFileSelected={handleFileSelection}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
          onFormSubmit={handleFormSubmit}
          gradeServed={gradeServed}
          setGradeServed={setGradeServed}
        />
      )}
    </div>
  );
};

export default EditSchoolTransparencyDetails;
