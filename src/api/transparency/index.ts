import axios from '@/api/axiosInstance';

import {
  TransparencySchool,
  TransparencyContactDetail,
  TransparencyLinkFields,
} from '@containers/Transparency/index.types';

export const updateSchoolTransparencyDetails = async (
  schoolData: TransparencySchool,
) => {
  const response = await axios.put(
    `transparency/schools/${schoolData.id}/`,
    schoolData,
  );
  return response.data;
};

export const fetchTransparencySchoolsDetails = async (agencyId: string) => {
  const response = await axios.get(`transparency/schools/${agencyId}/`);
  return response.data;
};

export const fetchTransparencyDetails = async (agencyId: string) => {
  const response = await axios.get(`/transparency/details/${agencyId}`);
  return response.data;
};

export const updateTransparencyDetails = async (
  formData: TransparencyContactDetail | TransparencyLinkFields,
) => {
  const response = await axios.put('transparency/details/', formData);
  return response.data;
};
