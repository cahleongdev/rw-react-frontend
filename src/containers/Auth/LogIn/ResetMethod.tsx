import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import authService from '@api/user';

import ResetMethodComponent from '@/components/Auth/LogIn/ResetMethod';
import { ResetMethod as ResetMethodType } from '@containers/Auth/index.types';

const ResetMethod: React.FC = () => {
  const [method, setMethod] = useState<ResetMethodType>(ResetMethodType.SMS);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState<{
    email?: string;
    phone?: string;
  }>({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const email = location.state?.email;
    if (!email) {
      navigate('/forgot-password');
      return;
    }

    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        const info = await authService.getContactInfo(email);
        setContactInfo({ ...info });
      } catch (error) {
        console.error('Error fetching contact info:', error);
        navigate('/login');
        setError('Failed to fetch contact information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, [location.state, navigate]);

  const sendResetLink = async () => {
    try {
      setLoading(true);
      await authService.sendResetLink(location.state.email, method);
      navigate('/reset-link-sent', {
        state: {
          method,
          contactInfo,
        },
      });
    } catch (error) {
      console.error('Error sending reset link:', error);
      setError('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResetMethodComponent
      method={method}
      setMethod={setMethod}
      contactInfo={contactInfo}
      error={error}
      loading={loading}
      sendResetLink={sendResetLink}
    />
  );
};

export default ResetMethod;
