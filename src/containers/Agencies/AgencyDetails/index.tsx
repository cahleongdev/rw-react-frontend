import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import TabHeader from '@/components/Settings/TabHeader';

import UsersSettings from '@/containers/AgencySettings/UsersSettings';
import PrivilegesSettings from '@/containers/Agencies/PrivilegesSettings';
import { DrawerNavigationProvider } from '@/contexts/DrawerNavigationContext';
import { fetchAgency } from '@/store/slices/agencySlice';
import { AppDispatch } from '@/store';
import AgencyInformation from '../AgencyInformation';

const AgencyDetails = () => {
  const { agencyId } = useParams<{ agencyId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [tab, setTab] = useState('Agency');

  useEffect(() => {
    if (agencyId) {
      dispatch(fetchAgency(agencyId));
    }
  }, [dispatch, agencyId]);

  // Optional: Handle loading and error states here if needed,
  // or let child components handle their respective loading parts.
  // For example, you could show a main loader while agency data is being fetched.
  // if (agencyLoading) {
  //   return <DataLoading />; // Assuming you have a DataLoading component
  // }
  // if (agencyError) {
  //   return <div>Error loading agency details: {agencyError}</div>;
  // }

  return (
    <div className="h-[calc(100vh-48px)] flex flex-col bg-white p-6 gap-6 overflow-hidden">
      <div className="flex flex-col gap-2 border-b border-slate-300">
        <h2 className="text-slate-950">Agency Details</h2>
        <TabHeader
          labels={['Agency', 'Users', 'Privileges']}
          active={tab}
          onTabChange={(newTab: string) => setTab(newTab)}
        />
      </div>
      {/* Pass agencyId to child components if they need to perform actions
          specific to this agencyId and can't rely solely on the store,
          or if they are also used in contexts where agencyId isn't in the store.
          AgencyTabSettings and PrivilegesSettings might need agencyId if they directly
          dispatch updates or fetches for that specific agency. */}
      {tab === 'Agency' && agencyId && (
        <AgencyInformation agencyId={agencyId} />
      )}
      {tab === 'Users' && agencyId && (
        <DrawerNavigationProvider>
          <UsersSettings agencyId={agencyId} />
        </DrawerNavigationProvider>
      )}
      {tab === 'Privileges' && agencyId && (
        <PrivilegesSettings agencyId={agencyId} />
      )}
    </div>
  );
};

export default AgencyDetails;
