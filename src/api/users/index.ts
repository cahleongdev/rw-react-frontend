/**
 * Users API
 * @description This is the API for users and user management
 */

import axiosInstance from '../axiosInstance';

const usersAPI = {
  getAgencyUsers: async () => {
    const response = await axiosInstance.get('/users/agency_admin/');
    return response.data;
  },
  getSuperAdminUsers: async () => {
    const response = await axiosInstance.get('/users/super_admin/');
    return response.data;
  },
};

export default usersAPI;
