import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Loading } from '@/components/base/Loading';
import SchoolsTable from '@/components/Schools/AgencyAdmin/SchoolsTable';

import { RootState } from '@/store';
import { SchoolResponse, Network } from '@/store/slices/schoolsSlice';
import { useDrawerNavigation } from '@/contexts/DrawerNavigationContext';

import {
  EntitySideDrawerTabIds,
  EntityType,
} from '@containers/EntitySideDrawer/index.types';

interface SchoolsContainerProps {
  searchText: string;
  sortOrder: 'a-z' | 'z-a';
  type: string;
  status: string;
  selectedRows: string[];
  onRowSelect: (schoolId: string, checked: boolean) => void;
  onSelectAll: () => void;
  onEditClick: (e: React.MouseEvent, school: SchoolResponse) => void;
}

// Type guard to check if an entity is a Network
const isNetwork = (entity: SchoolResponse): entity is Network => {
  return entity.type === 'Network';
};

// Extend SchoolResponse to include the new DisplaySchool type
export type DisplaySchoolResponse = SchoolResponse & {
  parentNetworkName?: string;
};

const SchoolsContainer: React.FC<SchoolsContainerProps> = ({
  searchText,
  sortOrder,
  type,
  status,
  selectedRows,
  onRowSelect,
  onSelectAll,
  onEditClick,
}) => {
  const { pushView } = useDrawerNavigation();

  const { schools, loading, schoolUsers } = useSelector((state: RootState) => ({
    schools: state.schools.schools,
    loading: state.schools.loading,
    schoolUsers: state.schoolUsers.schoolUsers.filter(
      (user) => user.role !== 'Board_Member',
    ),
  }));

  const handleRowClick = (entityId: string, entityType: string) => {
    const drawerEntityType: EntityType =
      entityType === 'Network' ? EntityType.Network : EntityType.School;
    pushView(entityId, drawerEntityType, EntitySideDrawerTabIds.Details);
  };

  // Flatten, filter, and sort data
  const filteredData = useMemo(() => {
    const flattenedData = schools.flatMap((entity): DisplaySchoolResponse[] => {
      if (isNetwork(entity)) {
        const networkSchools =
          entity.schools?.map((school) => ({
            ...school,
            parentNetworkName: entity.name, // Add parent network name
          })) ?? [];

        return [entity, ...networkSchools];
      } else if (entity.network) {
        return [];
      } else {
        return [entity];
      }
    });

    // Apply filters
    const filtered = flattenedData.filter((entity) => {
      const schoolAdmins = schoolUsers.filter(
        (user) =>
          user.role === 'School_Admin' &&
          user.schools &&
          user.schools.includes(entity.id),
      );
      const matchesSearch =
        searchText.length > 0
          ? entity.name.toLowerCase().includes(searchText.toLowerCase()) ||
            entity.status.toLowerCase().includes(searchText.toLowerCase()) ||
            schoolAdmins.some((admin) =>
              `${admin.first_name} ${admin.last_name}`
                .toLowerCase()
                .includes(searchText.toLowerCase()),
            )
          : true;

      // Type filter
      const matchesType =
        type === 'All' ||
        (type === 'Network'
          ? entity.type === 'Network'
          : entity.type !== 'Network');

      // Status filter
      const matchesStatus = status === 'All' || entity.status === status;

      return matchesSearch && matchesType && matchesStatus;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (sortOrder === 'a-z') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return filtered;
  }, [schools, schoolUsers, searchText, type, status, sortOrder]);

  const allSelected = selectedRows.length === filteredData.length;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="py-4 flex-1 flex flex-col overflow-hidden">
      <SchoolsTable
        schools={filteredData}
        schoolUsers={schoolUsers}
        selectedRows={selectedRows}
        onRowSelect={onRowSelect}
        onSelectAll={onSelectAll}
        onRowClick={handleRowClick}
        onEditClick={onEditClick}
        allSelected={allSelected}
      />
    </div>
  );
};

export default SchoolsContainer;
