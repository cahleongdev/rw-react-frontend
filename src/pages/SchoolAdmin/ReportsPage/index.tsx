import React from 'react';
import { Helmet } from 'react-helmet';

import ReportsContainer from '@/containers/Reports/SchoolAdmin';

const Reports: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Reports</title>
      </Helmet>

      <ReportsContainer />
    </>
  );
};

export default Reports;
