import React from 'react';
import { Helmet } from 'react-helmet';

import CheckInbox from '@/containers/Auth/SignUp/CheckInbox';

const CheckInboxPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Check Inbox - Reportwell</title>
      </Helmet>
      <CheckInbox />
    </>
  );
};

export default CheckInboxPage;
