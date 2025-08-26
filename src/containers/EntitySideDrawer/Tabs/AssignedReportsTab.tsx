import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { AppDispatch } from '@/store';

import axiosInstance from '@api/axiosInstance';

import { AssignedReportsSection } from '@components/EntitySideDrawer/AssignedReportsSection';
import { DataLoading } from '@/components/base/Loading';
import { RootState } from '@/store';
import { AssignedReport, AssignedReportItem, EntityType } from '../index.types';
import { setForSchool } from '@/store/slices/assignedReportsSlice';

interface AssignedReportsTabProps {
  entityId?: string;
  entityType: EntityType;
  onAssignReportsClick: () => void;
}

const AssignedReportsTab: React.FC<AssignedReportsTabProps> = ({
  entityId,
  entityType,
  onAssignReportsClick,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const assignedReportsBySchool = useSelector(
    (state: RootState) => state.assignedReports.reportsBySchool,
  );

  const allSchools = useSelector((state: RootState) => state.schools.schools);

  // Get user for user entity types
  const user = useSelector((state: RootState) => {
    if (entityType === EntityType.AgencyUser && entityId) {
      return state.agency.users.find((u) => u.id === entityId);
    } else if (entityType === EntityType.SchoolUser && entityId) {
      return state.schoolUsers.schoolUsers.find((u) => u.id === entityId);
    }
    return null;
  });

  const assignedReports = useMemo(() => {
    if (
      (entityType === EntityType.AgencyUser ||
        entityType === EntityType.SchoolUser) &&
      user
    ) {
      if (!user.schools || !assignedReportsBySchool) return [];
      const combined: AssignedReport[] = [];
      user.schools.forEach((schoolId: string) => {
        const schoolReports = assignedReportsBySchool[schoolId] || [];
        const schoolName =
          allSchools.find((s) => s.id === schoolId)?.name || 'Unknown School';
        schoolReports.forEach((report) => {
          combined.push({
            ...report,
            schoolId: schoolId,
            schoolName: schoolName,
          });
        });
      });
      return combined;
    }
    if (
      (entityType === EntityType.School || entityType === EntityType.Network) &&
      entityId
    ) {
      const school = allSchools.find((s) => s.id === entityId);
      const schoolReports = assignedReportsBySchool[entityId] || [];
      return schoolReports.map((report) => ({
        ...report,
        schoolId: entityId,
        schoolName: school?.name || 'Unknown School',
      }));
    }

    // if the network assigned reports are contains the school assigned reports, then we should return the network assigned reports

    // if (entityType === EntityType.Network && entityId) {
    //   const network = allSchools.find(
    //     (s) => s.id === entityId && s.type === 'Network',
    //   );
    //   const networkSchools =
    //     network && 'schools' in network && Array.isArray(network.schools)
    //       ? network.schools
    //       : [];

    //   const combined: AssignedReport[] = [];
    //   networkSchools.forEach((school) => {
    //     const schoolReports = assignedReportsBySchool[school.id] || [];
    //     schoolReports.forEach((report) => {
    //       combined.push({
    //         ...report,
    //         schoolId: school.id,
    //         schoolName: school.name,
    //       });
    //     });
    //   });
    //   return combined;
    // }
    return [];
  }, [entityType, user, entityId, assignedReportsBySchool, allSchools]);

  const handleOpenReport = (reportId: string) => {
    if (reportId?.startsWith('temp-')) return;
    navigate(`/reports/preview/${reportId}`);
  };

  const transformAssigned = (apiArr: AssignedReportItem[]): AssignedReport[] =>
    apiArr.map((item: AssignedReportItem) => ({
      id: item.id,
      reportId: item.report?.id || item.id,
      name: item.report?.name || 'Unnamed report',
      status: item.status === 'completed' ? 'Complete' : 'Pending',
      schoolId: '',
      schoolName: '',
    }));

  useEffect(() => {
    const loadAssignedReports = async () => {
      if (
        (entityType !== EntityType.School &&
          entityType !== EntityType.Network) ||
        !entityId
      )
        return;
      if (assignedReportsBySchool[entityId]?.length > 0) return;
      console.log(assignedReportsBySchool);
      try {
        const { data } = await axiosInstance.get(
          `/schools/${entityId}/reports/`,
        );
        const transformed = transformAssigned(data);
        dispatch(setForSchool({ schoolId: entityId, reports: transformed }));
      } catch (err) {
        console.error('Error fetching assigned reports:', err);
      }
    };
    loadAssignedReports();
  }, [entityId, entityType, assignedReportsBySchool, dispatch]);

  // Loading state
  if (
    (entityType === EntityType.AgencyUser ||
      entityType === EntityType.SchoolUser) &&
    !user
  ) {
    return <DataLoading />;
  }
  if (
    (entityType === EntityType.School || entityType === EntityType.Network) &&
    !entityId
  ) {
    return <DataLoading />;
  }

  return (
    <AssignedReportsSection
      entityType={entityType}
      assignedReports={assignedReports}
      onOpenReport={handleOpenReport}
      onAssignReportsClick={onAssignReportsClick}
    />
  );
};

export default AssignedReportsTab;
