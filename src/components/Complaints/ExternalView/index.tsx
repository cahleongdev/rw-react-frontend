import React from 'react';
import type {
  UseFormRegister,
  Control,
  FieldErrors,
  UseFormSetValue,
} from 'react-hook-form';
import type { ComplaintFormData } from '@/containers/Complaints/ExternalView';
import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';
import { Textarea } from '@/components/base/Textarea';
import { Checkbox } from '@/components/base/Checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select';
import { Controller } from 'react-hook-form';
import { cn } from '@/utils/tailwind';
// Mock data for schools - replace with actual data fetching later
const mockSchools = [
  { id: '1', name: 'Avon High School' },
  { id: '2', name: 'Devin High School' },
  { id: '3', name: 'South Pasadena High School' },
  { id: '4', name: 'Doggo University' },
  { id: '5', name: 'Cloverfield High' },
];

// Agency name - replace with actual data later if needed
const AGENCY_NAME = 'Prometheus';

interface ExternalComplaintFormProps {
  isSubmitted: boolean;
  control: Control<ComplaintFormData>;
  register: UseFormRegister<ComplaintFormData>;
  errors: FieldErrors<ComplaintFormData>;
  touchedFields: Partial<Record<keyof ComplaintFormData, boolean>>;
  setValue: UseFormSetValue<ComplaintFormData>;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

const ExternalComplaintForm: React.FC<ExternalComplaintFormProps> = ({
  isSubmitted,
  control,
  register,
  errors,
  touchedFields,
  setValue,
  onSubmit,
  onReset,
}) => {
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col h-full">
        <div className="h-12 w-full py-2 px-6 flex justify-between items-center bg-beige-50 border-b border-beige-400 flex-shrink-0">
          <div className="h-8 gap-2 rounded flex items-center justify-center text-slate-500 text-xs md:text-sm">
            <img src="/assets/avatars/prometheus-agency.svg" alt="Logo" />
            <span className="text-slate-700 body1-bold">Prometheus</span>
          </div>
          <div className="flex items-center gap-2 h-8">
            <span className="text-slate-500 body2-regular">Powered by</span>
            <img src="/assets/avatars/reportwell-logo.svg" alt="Logo" />
          </div>
        </div>
        <main className="flex-grow flex flex-col items-center justify-center py-10 px-6 md:px-16 text-center">
          <div className="flex flex-col items-center gap-4 max-w-md">
            <img
              src="/assets/images/svg/submission-success.png"
              alt="Submission Success"
              className="w-20 h-20 md:w-24 md:h-24"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-slate-950">
              Report Submitted!
            </h1>
            <p className="text-slate-500 body1-medium mb-6">
              We have successfully received your report and we'll act on it as
              soon as we can.
            </p>
            <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-col sm:items-center sm:gap-3 w-full">
              <Button
                variant="default"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-[52px]"
                onClick={() => alert('Redirecting to homepage...')}
              >
                Back to Homepage
              </Button>
              <Button
                variant="ghost"
                className="w-full h-[52px] text-blue-500 button1-semibold"
                onClick={onReset}
              >
                Submit another concern or complaint
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col h-full">
      <div className="h-12 w-full py-2 px-6 flex justify-between items-center bg-beige-50 border-b border-beige-400 flex-shrink-0">
        <div className="h-8 gap-2 rounded flex items-center justify-center text-slate-500 text-xs md:text-sm">
          <img src="/assets/avatars/prometheus-agency.svg" alt="Logo" />
          <span className="text-slate-700 body1-bold">Prometheus</span>
        </div>
        <div className="flex items-center gap-2 h-8">
          <span className="text-slate-500 body2-regular">Powered by</span>
          <img src="/assets/avatars/reportwell-logo.svg" alt="Logo" />
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center w-full h-full">
        <div className="flex-1 py-10 px-16 h-full items-center justify-center flex flex-col">
          <div className="flex flex-col gap-4">
            <h1 className="text-slate-950">Report a Concern or Complaint</h1>
            <p className="text-slate-500 body1-medium">
              If you have a concern or complaint regarding a specific school,
              please use this form to provide the necessary details. Our team
              will review your submission and address it accordingly. We value
              your feedback and strive to maintain high standards within our
              educational institutions.
            </p>

            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="firstName"
                    {...register('firstName', {
                      onChange: (e) => {
                        setValue('firstName', e.target.value, {
                          shouldValidate: true,
                        });
                      },
                    })}
                    className={cn(
                      errors.firstName &&
                        touchedFields.firstName &&
                        'border-red-500',
                    )}
                  />
                  {errors.firstName && touchedFields.firstName && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="lastName"
                    {...register('lastName', {
                      onChange: (e) => {
                        setValue('lastName', e.target.value, {
                          shouldValidate: true,
                        });
                      },
                    })}
                    className={cn(
                      errors.lastName &&
                        touchedFields.lastName &&
                        'border-red-500',
                    )}
                  />
                  {errors.lastName && touchedFields.lastName && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    id="email"
                    {...register('email', {
                      onChange: (e) => {
                        setValue('email', e.target.value, {
                          shouldValidate: true,
                        });
                      },
                    })}
                    className={cn(
                      errors.email && touchedFields.email && 'border-red-500',
                    )}
                  />
                  {errors.email && touchedFields.email && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    id="phone"
                    {...register('phone', {
                      onChange: (e) => {
                        setValue('phone', e.target.value, {
                          shouldValidate: true,
                        });
                      },
                    })}
                    className={cn(
                      errors.phone && touchedFields.phone && 'border-red-500',
                    )}
                  />
                  {errors.phone && touchedFields.phone && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="school"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  School <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="school"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger
                        className={cn(
                          'w-full',
                          errors.school &&
                            touchedFields.school &&
                            'border-red-500',
                        )}
                      >
                        <SelectValue placeholder="Choose from list of schools" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockSchools.map((school) => (
                          <SelectItem key={school.id} value={school.name}>
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.school && touchedFields.school && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.school.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Describe your concern or complaint{' '}
                  <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  rows={4}
                  {...register('message', {
                    onChange: (e) => {
                      setValue('message', e.target.value, {
                        shouldValidate: true,
                      });
                    },
                  })}
                  className={cn(
                    errors.message && touchedFields.message && 'border-red-500',
                  )}
                  placeholder="Please provide as much information as possible so that we may better help you"
                />
                {errors.message && touchedFields.message && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Controller
                    name="wantsFollowUp"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="wantsFollowUp"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="wantsFollowUp" className="text-slate-600">
                    I would like {AGENCY_NAME} to follow up with me regarding
                    this
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-[52px]"
              >
                Submit Report
              </Button>
            </form>
          </div>
        </div>

        <div className="h-full flex-1 p-4">
          <img
            src="/assets/images/complaint-form.png"
            alt="Person writing on a form"
            className="block object-cover h-full rounded-[10px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ExternalComplaintForm;
