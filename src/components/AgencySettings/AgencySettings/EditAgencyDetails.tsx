import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from '@/components/base/Dialog';
import { CustomInput } from '@/components/base/CustomInput';
import { Button } from '@/components/base/Button';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  agencyName: z.string().min(1, 'You must enter an Agency name'),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  county: z.string().optional(),
  yearsOperation: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface EditAgencyDetailsProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  initialValues: FormValues;
}

const EditAgencyDetails = ({
  open,
  onClose,
  onSubmit,
  initialValues,
}: EditAgencyDetailsProps) => {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-[520px] bg-white rounded-lg p-0 gap-0"
        showClose={false}
      >
        <DialogTitle className="hidden" />
        <div className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
          <h3 className="text-slate-700">Edit Agency Details</h3>
          <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 flex flex-col gap-4 justify-center items-center">
            <div className="flex flex-col gap-1 w-full">
              <Controller
                control={control}
                name="agencyName"
                render={({ field, fieldState }) => (
                  <CustomInput
                    placeholder="Agency Name"
                    label="Agency Name"
                    required
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
                name="streetAddress"
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
            <div className="flex flex-row gap-4 w-full">
              <div className="flex flex-col gap-1 grow">
                <Controller
                  control={control}
                  name="city"
                  render={({ field, fieldState }) => (
                    <CustomInput
                      placeholder="City"
                      label="City"
                      className="grow"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-1 w-25">
                <Controller
                  control={control}
                  name="state"
                  render={({ field, fieldState }) => (
                    <CustomInput
                      placeholder="State"
                      label="State"
                      className="w-25"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Controller
                control={control}
                name="county"
                render={({ field, fieldState }) => (
                  <CustomInput
                    placeholder="County"
                    label="County"
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
                name="yearsOperation"
                render={({ field, fieldState }) => (
                  <CustomInput
                    placeholder="Years in Operation"
                    label="Years in Operation"
                    className="w-full"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex-none border-t border-beige-300 bg-beige-50 rounded-b-lg">
            <DialogFooter className="flex justify-end gap-3 p-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="bg-blue-500 body3-semibold text-white leading-[1.0] hover:bg-blue-600"
                type="submit"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAgencyDetails;
