import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ChevronDownIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  TransparencySchool,
  TransparencySchoolSchema,
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
import {
  Select,
  SelectGroup,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from '@components/base/Select';
import { Checkbox } from '@components/base/Checkbox';
import { ScrollArea } from '@components/base/ScrollArea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/base/Popover';
import { Input } from '@components/base/Input';
import { CustomFileUploadInput } from '@components/base/FileUploadInput';

import { cn } from '@utils/tailwind';
import { formatPhoneNumber } from '@utils/validation';
import { formatGradeRange, GradeOption } from '@utils/gradeFormatting';

const gradeOptions: GradeOption[] = [
  { value: 'K', label: 'Kindergarten' },
  { value: '1', label: '1st Grade' },
  { value: '2', label: '2nd Grade' },
  { value: '3', label: '3rd Grade' },
  { value: '4', label: '4th Grade' },
  { value: '5', label: '5th Grade' },
  { value: '6', label: '6th Grade' },
  { value: '7', label: '7th Grade' },
  { value: '8', label: '8th Grade' },
  { value: '9', label: '9th Grade' },
  { value: '10', label: '10th Grade' },
  { value: '11', label: '11th Grade' },
  { value: '12', label: '12th Grade' },
];

interface DateInputProps {
  value: string | undefined;
  onChange: (date: string) => void;
  className?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  className,
  placeholder,
  disabled,
  label,
  error,
}: DateInputProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="body2-medium text-slate-700">{label}</label>}
      <Input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={cn('flex items-center gap-0', className)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && (
        <div className="text-red-500 body2-regular text-slate-700">{error}</div>
      )}
    </div>
  );
};

interface EditSchoolTransparencyDetailsFormProps {
  open: boolean;
  onClose: () => void;
  onFileSelected: (files: File[]) => void;
  previewUrl: string | null;
  setPreviewUrl: (previewUrl: string | null) => void;
  onFormSubmit: (formData: z.infer<typeof TransparencySchoolSchema>) => void;
  gradeServed: string[];
  setGradeServed: (grades: string[]) => void;
  school: TransparencySchool;
}

const EditSchoolTransparencyDetailsForm: React.FC<
  EditSchoolTransparencyDetailsFormProps
