import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import MFAMethodSelectionComponent from '@/components/Auth/LogIn/MFAMethodSelection';
import { clearMFAState } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store';
import { MFAMethod } from '@/containers/Auth/index.types';

const MFAMethodSelection: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { mfaMethods } = useSelector((state: RootState) => state.auth);

  // Apply the same sorting logic as the component to get the preferred default method
  const uniqueMethods = [...new Set(mfaMethods)];
  const methodOrder = [
    MFAMethod.TOTP,
    MFAMethod.SMS,
    MFAMethod.EMAIL,
    MFAMethod.VOICE,
  ];
  const sortedMethods = methodOrder.filter((method) =>
    uniqueMethods.includes(method as string),
  );
  const otherMethods = uniqueMethods.filter(
    (method) => !methodOrder.includes(method as any),
  );
  const allMethods = [...sortedMethods, ...otherMethods];

  // Add backup code at the end if other methods are available and it's not already included
  if (
    uniqueMethods.length > 0 &&
    !uniqueMethods.includes(MFAMethod.BACKUP_CODE)
  ) {
    allMethods.push(MFAMethod.BACKUP_CODE);
  }

  // Select the first method from the sorted list (TOTP will be first if available)
  const [selectedMethod, setSelectedMethod] = useState<string>(
    allMethods[0] || '',
  );

  const handleBack = () => {
    dispatch(clearMFAState());
    navigate('/login');
  };

  const handleMethodSelected = (method: string) => {
    navigate('/mfa-code-verification', { state: { selectedMethod: method } });
  };

  const handleContinue = () => {
    if (selectedMethod) {
      handleMethodSelected(selectedMethod);
    }
  };

  return (
    <MFAMethodSelectionComponent
      allMethods={allMethods}
      selectedMethod={selectedMethod}
      onMethodChange={setSelectedMethod}
      onBack={handleBack}
      onContinue={handleContinue}
    />
  );
};

export default MFAMethodSelection;
