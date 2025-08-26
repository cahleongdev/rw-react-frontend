import React from 'react';
import { Helmet } from 'react-helmet';

import ReportsContainer from '@/containers/Reports/AgencyAdmin';

const Reports: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Report Templates</title>
      </Helmet>

      <ReportsContainer />
    </>
  );
};

export default Reports;
