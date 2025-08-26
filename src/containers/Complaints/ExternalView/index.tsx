import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ExternalComplaintForm from '@/components/Complaints/ExternalView';

// Form validation schema
export const complaintFormSchema = z.object({
  firstName: z.string().min(1, 'First Name is required.'),
  lastName: z.string().min(1, 'Last Name is required.'),
  email: z.string().email('Email is invalid.').min(1, 'Email is required.'),
  phone: z
    .string()
    .min(1, 'Phone Number is required.')
    .regex(
      /^[+]?[(]?\d{3}[)]?[-\s.]?\d{3}[-\s.]?\d{4,6}$/,
      'Phone Number is invalid. Please use a valid format.',
    ),
  school: z.string().min(1, 'School is required.'),
  message: z.string().min(1, 'Message is required.'),
  wantsFollowUp: z.boolean().optional(),
});

// Form data type
export type ComplaintFormData = z.infer<typeof complaintFormSchema>;

const ExternalComplaintContainer: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
    setValue,
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintFormSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      school: '',
      message: '',
      wantsFollowUp: false,
    },
  });

  const onSubmit = () => {
    setIsSubmitted(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  const handleResetForm = () => {
    reset();
    setIsSubmitted(false);
  };

  return (
    <ExternalComplaintForm
      isSubmitted={isSubmitted}
      control={control}
      register={register}
      errors={errors}
      touchedFields={touchedFields}
      setValue={setValue}
      onSubmit={handleFormSubmit}
      onReset={handleResetForm}
    />
  );
};

export default ExternalComplaintContainer;
