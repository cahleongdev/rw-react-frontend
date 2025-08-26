import React from 'react';
import { Helmet } from 'react-helmet';

import HomeContainer from '@/containers/Home';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <HomeContainer />
    </>
  );
};

export default Home;
