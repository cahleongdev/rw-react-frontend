import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ResetLinkSentComponent from '@/components/Auth/LogIn/ResetLinkSent';

const ResetLinkSent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // If we don't have the required state, redirect to forgot password
  if (!location.state?.method || !location.state?.contactInfo) {
    navigate('/forgot-password');
    return null;
  }

  return (
    <ResetLinkSentComponent
      method={location.state.method}
      contactInfo={location.state.contactInfo}
    />
  );
};

export default ResetLinkSent;
