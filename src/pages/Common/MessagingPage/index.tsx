import React from 'react';
import { Helmet } from 'react-helmet';

import MessagingContainer from '@/containers/Messaging';

const Messaging: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Messaging</title>
      </Helmet>

      <MessagingContainer />
    </>
  );
};

export default Messaging;
