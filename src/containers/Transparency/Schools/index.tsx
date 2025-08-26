import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { TransparencySchool } from '@containers/Transparency/index.types';

import {
  updateSchoolTransparencyDetails,
  fetchTransparencySchoolsDetails,
} from '@api/transparency/index';

import { RootState } from '@/store';
import { School, updateSchool } from '@store/slices/schoolsSlice';

import TransparencySchoolsComponent from '@components/Transparency/Schools';

const TransparencySchoolsContainer = () => {
  const dispatch = useDispatch();
  const { user, schools, schoolsLoading } = useSelector((state: RootState) => ({
    user: state.auth.user,
    schools: state.schools.schools,
    schoolsLoading: state.schools.loading,
  }));
  const [
    showEditSchoolTransparencyDetails,
    setShowEditSchoolTransparencyDetails,
  ] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transparencySchools, setTransparencySchools] = useState<
    TransparencySchool[]
  >([]);

  const [selectedSchool, setSelectedSchool] =
    useState<TransparencySchool | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onEditSchoolSubmit = async (
    formData: Omit<TransparencySchool, 'id'>,
  ) => {
    if (!selectedSchool) return;
    try {
      const responseData = await updateSchoolTransparencyDetails({
        ...formData,
        id: selectedSchool.id,
      });

      dispatch(updateSchool({ id: selectedSchool.id, updates: responseData }));

      setSelectedSchool(null);

      if (responseData.founded_at) {
        responseData.founded_at = new Date(responseData.founded_at)
          .getFullYear()
          .toString();
      }

      setTransparencySchools(
        transparencySchools.map((school) =>
          school.id === selectedSchool.id
            ? { ...school, ...responseData }
            : school,
        ),
      );

      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error updating school', error);
    }

    setShowEditSchoolTransparencyDetails(false);
  };

  const fetchTransparencySchools = async () => {
    if (!user?.agency) return;
    setLoading(true);
    const responseData = await fetchTransparencySchoolsDetails(user.agency);

    const old_school_map = new Map<string, School>();
    const school_map = new Map<string, TransparencySchool>();

    schools.forEach((school: School) => {
      old_school_map.set(school.id, school);
    });

    responseData.forEach((transparencySchool: TransparencySchool) => {
      const existingSchool = old_school_map.get(transparencySchool.id);

      if (existingSchool) {
        school_map.set(transparencySchool.id, {
          id: existingSchool.id,
          name: existingSchool.name,
          address: existingSchool.address,
          gradeserved: existingSchool.gradeserved,
          founded_at: transparencySchool.founded_at
            ? new Date(transparencySchool.founded_at).getFullYear().toString()
            : '',
          contract_expires: transparencySchool.contract_expires,
          contact_phone_number: transparencySchool.contact_phone_number,
          website_url: transparencySchool.website_url,
          logo: transparencySchool.logo,
        });
      }
    });

    setTransparencySchools(Array.from(school_map.values()));
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);

    fetchTransparencySchools().finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <TransparencySchoolsComponent
      schools={transparencySchools}
      loading={loading || schoolsLoading}
      setLoading={setLoading}
      onEditSchoolSubmit={onEditSchoolSubmit}
      showEditSchoolTransparencyDetails={showEditSchoolTransparencyDetails}
      setShowEditSchoolTransparencyDetails={
        setShowEditSchoolTransparencyDetails
      }
      selectedSchool={selectedSchool}
      setSelectedSchool={setSelectedSchool}
      previewUrl={previewUrl}
      setPreviewUrl={setPreviewUrl}
      selectedFile={selectedFile}
      setSelectedFile={setSelectedFile}
    />
  );
};

export default TransparencySchoolsContainer;
