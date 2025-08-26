import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

import SettingsContainer from '@/containers/Settings';

const Settings: React.FC = () => {
  const { tab } = useParams();

  return (
    <>
      <Helmet>
        <title>Settings</title>
      </Helmet>

      <SettingsContainer tab={tab ?? 'profile'} />
    </>
  );
};

export default Settings;
