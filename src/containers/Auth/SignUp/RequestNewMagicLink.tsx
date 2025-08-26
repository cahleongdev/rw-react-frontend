import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import RequestNewMagicLinkComponent from '@components/Auth/SignUp/RequestNewMagicLink';

import authService from '@/api/user';

const RequestNewMagicLink: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [isRequestingNewLink, setIsRequestingNewLink] = useState(false);

  const handleRequestNewLink = useCallback(async () => {
    if (!email) {
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
  }, [email, navigate]);

  useEffect(() => {
    handleRequestNewLink();
  }, [handleRequestNewLink]);

  return (
    <RequestNewMagicLinkComponent
      email={email || ''}
      isRequestingNewLink={isRequestingNewLink}
    />
  );
};

export default RequestNewMagicLink;
