import React from 'react';
import { Helmet } from 'react-helmet';

import AgencySettingsContainer from '@/containers/AgencySettings';

const AgencySettings: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Agency Settings</title>
      </Helmet>

      <AgencySettingsContainer />
    </>
  );
};

export default AgencySettings;
