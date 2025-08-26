import React from 'react';
import { Helmet } from 'react-helmet';

import LogInContainer from '@/containers/Auth/LogIn/LogIn';

const LogIn: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Log In</title>
      </Helmet>

      <LogInContainer />
    </>
  );
};

export default LogIn;
