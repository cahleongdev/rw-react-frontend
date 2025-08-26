import { XMarkIcon } from '@heroicons/react/24/outline';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  TransparencyContactDetail,
  TransparencyDetail,
  TransparencyDetailSchema,
} from '@containers/Transparency/index.types';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { CustomInput } from '@/components/base/CustomInput';

import { formatPhoneNumber } from '@utils/validation';

interface EditContactDetailsProps {
  onSubmit: (formData: TransparencyContactDetail) => void;
  onClose: () => void;
  open: boolean;
  transparencyDetail: TransparencyDetail;
}

const schema = TransparencyDetailSchema.pick({
  contact_phone_number: true,
  contact_email: true,
  street_address: true,
  city: true,
  state: true,
  zipcode: true,
});

type FormValues = z.infer<typeof schema>;

const EditContactDetails = ({
  onSubmit,
  onClose,
  open,
  transparencyDetail,
}: EditContactDetailsProps) => {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: transparencyDetail,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[520px] bg-white p-0 flex flex-col gap-0 rounded-[16px]"
        showClose={false}
      >
        <div className="flex-none">
          <div className="flex items-center justify-between border-slate-200 p-4 border-b border-slate-200">
            <DialogTitle className="text-slate-700">
              Edit Contact Details
            </DialogTitle>
            <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
            <DialogDescription className="text-slate-700 hidden">
              Edit the contact details for the transparency page.
            </DialogDescription>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1 w-full">
              <Controller
                control={control}
                name="contact_phone_number"
                render={({ field, fieldState }) => (
                  <CustomInput
                    placeholder="Phone Number"
                    label="Phone Number"
                    required
                    className="w-full"
                    error={fieldState.error?.message}
                    {...field}
                    onChange={(e) =>
                      field.onChange(formatPhoneNumber(e.target.value))
                    }
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Controller
                control={control}
                name="contact_email"
                render={({ field, fieldState }) => (
                  <CustomInput
                    placeholder="Email"
                    label="Email"
                    className="w-full"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Controller
                control={control}
                name="street_address"
                render={({ field, fieldState }) => (
                  <CustomInput
                    placeholder="Street Address"
                    label="Street Address"
                    className="w-full"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Controller
                control={control}
                name="city"
                render={({ field, fieldState }) => (
                  <CustomInput
                    placeholder="City"
                    label="City"
                    className="w-full"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="flex flex-row gap-4 w-full">
              <div className="flex flex-col gap-1 w-full">
                <Controller
                  control={control}
                  name="zipcode"
                  render={({ field, fieldState }) => (
                    <CustomInput
                      placeholder="Zip Code"
                      label="Zip Code"
                      className="w-full"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <Controller
                  control={control}
                  name="state"
                  render={({ field, fieldState }) => (
                    <CustomInput
                      placeholder="State"
                      label="State"
                      className="w-full"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="flex-none border-t border-slate-200">
          <DialogFooter className="flex justify-end gap-3 p-4 bg-beige-100 ">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-[3px] border-slate-500 p-[8px_12px]"
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 text-white hover:bg-blue-600 rounded-[3px] p-[8px_12px]"
                onClick={handleSubmit(onSubmit)}
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactDetails;
