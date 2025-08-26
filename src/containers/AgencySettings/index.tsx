import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TabHeader from '@/components/Settings/TabHeader';
import { DataLoading } from '@/components/base/Loading';

import AgencyTabSettings from './AgencySettings';
import UsersSettings from './UsersSettings';
import DisplaySettings from './DisplaySettings';
import FieldsSettings from './FieldsSettings';

import { DrawerNavigationProvider } from '@/contexts/DrawerNavigationContext';
import { RootState } from '@store/index';
import { useSelector } from 'react-redux';

// Define available tabs
const tabMap = [
  { slug: 'agency', label: 'Agency' },
  { slug: 'users', label: 'Users' },
  { slug: 'display', label: 'Display' },
  { slug: 'fields', label: 'Fields' },
] as const;

type TabLabel = (typeof tabMap)[number]['label'];
type TabSlug = (typeof tabMap)[number]['slug'];

const AgencySettings = () => {
  const { tab } = useParams<{ tab?: TabSlug }>();
  const navigate = useNavigate();

  // Set initial tab based on URL or default to 'agency'
  const initialTab = tab
    ? tabMap.find((t) => t.slug === tab)?.label || 'Agency'
    : 'Agency';
  const [activeTab, setActiveTab] = useState<TabLabel>(initialTab as TabLabel);

  const agencyId = useSelector((state: RootState) => state.auth.user?.agency);

  useEffect(() => {
    // Update active tab when URL changes
    if (tab) {
      const foundTab = tabMap.find((t) => t.slug === tab);
      if (foundTab) {
        setActiveTab(foundTab.label);
      } else {
        // If invalid tab slug, redirect to default tab
        navigate('/agency-settings/agency');
      }
    }
  }, [tab, navigate]);

  if (!agencyId) {
    return <DataLoading />;
  }

  const handleTabChange = (newTab: TabLabel) => {
    setActiveTab(newTab);
    const foundTab = tabMap.find((t) => t.label === newTab);
    if (foundTab) {
      navigate(`/agency-settings/${foundTab.slug}`);
    }
  };

  const tabLabels = tabMap.map((t) => t.label) as TabLabel[];

  return (
    <div className="h-[calc(100vh-48px)] flex flex-col bg-white p-6 gap-6 overflow-hidden">
      <div className="flex flex-col gap-2 border-b border-slate-300">
        <h2 className="text-slate-950">Agency Settings</h2>
        <TabHeader<TabLabel>
          labels={tabLabels}
          active={activeTab}
          onTabChange={handleTabChange}
        />
      </div>
      {activeTab === 'Agency' && <AgencyTabSettings agencyId={agencyId} />}
      {activeTab === 'Users' && (
        <DrawerNavigationProvider>
          <UsersSettings agencyId={agencyId} />
        </DrawerNavigationProvider>
      )}
      {activeTab === 'Display' && <DisplaySettings />}
      {activeTab === 'Fields' && <FieldsSettings />}
    </div>
  );
};

export default AgencySettings;
