import React from 'react';
import { Helmet } from 'react-helmet';
import ComplaintsPageContainer from '@/containers/Complaints/AgencyAdmin';

const ComplaintsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Complaints</title>
      </Helmet>
      <ComplaintsPageContainer />
    </>
  );
};

export default ComplaintsPage;
