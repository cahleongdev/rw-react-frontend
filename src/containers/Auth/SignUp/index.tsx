import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { z } from 'zod';

import SignUpComponent from '@/components/Auth/SignUp/SignUp';
import CreatePasswordComponent from '@/components/Auth/SignUp/CreatePassword';

import { signUpSchema, SignUpStep } from '../index.types';

import authService from '@api/user';
import { loginUser } from '@store/slices/authSlice';
import { AppDispatch } from '@store/index';

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const dispatch: AppDispatch = useDispatch();
  const [step, setStep] = useState(SignUpStep.PERSONAL_INFO);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      title: '',
      role: '',
      custom_fields: {},
      receive_marketing: false,
    },
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const validateToken = async () => {
      try {
        const response = await authService.validateInviteToken(token);
        reset(response); // set form values from API
      } catch (error: any) {
        console.error('Error validating invite token:', error);

        // Handle different types of token validation errors
        const errorType = error?.response?.data?.error;
        const email = error?.response?.data?.email;

        if (errorType === 'expired') {
          // Token is expired
          navigate(
            `/link-expired${email ? `?email=${encodeURIComponent(email)}` : ''}`,
          );
          return;
        }

        if (errorType === 'already_registered') {
          // User is already registered
          navigate(
            `/already-registered${email ? `?email=${encodeURIComponent(email)}` : ''}`,
          );
          return;
        }

        // For other errors, redirect to login
        navigate('/login');
      }
    };

    validateToken();
  }, [token, navigate, reset]);

  const getPasswordRules = (pwd: string) => [
    {
      text: 'At least 8 characters',
      valid: pwd.length >= 8,
    },
    {
      text: 'Upper and lower case letter',
      valid: /[A-Z]/.test(pwd) && /[a-z]/.test(pwd),
    },
    {
      text: 'At least one number',
      valid: /[0-9]/.test(pwd),
    },
    {
      text: 'At least one special character',
      valid: /[^A-Za-z0-9]/.test(pwd),
    },
  ];
  const rules = getPasswordRules(password);

  const handleAcceptInvite = async (data: SignUpFormValues) => {
    if (!token || password !== confirmPassword) return;
    if (!rules.every((rule) => rule.valid)) return;

    try {
      setLoading(true);
      await authService.acceptInvite({
        token,
        password,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone || '',
        title: data.title || '',
        custom_fields: data.custom_fields,
        receive_marketing: data.receive_marketing || false,
      });
      await dispatch(loginUser({ email: data.email, password }));

      toast.success('Account created successfully');
      navigate('/setup-mfa', { replace: true });
    } catch (error: any) {
      console.error('Error accepting invitation:', error);

      // Handle different types of accept invite errors
      const errorType = error?.response?.data?.error;
      const email = error?.response?.data?.email || data.email;

      if (errorType === 'expired') {
        // Token is expired
        navigate(
          `/link-expired${email ? `?email=${encodeURIComponent(email)}` : ''}`,
        );
        return;
      }

      if (errorType === 'already_registered') {
        // User is already registered
        navigate(
          `/already-registered${email ? `?email=${encodeURIComponent(email)}` : ''}`,
        );
        return;
      }

      // Show generic error message for other cases
      const errorMessage =
        error?.response?.data?.message ||
        'Failed to create account. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === SignUpStep.PERSONAL_INFO) {
      setStep(SignUpStep.PASSWORD);
    } else {
      handleSubmit(handleAcceptInvite)();
    }
  };

  return (
    <>
      {step === SignUpStep.PERSONAL_INFO && (
        <SignUpComponent
          control={control}
          errors={errors}
          onNext={handleNext}
        />
      )}
      {step === SignUpStep.PASSWORD && (
        <CreatePasswordComponent
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          rules={rules}
          loading={loading}
          onNext={handleNext}
          onBack={() => setStep(SignUpStep.PERSONAL_INFO)}
        />
      )}
    </>
  );
};

export default SignUp;
