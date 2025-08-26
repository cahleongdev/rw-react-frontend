import { useNavigate } from 'react-router-dom';

import ProfileSettings from './ProfileSettings';
import NotificationsSettings from './NotificationSettings';
import PasswordSecuritySettings from './PasswordSecurity';
import IntegrationsSettings from './IntegrationsSettings';

import TabHeader from '@components/Settings/TabHeader';

const tabMap = [
  { slug: 'profile', label: 'Profile' },
  { slug: 'notifications', label: 'Notifications' },
  { slug: 'password-security', label: 'Password & Security' },
  { slug: 'integrations', label: 'Integrations' },
];

const Settings = ({ tab }: { tab: string }) => {
  const navigate = useNavigate();

  const handleTabChange = (label: string) => {
    const found = tabMap.find((t) => t.label === label);
    if (found) {
      navigate(`/settings/${found.slug}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-48px)] flex flex-col bg-white p-6 gap-6">
      <div className="flex flex-col gap-2 border-b border-slate-300">
        <h2 className="text-slate-950">Settings</h2>
        <TabHeader
          labels={tabMap.map((t) => t.label)}
          active={tabMap.find((t) => t.slug === tab)?.label ?? ''}
          onTabChange={handleTabChange}
        />
      </div>
      {tab === 'profile' && <ProfileSettings />}
      {tab === 'notifications' && <NotificationsSettings />}
      {tab === 'password-security' && <PasswordSecuritySettings />}
      {tab === 'integrations' && <IntegrationsSettings />}
    </div>
  );
};

export default Settings;
