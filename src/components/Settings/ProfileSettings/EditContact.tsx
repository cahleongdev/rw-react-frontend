import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { CustomInput } from '@/components/base/CustomInput';
import { Button } from '@/components/base/Button';
import { Dialog, DialogContent, DialogTitle } from '@/components/base/Dialog';

const schema = z.object({
  // email: z.string().email('Invalid email').min(1, 'You must enter an email'),
  phone: z
    .string()
    .refine(
      (val) =>
        !val ||
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
          val.replace(/\s/g, ''),
        ),
      {
        message: 'Invalid phone number',
      },
    ),
});

type FormValues = z.infer<typeof schema>;

interface EditContactProps {
  email: string;
  phone: string;
  onSubmit: (values: FormValues) => void;
  onClose: () => void;
  open: boolean;
  isLoading?: boolean;
}

const EditContact: React.FC<EditContactProps> = ({
  email,
  phone,
  onSubmit,
  onClose,
  open,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone,
    },
  });

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-[520px] bg-white rounded-lg p-0 gap-0"
        showClose={false}
      >
        <DialogTitle hidden />
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
            <h3 className="text-slate-700">Edit Contact Info</h3>
            <XMarkIcon
              className="w-6 h-6 cursor-pointer"
              onClick={() => onClose()}
            />
          </div>
          <div className="flex flex-col p-6 gap-4">
            <div className="flex flex-col gap-1 w-full">
              <CustomInput
                placeholder="Email"
                label="Email"
                className="w-full cursor-not-allowed"
                value={email}
                disabled
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    placeholder="Phone"
                    label="Phone"
                    error={errors.phone?.message}
                    className="w-full"
                    {...field}
                  />
                )}
              />
              {errors.phone && (
                <div className="body2-regular text-red-700">
                  {errors.phone.message}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row p-4 gap-2 justify-end border-t border-beige-300 bg-beige-50 rounded-b-lg">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
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

export default EditContact;
