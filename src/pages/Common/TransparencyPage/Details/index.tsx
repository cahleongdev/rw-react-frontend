import React from 'react';
import { Helmet } from 'react-helmet';

import TransparencyContainer from '@containers/Transparency';

const Transparency: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Transparency</title>
      </Helmet>

      <TransparencyContainer />
    </>
  );
};

export default Transparency;
