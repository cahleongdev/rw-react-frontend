import React from 'react';
import { Helmet } from 'react-helmet';

import ForgotPasswordContainer from '@/containers/Auth/LogIn/ForgotPassword';

const ForgotPassword: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>

      <ForgotPasswordContainer />
    </>
  );
};

export default ForgotPassword;
