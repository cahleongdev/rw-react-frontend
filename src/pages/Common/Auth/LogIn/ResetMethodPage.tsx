import React from 'react';
import { Helmet } from 'react-helmet';

import ResetMethodContainer from '@/containers/Auth/LogIn/ResetMethod';

const ResetMethod: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>

      <ResetMethodContainer />
    </>
  );
};

export default ResetMethod;
