import React from 'react';
import { Helmet } from 'react-helmet';

import RequestNewMagicLink from '@containers/Auth/SignUp/RequestNewMagicLink';

const RequestNewMagicLinkPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Request New Magic Link - Reportwell</title>
      </Helmet>
      <RequestNewMagicLink />
    </>
  );
};

export default RequestNewMagicLinkPage;
