import React from 'react';
import { useSearchParams } from 'react-router-dom';

import AlreadyRegisteredComponent from '@components/Auth/SignUp/AlreadyRegistered';

const AlreadyRegistered: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  return <AlreadyRegisteredComponent email={email || undefined} />;
};

export default AlreadyRegistered;
