import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { CustomInput } from '@/components/base/CustomInput';
import { Button } from '@/components/base/Button';
import { Dialog, DialogContent, DialogTitle } from '@/components/base/Dialog';

const schema = z.object({
  first_name: z.string().min(1, 'You must enter a first name'),
  last_name: z.string().min(1, 'You must enter a last name'),
  title: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface PersonalDetailsProps {
  open: boolean;
  firstName: string;
  lastName: string;
  title: string;
  onSubmit: (values: FormValues) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  open,
  firstName,
  lastName,
  title,
  onSubmit,
  onClose,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: firstName,
      last_name: lastName,
      title: title,
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-[520px] bg-white rounded-lg p-0 gap-0"
        showClose={false}
      >
        <DialogTitle hidden />
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
            <h3 className="text-slate-700">Edit Personal Details</h3>
            <XMarkIcon
              className="w-6 h-6 cursor-pointer"
              onClick={() => onClose()}
            />
          </div>
          <div className="flex flex-col p-6 gap-4">
            <div className="flex flex-col gap-1 w-full">
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    placeholder="First Name"
                    label="First Name"
                    required
                    error={errors.first_name?.message}
                    className="w-full"
                    {...field}
                  />
                )}
              />
              {errors.first_name && (
                <div className="body2-regular text-red-700">
                  {errors.first_name.message}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    placeholder="Last Name"
                    label="Last Name"
                    required
                    error={errors.last_name?.message}
                    className="w-full"
                    {...field}
                  />
                )}
              />
              {errors.last_name && (
                <div className="body2-regular text-red-700">
                  {errors.last_name.message}
                </div>
              )}
            </div>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <CustomInput
                  placeholder="Optional"
                  label="Title"
                  className="w-full"
                  {...field}
                />
              )}
            />
          </div>
          <div className="flex flex-row p-4 gap-2 justify-end border-t border-beige-300 bg-beige-50 rounded-b-lg">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              type="submit"
              disabled={isSubmitting || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalDetails;
