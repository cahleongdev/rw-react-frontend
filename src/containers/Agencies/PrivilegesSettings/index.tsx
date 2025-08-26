import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom'; // Removed
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { RootState, AppDispatch } from '@/store';
// import { fetchAgencies, selectAgencyById, updateAgencyThunk } from '@/store/slices/agenciesSlice'; // We will use agencySlice for data and potentially updates
import { updateAgencyThunk } from '@/store/slices/agenciesSlice'; // Keep for updates if it targets the correct agency by ID
import { fetchAgency } from '@/store/slices/agencySlice'; // To ensure the agency is loaded if needed
import PrivilegesSettingsComponent from '@/components/Agencies/PrivilegesSettings';

interface PrivilegesSettingsContainerProps {
  agencyId: string;
}

const PrivilegesSettingsContainer: React.FC<
  PrivilegesSettingsContainerProps
> = ({ agencyId }) => {
  // const { agencyId: agencyIdFromParams } = useParams<{ agencyId: string }>(); // Removed
  const dispatch = useDispatch<AppDispatch>();

  // Use the agency data from the 'agency' slice, which should be populated by a parent
  const {
    agency,
    loading: agencyLoading,
    error: agencyError,
  } = useSelector((state: RootState) => state.agency);

  // This loading state is for the specific update operations within this component
  const [isUpdatingPrivileges, setIsUpdatingPrivileges] = useState(false);

  const [selectedAgencyPrivileges, setSelectedAgencyPrivileges] = useState<
    string[]
  >([]);
  const [selectedSchoolPrivileges, setSelectedSchoolPrivileges] = useState<
    string[]
  >([]);
  // const [error, setError] = useState<string | undefined>(undefined); // Use agencyError from slice

  useEffect(() => {
    // If the agency in the store is not the one we want, or not loaded, parent should handle it.
    // However, as a fallback, or if this component can be used standalone,
    // we can dispatch fetchAgency if agencyId is provided and no matching agency is loaded.
    if (agencyId && (!agency || agency.id !== agencyId) && !agencyLoading) {
      dispatch(fetchAgency(agencyId));
    }
  }, [dispatch, agencyId, agency, agencyLoading]);

  useEffect(() => {
    if (agency && agency.id === agencyId) {
      setSelectedAgencyPrivileges(agency.admin_privileges || []);
      setSelectedSchoolPrivileges(agency.school_privileges || []);
    } else {
      // If the agency from the store doesn't match, clear local privileges
      setSelectedAgencyPrivileges([]);
      setSelectedSchoolPrivileges([]);
    }
  }, [agency, agencyId]);

  const handleTogglePrivilege = async (
    privilegeId: string,
    type: 'agency' | 'school',
  ) => {
    if (!agencyId) {
      // Should always be true due to prop type, but good check
      toast.error('Agency ID is missing. Cannot update privileges.');
      return;
    }
    if (isUpdatingPrivileges) return;

    setIsUpdatingPrivileges(true);
    let currentPrivilegesList: string[];
    let setPrivilegesState: React.Dispatch<React.SetStateAction<string[]>>;
    let updatePayloadKey: 'admin_privileges' | 'school_privileges';

    if (type === 'agency') {
      currentPrivilegesList = selectedAgencyPrivileges;
      setPrivilegesState = setSelectedAgencyPrivileges;
      updatePayloadKey = 'admin_privileges';
    } else {
      currentPrivilegesList = selectedSchoolPrivileges;
      setPrivilegesState = setSelectedSchoolPrivileges;
      updatePayloadKey = 'school_privileges';
    }

    const originalPrivileges = [...currentPrivilegesList];
    let newPrivilegesList: string[];

    if (currentPrivilegesList.includes(privilegeId)) {
      newPrivilegesList = currentPrivilegesList.filter(
        (id) => id !== privilegeId,
      );
    } else {
      newPrivilegesList = [...currentPrivilegesList, privilegeId];
    }

    setPrivilegesState(newPrivilegesList);

    try {
      // Assuming updateAgencyThunk can correctly target the agency by ID for update
      // and potentially also update the single 'agency' slice if that's desired after an update.
      await dispatch(
        updateAgencyThunk({
          agencyId,
          updates: { [updatePayloadKey]: newPrivilegesList },
        }),
      ).unwrap();
      toast.success(`Agency ${type} privileges updated successfully!`);
      // Optionally, dispatch fetchAgency(agencyId) again here to ensure the single 'agency' slice is up-to-date
      // if updateAgencyThunk only updates the 'agencies' list slice.
      // dispatch(fetchAgency(agencyId));
    } catch (err) {
      toast.error(`Failed to update agency ${type} privileges.`);
      setPrivilegesState(originalPrivileges);
      console.error('Error updating privileges:', err);
    } finally {
      setIsUpdatingPrivileges(false);
    }
  };

  const isLoading = agencyLoading || isUpdatingPrivileges;
  const formError = agencyError;
  // If the component relies on a specific agency being loaded, and it's not the correct one:
  if (agencyId && agency && agency.id !== agencyId && !agencyLoading) {
    return <div className="p-4">Loading agency privileges...</div>; // Or a more specific loading/error state
  }

  return (
    <PrivilegesSettingsComponent
      selectedAgencyPrivileges={selectedAgencyPrivileges}
      selectedSchoolPrivileges={selectedSchoolPrivileges}
      onTogglePrivilege={handleTogglePrivilege}
      agencyDataExists={!!(agency && agency.id === agencyId)}
      isLoading={isLoading}
      error={formError === null ? undefined : formError}
    />
  );
};

export default PrivilegesSettingsContainer;
