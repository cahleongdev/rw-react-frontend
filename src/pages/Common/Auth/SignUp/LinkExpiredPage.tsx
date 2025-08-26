import React from 'react';
import { Helmet } from 'react-helmet';

import LinkExpiredContainer from '@containers/Auth/SignUp/LinkExpired';

const LinkExpiredPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Link Expired - Reportwell</title>
      </Helmet>

      <LinkExpiredContainer />
    </>
  );
};

export default LinkExpiredPage;
