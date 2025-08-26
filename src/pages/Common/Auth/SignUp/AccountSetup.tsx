import React from 'react';
import { Helmet } from 'react-helmet';

import AccountSetupComponent from '@/components/Auth/SignUp/AccountSetup';

const AccountSetup: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Account Setup</title>
      </Helmet>

      <AccountSetupComponent />
    </>
  );
};

export default AccountSetup;
