import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import LinkExpiredComponent from '@components/Auth/SignUp/LinkExpired';

import authService from '@/api/user';

const LinkExpired: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email');

  const [isRequestingNewLink, setIsRequestingNewLink] = useState(false);

  const handleRequestNewLink = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setIsRequestingNewLink(true);
      await authService.requestNewMagicLink(email);
      toast.success('A new magic link has been sent to your email');
      navigate('/check-inbox', { state: { email } });
    } catch (error: any) {
      console.error('Error requesting new magic link:', error);
      const errorMessage =
        error?.response?.data?.message ||
        'Failed to send new magic link. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsRequestingNewLink(false);
    }
  };

  return (
    <LinkExpiredComponent
      email={email || undefined}
      handleRequestNewLink={handleRequestNewLink}
      isRequestingNewLink={isRequestingNewLink}
    />
  );
};

export default LinkExpired;
