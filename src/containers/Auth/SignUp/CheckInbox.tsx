import React from 'react';
import { useLocation } from 'react-router-dom';

import CheckInboxComponent from '@components/Auth/SignUp/CheckInbox';

const CheckInbox: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email;

  return <CheckInboxComponent email={email} />;
};

export default CheckInbox;
