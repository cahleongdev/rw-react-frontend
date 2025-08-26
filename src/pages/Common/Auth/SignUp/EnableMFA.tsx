import React from 'react';
import { Helmet } from 'react-helmet';

import EnableMFAContainer from '@/containers/Auth/MFA';

const EnableMFA: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Enable MFA</title>
      </Helmet>

      <EnableMFAContainer />
    </>
  );
};

export default EnableMFA;
