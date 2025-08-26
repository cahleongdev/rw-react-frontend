import axiosInstance from '@/api/axiosInstance';

const schoolsAPI = {
  // Used for school selector dropdown for school admin
  getSchools: async () => {
    try {
      const res = await axiosInstance.get('/schools');
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  postBulkImport: async (entity: string, data: any[]) => {
    try {
      const res = await axiosInstance.post('/schools/agency_admin/bulk', {
        entity,
        data,
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getAgencyAdmin: async () => {
    try {
      const res = await axiosInstance.get('/schools/agency_admin');
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default schoolsAPI;
