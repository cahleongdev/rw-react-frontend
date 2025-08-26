import React from 'react';
import { Helmet } from 'react-helmet';

import ResetPasswordContainer from '@/containers/Auth/LogIn/ResetPassword';

const ResetPassword: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>

      <ResetPasswordContainer />
    </>
  );
};

export default ResetPassword;
