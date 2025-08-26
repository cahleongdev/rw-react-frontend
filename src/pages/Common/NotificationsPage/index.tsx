import React from 'react';
import { Helmet } from 'react-helmet';

import NotificationsContainer from '@/containers/Notifications';

const Notifications: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Notifications</title>
      </Helmet>

      <NotificationsContainer />
    </>
  );
};

export default Notifications;