> = ({
  open,
  onClose,
  onFileSelected,
  previewUrl,
  setPreviewUrl,
  onFormSubmit,
  gradeServed,
  setGradeServed,
  school,
}: EditSchoolTransparencyDetailsFormProps) => {
  const { control, handleSubmit, setValue } = useForm<
    z.infer<typeof TransparencySchoolSchema>
  >({
    resolver: zodResolver(TransparencySchoolSchema),
    defaultValues: {
      ...school,
      gradeserved: gradeServed,
    },
  });

  const years = Array.from(
    { length: 100 },
    (_, index) => new Date().getFullYear() - index,
  );

  const getSelectedGradesLabel = () => {
    if (!gradeServed || gradeServed.length === 0) {
      return 'Select grades...';
    }
    return formatGradeRange(gradeServed, gradeOptions);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1020px] bg-white rounded-[8px] p-0">
        <DialogHeader className="p-4 border-b border-slate-200">
          <DialogTitle className="text-xl">
            Edit Schools Visible Data
          </DialogTitle>
          <DialogDescription className="text-slate-700 py-2">
            Edit the data that will be visible to the public on the school's
            transparency page.
          </DialogDescription>
        </DialogHeader>
        <div className="px-4">
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="grid grid-cols-2 gap-4 px-4 pb-4 max-h-[420px] ">
              <div className="flex flex-col gap-2">
                <Controller
                  control={control}
                  name="address"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <CustomInput
                        placeholder="Enter Address"
                        label="Address"
                        error={fieldState.error?.message}
                        {...field}
                      />
                      <p className="text-red-500 body2-regular text-red-700">
                        {fieldState.error?.message}
                      </p>
                    </div>
                  )}
                />
                <div className="flex flex-row gap-2">
                  <Controller
                    control={control}
                    name="gradeserved"
                    render={({ field, fieldState }) => (
                      <div className="flex flex-col gap-2 w-full">
                        <p className="body2-medium text-slate-700">
                          Grades Served
                        </p>
                        <Popover>
                          <PopoverTrigger className="w-full">
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-full justify-between border-slate-300 font-normal',
                                !gradeServed ||
                                  (gradeServed.length === 0 &&
                                    'text-muted-foreground'),
                              )}
                              type="button"
                            >
                              <span className="truncate body2-regular text-slate-900">
                                {getSelectedGradesLabel()}
                              </span>
                              <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[240px] max-h-[--radix-popover-content-available-height] p-0 z-[200] overflow-hidden">
                            <ScrollArea>
                              <div className="p-2 space-y-1">
                                {gradeOptions.map((option) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center gap-2 p-1 rounded hover:bg-slate-100"
                                  >
                                    <Checkbox
                                      id={`grade-${option.value}`}
                                      checked={field.value.includes(
                                        option.value,
                                      )}
                                      onCheckedChange={(check) => {
                                        const newGradeServed = check
                                          ? [...gradeServed, option.value]
                                          : gradeServed.filter(
                                              (grade) => grade !== option.value,
                                            );
                                        setGradeServed(newGradeServed);
                                        field.onChange({
                                          target: {
                                            name: 'gradeserved',
                                            value: newGradeServed,
                                          },
                                        });
                                      }}
                                    />
                                    <label
                                      htmlFor={`grade-${option.value}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </PopoverContent>
                        </Popover>
                        <p className="text-red-500 body2-regular text-red-700">
                          {fieldState.error?.message}
                        </p>
                      </div>
                    )}
                  />
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <Controller
                    control={control}
                    name="contract_expires"
                    render={({ field, fieldState }) => (
                      <div className="flex flex-col gap-1 w-full items-top mb-auto">
                        <div className="flex flex-col gap-1 w-full">
                          <DateInput
                            label="Contract Expires"
                            className={cn(
                              'gap-0 w-full items-center min-w-[200px]',
                              fieldState.error?.message ? 'border-red-500' : '',
                            )}
                            value={field.value || ''}
                            onChange={(date) =>
                              field.onChange({
                                target: {
                                  name: 'contract_expires',
                                  value: date,
                                },
                              })
                            }
                          />
                          <p className="text-red-500 body2-regular text-red-700">
                            {fieldState.error?.message}
                          </p>
                        </div>
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name="founded_at"
                    render={({ field, fieldState }) => (
                      <div className="flex flex-col gap-1 w-full mb-auto">
                        <div className="flex flex-col gap-1 w-full">
                          <p className="body2-medium text-slate-700">
                            Opened In
                          </p>
                          <Select
                            onValueChange={(value) =>
                              field.onChange({
                                target: { name: 'founded_at', value },
                              } as React.ChangeEvent<HTMLInputElement>)
                            }
                            {...field}
                            value={field.value || ''}
                          >
                            <SelectTrigger
                              className={cn(
                                'w-full h-9 text-sm',
                                fieldState.error?.message
                                  ? 'border-red-500'
                                  : '',
                              )}
                            >
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel className="body2-medium text-slate-700">
                                  Opened In
                                </SelectLabel>
                                {years.map((year) => (
                                  <SelectItem
                                    key={year}
                                    value={year.toString()}
                                  >
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <p className="text-red-500 body2-regular text-red-700">
                            {fieldState.error?.message || ''}
                          </p>
                        </div>
                      </div>
                    )}
                  />
                </div>
                <Controller
                  control={control}
                  name="contact_phone_number"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <CustomInput
                        placeholder="Enter Contact Phone"
                        label="Contact Phone"
                        error={fieldState.error?.message}
                        {...field}
                        onChange={(e) =>
                          field.onChange(formatPhoneNumber(e.target.value))
                        }
                        value={field.value || ''}
                      />
                      <p className="text-red-500 body2-regular text-red-700">
                        {fieldState.error?.message}
                      </p>
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="website_url"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <CustomInput
                        placeholder="Enter Website"
                        label="Website"
                        error={fieldState.error?.message}
                        {...field}
                        value={field.value || ''}
                      />
                      <p className="text-red-500 body2-regular text-red-700">
                        {fieldState.error?.message}
                      </p>
                    </div>
                  )}
                />
              </div>
              <Controller
                control={control}
                name="logo"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-2">
                    <div
                      className={`flex flex-col gap-2 justify-center  overflow-y-auto items-center ${!previewUrl ? 'hidden' : ''}`}
                    >
                      <img
                        src={previewUrl || school.logo}
                        alt="Preview"
                        className="max-h-[300px] max-w-[300px] object-cover"
                      />
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          setValue('logo', '');
                          setPreviewUrl(null);
                        }}
                        type="button"
                      >
                        Remove Logo
                      </Button>
                    </div>
                    <div
                      className={`flex flex-col gap-2 ${previewUrl ? 'hidden' : ''}`}
                    >
                      <CustomFileUploadInput
                        icon={
                          <PhotoIcon className="h-12 w-12 text-slate-400" />
                        }
                        label="School Logo"
                        onFilesSelected={onFileSelected}
                        onFileUploaded={(fileUrl) => {
                          setValue('logo', fileUrl);
                          setPreviewUrl(fileUrl);
                        }}
                        allowedTypes={['.png', '.jpg']}
                        multiple={false}
                        maxSize={2}
                        className={cn(
                          'w-full',
                          fieldState.error?.message ? 'border-red-500' : '',
                        )}
                        autoUpload={false}
                        error={fieldState.error?.message}
                        {...field}
                      />
                    </div>
                  </div>
                )}
              />
            </div>
          </form>
        </div>
        <DialogFooter className="p-4 border-t border-slate-200 bg-beige-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleSubmit(onFormSubmit)}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSchoolTransparencyDetailsForm;
