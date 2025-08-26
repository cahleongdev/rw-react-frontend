import React from 'react';
import { Helmet } from 'react-helmet';

import AgenciesContainer from '@/containers/Agencies/SuperAdmin';

const AgencyManagementPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Agency Management</title>
      </Helmet>
      <AgenciesContainer />
    </>
  );
};

export default AgencyManagementPage;
