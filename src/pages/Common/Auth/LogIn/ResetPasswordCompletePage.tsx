import React from 'react';
import { Helmet } from 'react-helmet';

import ResetPasswordCompleteComponent from '@/components/Auth/LogIn/ResetPasswordComplete';

const ResetPasswordComplete: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Reset Password Completed</title>
      </Helmet>

      <ResetPasswordCompleteComponent />
    </>
  );
};

export default ResetPasswordComplete;
