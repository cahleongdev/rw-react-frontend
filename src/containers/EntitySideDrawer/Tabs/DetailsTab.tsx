import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { RootState, AppDispatch } from '@/store';
import { updateUser } from '@/store/slices/schoolUsersSlice';
import {
  School,
  updateSchool,
  addSchoolToNetwork,
} from '@/store/slices/schoolsSlice';
import { SchoolUser } from '@/store/slices/schoolUsersSlice';

import axiosInstance from '@/api/axiosInstance';

import { EntitySideDrawerTabIds, EntityType } from '../index.types';

import { ActivityLogSection } from '@/components/EntitySideDrawer/Details/ActivityLogSection';
import { DataLoading } from '@/components/base/Loading';
import { NetworkSchoolsSection } from '@/components/EntitySideDrawer/Details/NetworkSchoolsSection';
import { TeamMembersSection } from '@/components/EntitySideDrawer/Details/TeamMembersSection';
import { AssignedSchoolsSection } from '@/components/EntitySideDrawer/Details/AssignedSchoolsSection';
import CustomFieldsSectionContainer from '../CustomFieldsSection';

interface DetailsTabProps {
  entityId?: string;
  onAddFieldClick: (open: boolean) => void;
  entityType: EntityType;
  pushView?: (
    entityId: string,
    entityType: EntityType,
    tabId: EntitySideDrawerTabIds,
  ) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({
  entityId,
  onAddFieldClick,
  entityType,
  pushView,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => {
    if (
      entityType === EntityType.SchoolUser ||
      entityType === EntityType.BoardMember
    ) {
      return state.schoolUsers.schoolUsers.find((u) => u.id === entityId);
    }
    if (entityType === EntityType.AgencyUser) {
      return state.agency.users.find((u) => u.id === entityId);
    }
    return null;
  });

  const entity = useSelector((state: RootState) => {
    if (entityType === EntityType.School || entityType === EntityType.Network) {
      return state.schools.schools.find((s) => s.id === entityId);
    }
    return null;
  });

  const allSchools = useSelector((state: RootState) => state.schools.schools);

  const activityLogs = useSelector((state: RootState) =>
    Object.values(state.activityLogs.logs || {}).flat(),
  );

  // Assigned Schools state
  const [isAddingSchool, setIsAddingSchool] = React.useState(false);
  const [schoolSearchQuery, setSchoolSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = React.useState<School | null>(
    null,
  );

  // Assigned Schools logic
  const assignedSchools = React.useMemo(() => {
    if (!user || !user.schools) return [];
    return allSchools.filter((school) => user.schools.includes(school.id));
  }, [user, allSchools]);

  const handleAddSchoolClick = () => setIsAddingSchool(true);

  const clearStates = () => {
    setIsAddingSchool(false);
    setSelectedSchool(null);
    setSchoolSearchQuery('');
    setSearchResults([]);
  };

  const handleSchoolSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSchoolSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    if (
      entityType === EntityType.Network &&
      entity &&
      'schools' in entity &&
      Array.isArray(entity.schools)
    ) {
      const assignedIds = entity.schools.map((s) => s.id);
      const filtered = allSchools.filter(
        (entity) =>
          !assignedIds.includes(entity.id) &&
          entity.name.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(filtered as School[]);
    }
  };

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
    setSearchResults([]);
    setSchoolSearchQuery(school.name);
  };

  const handleConfirmAddSchool = async () => {
    if (!selectedSchool || !user) return;
    const currentSchoolIds = user.schools || [];
    if (currentSchoolIds.includes(selectedSchool.id)) {
      clearStates();
      return;
    }
    const updatedSchoolIds = [...currentSchoolIds, selectedSchool.id];
    const payload = { schools: updatedSchoolIds };
    try {
      await axiosInstance.put(`/users/${user.id}/`, payload);
      dispatch(
        updateUser({ id: user.id, updates: { schools: updatedSchoolIds } }),
      );
      clearStates();
      toast.success('School/network assigned successfully');
    } catch (error) {
      console.error(
        `Error assigning school ${selectedSchool.id} to user ${user.id}:`,
        error,
      );
      toast.error('Failed to assign school/network.');
    }
  };

  const handleViewSchool = React.useCallback(
    (school: School) => {
      if (!pushView) return;
      pushView(school.id, EntityType.School, EntitySideDrawerTabIds.Details);
    },
    [pushView],
  );

  const networkSchools = React.useMemo(() => {
    if (
      entityType === EntityType.Network &&
      entity &&
      'schools' in entity &&
      Array.isArray(entity.schools)
    ) {
      return entity.schools.filter((s): s is School => !!s);
    }
    return [];
  }, [entityType, entity]);

  const schoolUsers = useSelector(
    (state: RootState) => state.schoolUsers.schoolUsers,
  );
  const [isAddingUser, setIsAddingUser] = React.useState(false);
  const [userSearchQuery, setUserSearchQuery] = React.useState('');
  const [userSearchResults, setUserSearchResults] = React.useState<
    SchoolUser[]
  >([]);
  const [initialUserSuggestions, setInitialUserSuggestions] = React.useState<
    SchoolUser[]
  >([]);

  const teamMembers = React.useMemo(() => {
    if (
      (entityType === EntityType.School || entityType === EntityType.Network) &&
      entityId
    ) {
      return schoolUsers.filter(
        (u) => u.schools.includes(entityId) && u.role !== 'Board_Member',
      );
    }
    return [];
  }, [entityType, entityId, schoolUsers]);

  const handleAddUserClick = React.useCallback(() => {
    if (!entityId) return;
    const assignedUserIds = new Set(teamMembers.map((tm) => tm.id));
    const suggestions = schoolUsers
      .filter(
        (user) => !assignedUserIds.has(user.id) && user.role !== 'Board_Member',
      )
      .sort((a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      })
      .slice(0, 5);
    setInitialUserSuggestions(suggestions);
    setIsAddingUser(true);
  }, [entityId, teamMembers, schoolUsers]);

  const handleCancelAddUser = React.useCallback(() => {
    setIsAddingUser(false);
    setUserSearchQuery('');
    setUserSearchResults([]);
    setInitialUserSuggestions([]);
  }, []);

  const handleUserSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setUserSearchQuery(query);
      if (!query.trim()) {
        setUserSearchResults([]);
        return;
      }
      const assignedUserIds = new Set(teamMembers.map((tm) => tm.id));
      const filteredUsers = schoolUsers.filter(
        (user) =>
          !assignedUserIds.has(user.id) &&
          user.role !== 'Board_Member' &&
          (`${user.first_name} ${user.last_name}`
            .toLowerCase()
            .includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())),
      );
      setUserSearchResults(filteredUsers);
    },
    [schoolUsers, teamMembers],
  );

  const handleUserSelect = React.useCallback(
    async (user: SchoolUser) => {
      if (!user || !entityId) return;
      if (user.schools?.includes(entityId) && user.role !== 'Board_Member') {
        clearStates();
        return;
      }

      const updatedSchoolIds = [...(user.schools || []), entityId];
      const updatePayload = { schools: updatedSchoolIds };
      try {
        await axiosInstance.put(`/users/${user.id}/`, updatePayload);
        dispatch(
          updateUser({ id: user.id, updates: { schools: updatedSchoolIds } }),
        );
        toast.success('School assigned to network successfully');
      } catch (error) {
        console.error('Error adding school to network:', error);
        toast.error('Failed to assign school to network.');
      } finally {
        clearStates();
      }
    },
    [entityId, dispatch],
  );

  const handleTriggerAddUserDialog = React.useCallback(() => {
    // Implement dialog logic as needed
  }, []);

  const handleViewUser = React.useCallback(
    (userId: string) => {
      if (!pushView) return;
      const isBoardMember = teamMembers.some(
        (tm) => tm.id === userId && tm.role === 'Board_Member',
      );
      pushView(
        userId,
        isBoardMember ? EntityType.BoardMember : EntityType.SchoolUser,
        EntitySideDrawerTabIds.Details,
      );
    },
    [pushView, teamMembers],
  );

  const handleConfirmAddSchoolToNetwork = React.useCallback(async () => {
    if (!selectedSchool || !entity || entityType !== EntityType.Network) return;
    const networkId = entity.id;
    const schoolId = selectedSchool.id;
    try {
      const response = await axiosInstance.put(`/schools/${schoolId}/`, {
        network: networkId,
      });
      const updatedSchoolData = (response as any).data as School;
      if (!updatedSchoolData || !updatedSchoolData.network) {
        throw new Error('Failed to confirm school update from server.');
      }
      // Optionally: check if school exists in allSchools, add if not
      dispatch(updateSchool({ id: schoolId, updates: updatedSchoolData }));
      dispatch(
        addSchoolToNetwork({ networkId: networkId, school: updatedSchoolData }),
      );
      toast.success('School assigned to network successfully');
    } catch (error: any) {
      console.error('Error adding school to network:', error);
      toast.error('Failed to assign school to network.');
    } finally {
      clearStates();
    }
  }, [entity, entityType, selectedSchool, dispatch]);

  if (!user && !entity) return <DataLoading />;

  return (
    <div className="flex flex-col gap-4 mt-4 pb-10  ">
      {(entityType === EntityType.School ||
        entityType === EntityType.Network) && (
        <TeamMembersSection
          teamMembers={teamMembers}
          isAddingUser={isAddingUser}
          userSearchQuery={userSearchQuery}
          userSearchResults={userSearchResults}
          initialUserSuggestions={initialUserSuggestions}
          onAddUserClick={handleAddUserClick}
          onCancelAddUser={handleCancelAddUser}
          onUserSearchChange={handleUserSearchChange}
          onUserSelect={handleUserSelect}
          onTriggerAddUserDialog={handleTriggerAddUserDialog}
          onViewUser={handleViewUser}
        />
      )}
      {entityType === EntityType.Network && (
        <NetworkSchoolsSection
          networkSchools={networkSchools}
          isAddingSchool={isAddingSchool}
          schoolSearchQuery={schoolSearchQuery}
          schoolSearchResults={searchResults}
          selectedSchool={selectedSchool}
          onAddSchoolClick={handleAddSchoolClick}
          onCancelAddSchool={clearStates}
          onConfirmAddSchool={handleConfirmAddSchoolToNetwork}
          onSchoolSearchChange={handleSchoolSearchChange}
          onSchoolSelect={handleSchoolSelect}
          onViewSchool={handleViewSchool}
          onTriggerAddSchoolDialog={() => {}}
        />
      )}
      {entityType === EntityType.SchoolUser && (
        <AssignedSchoolsSection
          assignedSchools={assignedSchools}
          isAddingSchool={isAddingSchool}
          schoolSearchQuery={schoolSearchQuery}
          schoolSearchResults={searchResults}
          selectedSchool={selectedSchool}
          onAddSchoolClick={handleAddSchoolClick}
          onCancelAddSchool={clearStates}
          onConfirmAddSchool={handleConfirmAddSchool}
          onSchoolSearchChange={handleSchoolSearchChange}
          onSchoolSelect={handleSchoolSelect}
          onViewSchool={handleViewSchool}
        />
      )}
      <CustomFieldsSectionContainer
        entityId={entityId}
        entityType={entityType}
        onAddFieldClick={onAddFieldClick}
      />
      <ActivityLogSection activityLogs={activityLogs} />
    </div>
  );
};

export default DetailsTab;
