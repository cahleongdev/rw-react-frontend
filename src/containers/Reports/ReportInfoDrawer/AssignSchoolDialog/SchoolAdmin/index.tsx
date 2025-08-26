import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { School } from '@/store/slices/schoolsSlice';

import { AppDispatch, RootState } from '@/store';
import { updateReportOnServer } from '@/store/slices/reportsSlice';

import AssignSchoolDialogComponent from '@/components/Reports/ReportInfoDrawer/AssignSchoolDialog/School';

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
  const [assignedSchoolsState, setAssignedSchoolsState] = useState<School[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const reports = useSelector((state: RootState) => state.reports.reports);
  const storeSchools = useSelector((state: RootState) => state.schools.schools);
  const [unassignedSchools, setUnassignedSchools] = useState<School[]>([]);

  const fetchSchoolsAndAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const report = reports.find((r) => r.id === reportId);
      const currentSchools = storeSchools;

      if (report && report.assigned_schools) {
        const initiallyAssigned = currentSchools.filter((schoolFromStore) =>
          report.assigned_schools.some(
            (assignedRef: School) => assignedRef.id === schoolFromStore.id,
          ),
        );
        setAssignedSchoolsState(initiallyAssigned);

        setUnassignedSchools(
          currentSchools.filter(
            (schoolFromStore) =>
              !initiallyAssigned.some(
                (assigned) => assigned.id === schoolFromStore.id,
              ),
          ),
        );
      } else {
        setAssignedSchoolsState([]);
        setUnassignedSchools(currentSchools);
      }
    } finally {
      setLoading(false);
    }
  }, [reports, storeSchools, reportId]);

  useEffect(() => {
    if (open) {
      fetchSchoolsAndAssignments();
      setSearchText('');
    }
  }, [open, fetchSchoolsAndAssignments]);

  const handleAssign = (school: School) => {
    if (!assignedSchoolsState.some((r) => r.id === school.id)) {
      setAssignedSchoolsState((prev) => [...prev, school]);
      setUnassignedSchools((prev) =>
        prev.filter((unassigned) => unassigned.id !== school.id),
      );
    }
  };

  const handleUnassign = (school: School) => {
    setAssignedSchoolsState((prev) =>
      prev.filter((assigned) => assigned.id !== school.id),
    );
    if (!unassignedSchools.some((s) => s.id === school.id)) {
      setUnassignedSchools((prev) => [...prev, school]);
    }
  };

  const handleSelectAll = () => {
    setAssignedSchoolsState((prev) => [...prev, ...unassignedSchools]);
    setUnassignedSchools([]);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await dispatch(
        updateReportOnServer({
          id: reportId,
          updates: { assigned_schools: assignedSchoolsState },
        }),
      ).unwrap();

      if (onSubmit) {
        onSubmit();
      }
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

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
      assignedSchools={assignedSchoolsState}
      handleAssign={handleAssign}
      setUnassignedSchools={setUnassignedSchools}
      setAssignedSchools={setAssignedSchoolsState}
      handleUnassign={handleUnassign}
      handleSelectAll={handleSelectAll}
      unassignedSchools={unassignedSchools}
      loading={loading}
      handleSubmit={handleSubmit}
    />
  );
};

export default AssignSchoolDialog;
