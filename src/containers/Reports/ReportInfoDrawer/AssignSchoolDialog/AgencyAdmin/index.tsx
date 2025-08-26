import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import axios from '@/api/axiosInstance';

import { School, SchoolResponse } from '@/store/slices/schoolsSlice';

import { RootState, AppDispatch } from '@/store';
import { setSchools, setTotalItems } from '@/store/slices/schoolsSlice';
import { updateReportOnServer } from '@/store/slices/reportsSlice';

import AssignSchoolDialogComponent from '@/components/Reports/ReportInfoDrawer/AssignSchoolDialog/Agency';

interface AssignSchoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  onSubmit?: () => void;
}

const AssignSchoolDialog: React.FC<AssignSchoolDialogProps> = ({
  open,
  onOpenChange,
  reportId,
  onSubmit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchText, setSearchText] = useState('');
  const [assignedSchools, setAssignedSchools] = useState<SchoolResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const reports = useSelector((state: RootState) => state.reports.reports);
  const storeSchools = useSelector((state: RootState) => state.schools.schools);
  const [unassignedSchools, setUnassignedSchools] = useState<SchoolResponse[]>(
    [],
  );

  // Function to fetch schools data
  const fetchSchools = async () => {
    try {
      setLoading(true);

      const report = reports.find((r) => r.id === reportId);

      console.log(report, storeSchools);

      // Use schools from Redux store if available, otherwise fetch them
      let schools = storeSchools;
      if (schools.length === 0) {
        const schoolsResponse = await axios.get<School[]>(
          '/schools/agency_admin/',
        );
        schools = schoolsResponse.data;

        // Store schools in Redux for future use
        dispatch(setSchools(schools));
        dispatch(setTotalItems(schools.length));
      }

      const assignedSchools = schools.filter((school: SchoolResponse) =>
        report?.assigned_schools.some(
          (assignedSchool: School) => assignedSchool.id === school.id,
        ),
      );

      setAssignedSchools(assignedSchools);

      // Set unassigned schools - schools that aren't in the assigned list
      setUnassignedSchools(
        schools.filter(
          (school: SchoolResponse) =>
            !assignedSchools.some((r: SchoolResponse) => r.id === school.id),
        ),
      );
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch schools when dialog opens
  useEffect(() => {
    if (open) {
      fetchSchools();
      setSearchText('');
    }
  }, [open, reportId]);

  // Handle assigning a school
  const handleAssign = (school: SchoolResponse) => {
    if (!assignedSchools.some((r) => r.id === school.id)) {
      setAssignedSchools((prev) => [...prev, school]);
      setUnassignedSchools((prev) =>
        prev.filter((unassigned) => unassigned.id !== school.id),
      );
    }
  };

  // Handle unassigning a school
  const handleUnassign = (school: SchoolResponse) => {
    setAssignedSchools((prev) =>
      prev.filter((assigned) => assigned.id !== school.id),
    );
    setUnassignedSchools((prev) => [...prev, school]);
  };

  // Handle selecting all schools
  const handleSelectAll = () => {
    setAssignedSchools((prev) => [...prev, ...unassignedSchools]);
    setUnassignedSchools([]);
  };

  // Handle submitting the changes using the new API endpoint
  const handleSubmit = async () => {
    if (!reportId) {
      console.error('Report ID is missing, cannot assign schools.');
      return;
    }
    try {
      setLoading(true);

      // Get all school IDs that should be assigned to the report
      const schoolIds = assignedSchools.map((school) => school.id);

      // Use the new API endpoint for assigning schools
      await axios.post('/reports/schools/assign/', {
        report_id: reportId,
        school_ids: schoolIds,
      });

      // Create properly formatted assigned_schools array for Redux
      const formattedAssignedSchools: School[] = assignedSchools.map(
        (school: School) => school,
      );

      // Update the report in Redux store with the new assigned schools
      await dispatch(
        updateReportOnServer({
          id: reportId,
          updates: {
            assigned_schools: formattedAssignedSchools,
          },
        }),
      ).unwrap();

      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit();
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Failed to assign schools:', error);
      // TODO: Display error to user
    } finally {
      setLoading(false);
    }
  };

  // Filter schools based on search text
  const filteredSchools = unassignedSchools.filter((school) =>
    school.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <AssignSchoolDialogComponent
      open={open}
      onOpenChange={onOpenChange}
      searchText={searchText}
      setSearchText={setSearchText}
      filteredSchools={filteredSchools}
      assignedSchools={assignedSchools}
      handleAssign={handleAssign}
      setUnassignedSchools={setUnassignedSchools}
      setAssignedSchools={setAssignedSchools}
      handleUnassign={handleUnassign}
      handleSelectAll={handleSelectAll}
      unassignedSchools={unassignedSchools}
      loading={loading}
      handleSubmit={handleSubmit}
    />
  );
};

export default AssignSchoolDialog;
