import React from 'react';
import { Helmet } from 'react-helmet';

import AlreadyRegisteredContainer from '@containers/Auth/SignUp/AlreadyRegistered';

const AlreadyRegisteredPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Already Registered - Reportwell</title>
      </Helmet>

      <AlreadyRegisteredContainer />
    </>
  );
};

export default AlreadyRegisteredPage;
