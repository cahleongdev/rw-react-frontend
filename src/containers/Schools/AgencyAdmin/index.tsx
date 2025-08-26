import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Project Redux Store
import { RootState, AppDispatch } from '@/store';
import {
  SchoolResponse,
  fetchAllSchoolsForAgencyAdmin,
} from '@/store/slices/schoolsSlice';
import { setUsers, SchoolUser } from '@/store/slices/schoolUsersSlice';
import axios from '@/api/axiosInstance';

// Project Components
import SchoolsHeader from '@/components/Schools/AgencyAdmin/SchoolsHeader';
import SchoolsFilters from '@/components/Schools/AgencyAdmin/SchoolsFilters';
import SelectionBar from '@/components/Schools/AgencyAdmin/SelectionBar';
import SchoolsContainer from '@/containers/Schools/AgencyAdmin/SchoolsContainer';
import UsersContainer from '@/containers/Schools/AgencyAdmin/UsersContainer';
import EntitySideDrawer from '@containers/EntitySideDrawer';

// Modals
import { EditSchool } from '@containers/EntitySideDrawer/EditSchool';
import { AddSchool } from '@/containers/Schools/AddSchool';
import { AddNetwork } from '@/containers/Schools/AddNetwork';
import { AddUser } from '@/containers/Schools/AddUser';
import { BulkImport } from '@/containers/Schools/BulkImport';

// Contexts and Hooks
import { DrawerNavigationProvider } from '@/contexts/DrawerNavigationContext';
import { useSchoolsUrlState } from '@hooks/useSchoolsUrlState';

const SchoolsMainContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { state: urlState, updateState: updateUrlState } = useSchoolsUrlState();

  // Redux state
  const { schools, schoolUsers, initialFetchAttempted } = useSelector(
    (state: RootState) => ({
      schools: state.schools.schools,
      schoolUsers: state.schoolUsers.schoolUsers.filter(
        (user) => user.role !== 'Board_Member',
      ),
      initialFetchAttempted: state.schools.initialFetchAttempted,
    }),
  );

  // Local state for modals and editing
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [schoolToEdit, setSchoolToEdit] = useState<SchoolResponse | null>(null);

  // Modal states
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isAddSchoolOpen, setIsAddSchoolOpen] = useState(false);
  const [isAddNetworkOpen, setIsAddNetworkOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      // Fetch schools and networks via thunk
      dispatch(fetchAllSchoolsForAgencyAdmin());

      // Fetch all agency admin users in one call
      const { data: usersResult } = await axios.get<SchoolUser[]>(
        '/users/agency_admin/',
      );
      dispatch(
        setUsers({
          data: usersResult,
        }),
      );
    } catch (error) {
      console.error('Error in fetchData dispatch or users fetch:', error);
    }
  }, [dispatch]);

  // URL state handlers
  const handleTabChange = (tab: 'schools' | 'users') => {
    updateUrlState({
      tab,
      search: '', // Reset search
      sort: 'a-z', // Reset to default sort
      type: 'All', // Reset type filter
      status: 'All', // Reset status filter
    });
    setSelectedRows([]); // Clear selection when switching tabs
  };

  const handleSearchChange = (search: string) => {
    updateUrlState({ search });
  };

  const handleSortChange = (sort: 'a-z' | 'z-a') => {
    updateUrlState({ sort });
  };

  const handleTypeChange = (type: string) => {
    updateUrlState({ type });
  };

  const handleStatusChange = (status: string) => {
    updateUrlState({ status });
  };

  // Selection handlers
  const handleRowSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleSelectAll = () => {
    if (urlState.tab === 'schools') {
      if (selectedRows.length === schools.length) {
        setSelectedRows([]);
      } else {
        setSelectedRows(schools.map((school) => school.id));
      }
    } else {
      if (selectedRows.length === schoolUsers.length) {
        setSelectedRows([]);
      } else {
        setSelectedRows(schoolUsers.map((user) => user.id));
      }
    }
  };

  // Edit handlers
  const handleEditClick = (e: React.MouseEvent, school: SchoolResponse) => {
    e.stopPropagation();
    setSchoolToEdit(school);
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
    setSchoolToEdit(null);
  };

  // Modal handlers
  const handleCreateSchool = () => setIsAddSchoolOpen(true);
  const handleCreateNetwork = () => setIsAddNetworkOpen(true);
  const handleCreateUser = () => setIsAddUserOpen(true);
  const handleBulkImport = () => setIsBulkImportOpen(true);

  useEffect(() => {
    if (!initialFetchAttempted) {
      fetchData();
    }
  }, [fetchData, initialFetchAttempted]);

  // Clear selection when tab changes
  useEffect(() => {
    setSelectedRows([]);
  }, [urlState.tab]);

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <SchoolsHeader
        activeTab={urlState.tab}
        onTabChange={handleTabChange}
        onCreateSchool={handleCreateSchool}
        onCreateNetwork={handleCreateNetwork}
        onCreateUser={handleCreateUser}
        onBulkImport={handleBulkImport}
      />

      {/* Filters */}
      <SchoolsFilters
        activeTab={urlState.tab}
        searchText={urlState.search}
        onSearchChange={handleSearchChange}
        sortOrder={urlState.sort}
        onSortChange={handleSortChange}
        type={urlState.type}
        onTypeChange={handleTypeChange}
        status={urlState.status}
        onStatusChange={handleStatusChange}
      />

      {/* Selection bar */}
      <SelectionBar
        selectedCount={selectedRows.length}
        activeTab={urlState.tab}
      />

      {/* Main content */}
      {urlState.tab === 'schools' ? (
        <SchoolsContainer
          searchText={urlState.search}
          sortOrder={urlState.sort}
          type={urlState.type}
          status={urlState.status}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
          onEditClick={handleEditClick}
        />
      ) : (
        <UsersContainer
          searchText={urlState.search}
          sortOrder={urlState.sort}
          status={urlState.status}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
        />
      )}

      {/* Modals */}
      <AddSchool
        open={isAddSchoolOpen}
        onClose={() => setIsAddSchoolOpen(false)}
      />
      <AddNetwork
        open={isAddNetworkOpen}
        onClose={() => setIsAddNetworkOpen(false)}
      />
      <AddUser open={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} />
      <BulkImport
        open={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
      />
      <EditSchool
        open={isEditing}
        schoolId={schoolToEdit?.id || ''}
        onClose={handleEditClose}
      />
    </div>
  );
};

const WrappedSchoolsContainer = () => {
  return (
    <DrawerNavigationProvider>
      <SchoolsMainContainer />
      <EntitySideDrawer />
    </DrawerNavigationProvider>
  );
};

export default WrappedSchoolsContainer;
