import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/store';
import {
  setReports,
  setLoading as setReportsLoading,
} from '@/store/slices/reportsSlice';
import { AssignedReport as AssignedReportType } from '@/store/slices/assignedReportsSlice';
import { getReports, assignReportsToSchool } from '@/api/reportsApi';

import { ReportResponse } from '@/containers/Reports/index.types';

import {
  AssignReports as AssignReportsComponent,
  Report,
} from '@/components/Schools/AssignReports';

interface AssignReportsProps {
  open: boolean;
  onClose: () => void;
  entityId: string;
  onSubmit?: (selectedReportIds: string[]) => void;
}

export const AssignReports: React.FC<AssignReportsProps> = ({
  open,
  onClose,
  entityId,
  onSubmit,
}) => {
  const [reportSearchText, setReportSearchText] = useState('');
  const dispatch = useDispatch();
  const reduxReportsRaw = useSelector(
    (state: RootState) => state.reports.reports,
  );
  const reduxReports = useMemo(
    () => (Array.isArray(reduxReportsRaw) ? reduxReportsRaw : []),
    [reduxReportsRaw],
  );
  const mapToLight = (arr: ReportResponse[]): Report[] =>
    arr.map((r) => ({ id: r.id, name: r.name }));

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetchedInitialReports, setHasFetchedInitialReports] =
    useState(false);

  // Already‑assigned report ids
  const assignedReportsRaw = useSelector(
    (state: RootState) => state.assignedReports.reportsBySchool[entityId],
  );

  // Derive light reports lists
  const lightReports = useMemo(() => mapToLight(reduxReports), [reduxReports]);
  const selectedReports = useMemo(
    () => lightReports.filter((r) => selectedIds.includes(r.id)),
    [lightReports, selectedIds],
  );
  const availableReports = useMemo(
    () => lightReports.filter((r) => !selectedIds.includes(r.id)),
    [lightReports, selectedIds],
  );

  // Reset state when dialog opens/closes or schoolId changes
  useEffect(() => {
    if (open) {
      // Calculate the IDs from the raw data within the effect
      const newAssignedIds =
        assignedReportsRaw?.map(
          (ar: AssignedReportType) => ar.reportId || ar.id,
        ) ?? [];

      // Only update state if the IDs have actually changed
      setSelectedIds((currentIds) => {
        const currentSet = new Set(currentIds);
        const newSet = new Set(newAssignedIds);
        if (
          currentSet.size !== newSet.size ||
          !newAssignedIds.every((id) => currentSet.has(id))
        ) {
          return newAssignedIds; // Return the new array if different
        }
        return currentIds; // Return the existing state if identical
      });

      setReportSearchText('');
    } else {
      setSelectedIds([]); // Clear selections on close
      setReportSearchText('');
      setHasFetchedInitialReports(false); // Reset fetch status when dialog closes
    }
    // Depend on the raw data source and other stable dependencies
  }, [open, entityId, assignedReportsRaw]);

  // useEffect when open changes to fetch if reduxReports empty
  useEffect(() => {
    const fetchReports = async () => {
      // Only fetch if reports are empty AND we haven't tried fetching yet
      if (reduxReports.length === 0 && !hasFetchedInitialReports) {
        setHasFetchedInitialReports(true); // Mark that we've started fetching
        try {
          dispatch(setReportsLoading(true));
          const { data } = await getReports();
          dispatch(setReports(data));
        } catch (err) {
          console.error('Error fetching reports list:', err);
        } finally {
          dispatch(setReportsLoading(false));
        }
      }
    };
    fetchReports();
  }, [reduxReports, dispatch, hasFetchedInitialReports, open]);

  const handleAssign = (report: Report) => {
    if (!selectedIds.includes(report.id)) {
      setSelectedIds((prev) => [...prev, report.id]);
    }
  };

  const handleUnassign = (report: Report) => {
    setSelectedIds((prev) => prev.filter((id) => id !== report.id));
  };

  const handleSelectAll = () => {
    const filteredAvailable = availableReports.filter((report) =>
      report.name.toLowerCase().includes(reportSearchText.toLowerCase()),
    );
    setSelectedIds((prev) => [
      ...prev,
      ...filteredAvailable.map((r) => r.id).filter((id) => !prev.includes(id)),
    ]);
  };

  const handleRemoveAll = () => {
    setSelectedIds([]);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await assignReportsToSchool(entityId, selectedIds);

      onSubmit?.(selectedIds);
    } catch (err) {
      console.error('Error assigning reports:', err);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  // Filter available reports based on search text
  const filteredAvailableReports = availableReports.filter((report) =>
    report.name.toLowerCase().includes(reportSearchText.toLowerCase()),
  );

  return (
    <AssignReportsComponent
      open={open}
      onOpenChange={onClose}
      reportSearchText={reportSearchText}
      onSearchChange={(e) => setReportSearchText(e.target.value)}
      availableReports={filteredAvailableReports}
      selectedReports={selectedReports}
      loading={loading}
      onAssign={handleAssign}
      onUnassign={handleUnassign}
      onSelectAll={handleSelectAll}
      onRemoveAll={handleRemoveAll}
      onSubmit={handleSubmit}
    />
  );
};
