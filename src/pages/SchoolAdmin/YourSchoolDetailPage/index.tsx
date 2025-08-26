import React from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

import { RootState } from '@/store';
// import YourSchoolDetailPageContainer from '@containers/Schools/SchoolAdmin';

const YourSchoolDetailPage: React.FC = () => {
  const schoolName = useSelector((state: RootState) => {
    const id = state.uiState.selectedSchoolIdForAdmin;
    const school = id ? state.schools.schools.find((s) => s.id === id) : null;
    return school?.name;
  });

  return (
    <>
      <Helmet>
        <title>{`${schoolName || 'Your School'} - Reportwell`}</title>
      </Helmet>
      {/* <YourSchoolDetailPageContainer /> */}
    </>
  );
};

export default YourSchoolDetailPage;
