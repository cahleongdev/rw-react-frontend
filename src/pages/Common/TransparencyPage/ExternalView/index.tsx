import React from 'react';
import { Helmet } from 'react-helmet';

import TransparencyExternalViewContainer from '@containers/Transparency/ExternalView';

const TransparencyPageExternalView: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Transparency</title>
      </Helmet>

      <TransparencyExternalViewContainer />
    </>
  );
};

export default TransparencyPageExternalView;
