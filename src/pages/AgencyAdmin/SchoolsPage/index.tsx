import React from 'react';
import { Helmet } from 'react-helmet';

import SchoolsContainer from '@/containers/Schools/AgencyAdmin';

const Schools: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Schools</title>
      </Helmet>

      <SchoolsContainer />
    </>
  );
};

export default Schools;
