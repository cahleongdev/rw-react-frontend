import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState, AppDispatch } from '@/store';
import { School, setLoading, setSchools } from '@/store/slices/schoolsSlice';
import { setSelectedSchoolIdForAdmin } from '@/store/slices/uiStateSlice';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select'; // Assuming Select component exists

import schoolsAPI from '@/api/schools';

export const SchoolSelectorDropdown: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Select necessary data individually
  const user = useSelector((state: RootState) => state.auth.user);
  const allSchools = useSelector((state: RootState) => state.schools.schools);
  const selectedSchoolId = useSelector(
    (state: RootState) => state.uiState.selectedSchoolIdForAdmin,
  );
  const isLoadingSchools = useSelector(
    (state: RootState) => state.schools.loading,
  );

  // Derive the list of schools assigned to the user
  const assignedSchools = useMemo(() => {
    if (!user?.schools || allSchools.length === 0) {
      return [];
    }
    const schoolIds = user.schools;
    return allSchools.filter((school): school is School =>
      schoolIds.includes(school.id),
    );
  }, [user?.schools, allSchools]);

  // Fetch schools if list is empty
  useEffect(() => {
    const fetchAllSchoolsIfNeeded = async () => {
      if (allSchools.length === 0 && !isLoadingSchools) {
        console.log('SchoolSelectorDropdown: Fetching all schools...');
        dispatch(setLoading(true));
        try {
          const response = await schoolsAPI.getSchools();
          dispatch(setSchools(response.results || response || []));
        } catch (error) {
          console.error(
            'SchoolSelectorDropdown: Error fetching schools:',
            error,
          );
        } finally {
          dispatch(setLoading(false));
        }
      }
    };
    fetchAllSchoolsIfNeeded();
  }, [dispatch, allSchools.length, isLoadingSchools]);

  // Set initial selected school ID if none is set and user has schools
  useEffect(() => {
    if (!selectedSchoolId && assignedSchools.length > 0) {
      dispatch(setSelectedSchoolIdForAdmin(assignedSchools[0].id));
    }
    // Optional: If user's schools change and selected ID is no longer valid, reset
    // else if (selectedSchoolId && !assignedSchools.some(s => s.id === selectedSchoolId)) {
    //    dispatch(setSelectedSchoolIdForAdmin(assignedSchools[0]?.id || null));
    // }
  }, [selectedSchoolId, assignedSchools, dispatch]);

  const handleSelectionChange = (value: string) => {
    // The value from SelectItem will be the school ID
    dispatch(setSelectedSchoolIdForAdmin(value));
  };

  return (
    <div className="ml-4">
      {' '}
      {/* Add some margin if needed */}
      <Select
        value={selectedSchoolId || ''}
        onValueChange={handleSelectionChange}
      >
        <SelectTrigger className="w-auto min-w-[180px] h-9 border-slate-300 bg-white">
          <SelectValue placeholder="Select School..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {assignedSchools.map((school) => (
              <SelectItem key={school.id} value={school.id}>
                {school.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
