import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

import {
  TransparencyDetail,
  TransparencyDetailSchema,
  TransparencyLinkFields,
} from '@containers/Transparency/index.types';

import { CustomInput } from '@/components/base/CustomInput';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { zodResolver } from '@hookform/resolvers/zod';
interface EditLinkFieldsProps {
  open: boolean;
  onSubmit: (formData: TransparencyLinkFields) => void;
  onClose: () => void;
  transparencyDetail: TransparencyDetail;
}

const schema = TransparencyDetailSchema.pick({
  help_faqs_url: true,
  contact_form_url: true,
  privacy_policy_url: true,
  website_homepage_url: true,
  custom_domain_url: true,
});
type FormValues = z.infer<typeof schema>;

const EditLinkFields: React.FC<EditLinkFieldsProps> = ({
  open,
  onSubmit,
  onClose,
  transparencyDetail,
}: EditLinkFieldsProps) => {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: transparencyDetail,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[520px] bg-white rounded-[8px] p-0"
        showClose={false}
      >
        <DialogHeader className="flex flex-row justify-between items-center border-slate-200 border-b border-slate-200 p-4">
          <DialogTitle className="text-xl font-medium">Edit Links</DialogTitle>
          <DialogDescription className="text-slate-700 hidden">
            Edit the links for the transparency page.
          </DialogDescription>
          <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
        </DialogHeader>
        <div className="flex flex-col px-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <Controller
                control={control}
                name="help_faqs_url"
                render={({ field, fieldState }) => (
                  <CustomInput
                    placeholder="Enter Help/FAQs URL"
                    label="Help/FAQs"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="contact_form_url"
                render={({ field, fieldState }) => (
                  <CustomInput
                    placeholder="Enter Contact Form URL"
                    label="Contact Form"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="privacy_policy_url"
                render={({ field, fieldState }) => (
                  <CustomInput
                    placeholder="Enter Privacy Policy URL"
                    label="Privacy Policy"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="website_homepage_url"
                render={({ field, fieldState }) => (
                  <CustomInput
                    placeholder="Enter Website Homepage URL"
                    label="Website Homepage"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="custom_domain_url"
                render={({ field, fieldState }) => (
                  <CustomInput
                    placeholder="Enter Custom Domain"
                    label="Custom Domain"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </form>
        </div>
        <DialogFooter className="border-slate-200 border-t border-slate-200 p-4 bg-beige-100 rounded-b-[8px]">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditLinkFields;
