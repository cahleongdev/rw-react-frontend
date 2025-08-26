import axiosInstance from '@/api/axiosInstance';
import { IBoardMemberDetail } from '@/store/slices/schoolSlice';

const BoardMembersAPI = {
  createBoardMember: async (data: Partial<IBoardMemberDetail>) => {
    try {
      const res = await axiosInstance.post('/board_members/', data);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getBoardMemberList: async () => {
    try {
      const res = await axiosInstance.get('/board_members/');
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getBoardMemberDetail: async (id: string) => {
    try {
      const res = await axiosInstance.get(`/board_members/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getBoardMemberListBySchool: async (schoolId: string) => {
    try {
      const res = await axiosInstance.get(`/board_members/schools/${schoolId}`);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  updateBoardMember: async (id: string, data: Partial<IBoardMemberDetail>) => {
    try {
      const res = await axiosInstance.put(`/board_members/${id}`, data);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  assignBoardMemberToSchool: async (
    boardMemberId: string,
    schoolId: string,
  ) => {
    try {
      const res = await axiosInstance.post(
        `/board_members/${boardMemberId}/schools/`,
        { id: schoolId },
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default BoardMembersAPI;
