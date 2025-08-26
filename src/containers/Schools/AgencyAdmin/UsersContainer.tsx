import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Loading } from '@/components/base/Loading';
import UsersTable from '@/components/Schools/AgencyAdmin/UsersTable';
import { useDrawerNavigation } from '@/contexts/DrawerNavigationContext';
import {
  EntitySideDrawerTabIds,
  EntityType,
} from '@containers/EntitySideDrawer/index.types';

interface UsersContainerProps {
  searchText: string;
  sortOrder: 'a-z' | 'z-a';
  status: string;
  selectedRows: string[];
  onRowSelect: (userId: string, checked: boolean) => void;
  onSelectAll: () => void;
}

const UsersContainer: React.FC<UsersContainerProps> = ({
  searchText,
  sortOrder,
  status,
  selectedRows,
  onRowSelect,
  onSelectAll,
}) => {
  const { pushView } = useDrawerNavigation();

  const { schools, loading, schoolUsers } = useSelector((state: RootState) => ({
    schools: state.schools.schools,
    loading: state.schools.loading,
    schoolUsers: state.schoolUsers.schoolUsers.filter(
      (user) => user.role !== 'Board_Member',
    ),
  }));

  const handleUserRowClick = (userId: string) => {
    pushView(userId, EntityType.SchoolUser, EntitySideDrawerTabIds.Details);
  };

  // Filter and sort users based on search text, status, and sort order
  const filteredUsers = useMemo(() => {
    // Apply filters
    const filtered = schoolUsers.filter((user) => {
      // Search filter
      const matchesSearch =
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()) ||
        schools
          .filter((school) => user.schools.includes(school.id))
          .map((school) => school.name)
          .join(', ')
          .toLowerCase()
          .includes(searchText.toLowerCase());

      // Status filter
      let matchesStatus = true;
      if (status !== 'All') {
        if (status === 'Active') {
          matchesStatus = user.is_active === true;
        } else if (status === 'Inactive') {
          matchesStatus = user.is_active === null;
        } else if (status === 'Pending') {
          matchesStatus = user.is_active === false;
        }
      }

      return matchesSearch && matchesStatus;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();

      if (sortOrder === 'a-z') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return filtered;
  }, [schoolUsers, searchText, status, sortOrder, schools]);

  const allSelected = selectedRows.length === filteredUsers.length;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="py-4 flex-1 flex flex-col overflow-hidden">
      <UsersTable
        users={filteredUsers}
        schools={schools}
        selectedRows={selectedRows}
        onRowSelect={onRowSelect}
        onSelectAll={onSelectAll}
        onRowClick={handleUserRowClick}
        allSelected={allSelected}
      />
    </div>
  );
};

export default UsersContainer;
