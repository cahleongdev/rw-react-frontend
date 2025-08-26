import React from 'react';
import { Helmet } from 'react-helmet';

import MFACodeVerification from '@/containers/Auth/LogIn/MFACodeVerification';

const MFACodeVerificationPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>MFA Code Verification</title>
      </Helmet>

      <MFACodeVerification />
    </>
  );
};

export default MFACodeVerificationPage;
