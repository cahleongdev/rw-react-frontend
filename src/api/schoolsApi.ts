import axiosInstance from './axiosInstance';
import { School } from '@/store/slices/schoolsSlice'; // Assuming School type is needed and defined here

/**
 * Fetches all schools for an agency admin.
 */
export const fetchAllAgencyAdminSchools = async (): Promise<School[]> => {
  try {
    const response = await axiosInstance.get<School[]>(
      '/schools/agency_admin/',
    );
    return response.data || [];
  } catch (error) {
    console.error('Error fetching agency admin schools:', error);
    throw error;
  }
};

/**
 * Fetches full details for a specific school.
 */
export const fetchSchoolDetails = async (
  schoolId: string,
): Promise<School | null> => {
  if (!schoolId) {
    console.error('fetchSchoolDetails: schoolId is required');
    return null;
  }
  try {
    const response = await axiosInstance.get<School>(`/schools/${schoolId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching school details for ${schoolId}:`, error);
    throw error;
  }
};

/**
 * Updates board meeting dates for a school.
 */
export const updateSchoolBoardMeetings = async (
  schoolId: string,
  boardMeetings: string[],
): Promise<School> => {
  if (!schoolId) {
    throw new Error('updateSchoolBoardMeetings: schoolId is required');
  }
  try {
    const response = await axiosInstance.put<School>(`/schools/${schoolId}/`, {
      board_meetings: boardMeetings,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error updating board meetings for school ${schoolId}:`,
      error,
    );
    throw error;
  }
};
