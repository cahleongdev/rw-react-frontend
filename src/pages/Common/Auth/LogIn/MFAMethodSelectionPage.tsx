import React from 'react';
import { Helmet } from 'react-helmet';

import MFAMethodSelection from '@/containers/Auth/LogIn/MFAMethodSelection';

const MFAMethodSelectionPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>MFA Method Selection</title>
      </Helmet>
      <MFAMethodSelection />
    </>
  );
};

export default MFAMethodSelectionPage;
