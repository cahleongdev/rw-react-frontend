import React from 'react';
import { Helmet } from 'react-helmet';

import ResetLinkSentContainer from '@/containers/Auth/LogIn/ResetLinkSent';

const ResetLinkSent: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Reset Link Sent</title>
      </Helmet>

      <ResetLinkSentContainer />
    </>
  );
};

export default ResetLinkSent;
