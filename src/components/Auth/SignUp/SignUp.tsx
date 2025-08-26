import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { CustomInput } from '@/components/base/CustomInput';
import { Checkbox } from '@/components/base/Checkbox';
import { Button } from '@/components/base/Button';

interface SignUpFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  title?: string;
  role: string;
  custom_fields?: Record<string, string>;
  receive_marketing?: boolean;
}

interface SignUpProps {
  control: Control<SignUpFormValues>;
  errors: FieldErrors<SignUpFormValues>;
  onNext: (e?: React.BaseSyntheticEvent) => void;
  assignedSchools?: { name: string; type?: string }[];
}

const SignUp: React.FC<SignUpProps> = ({
  control,
  errors,
  onNext,
  // assignedSchools,
}) => {
  return (
    <form onSubmit={onNext} className="flex h-full">
      <div className="flex flex-col h-full w-1/2 justify-center items-center">
        <div className="flex flex-col w-[600px] gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="title text-slate-950">Welcome to Reportwell</div>
            <div className="h3">Check your information</div>
          </div>
          <div className="flex flex-col items-center px-2 pb-4 gap-6 overflow-y-auto max-h-[60vh]">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-row gap-4">
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      {...field}
                      placeholder="James"
                      label="First Name"
                      className="grow"
                      required
                      error={errors.first_name?.message}
                    />
                  )}
                />
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      {...field}
                      placeholder="Davidson"
                      label="Last Name"
                      className="grow"
                      required
                      error={errors.last_name?.message}
                    />
                  )}
                />
              </div>
              <div className="flex flex-row gap-4">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      {...field}
                      placeholder="JDavidson@gmail.com"
                      label="Email"
                      className="grow"
                      required
                      error={errors.email?.message}
                    />
                  )}
                />
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      {...field}
                      placeholder="(555) 555-5555"
                      label="Phone"
                      className="grow"
                      error={errors.phone?.message}
                    />
                  )}
                />
              </div>
              <div className="flex flex-row gap-4">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      {...field}
                      placeholder="Agency Admin"
                      label="Title"
                      className="grow"
                      error={errors.title?.message}
                    />
                  )}
                />
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => {
                    const formattedRole = field.value
                      ? field.value.split('_').join(' ')
                      : '';
                    return (
                      <CustomInput
                        {...field}
                        value={formattedRole}
                        placeholder="[Role]"
                        label="Role"
                        className="grow"
                        required
                        error={errors.role?.message}
                        disabled
                      />
                    );
                  }}
                />
              </div>
            </div>
            {/* {assignedSchools &&
              assignedSchools.length > 0 && ( // TODO: Assigned Schools for School Users.
                <div className="flex flex-col gap-2 pt-4 pb-2 w-full">
                  <h5>Assigned Schools</h5>
                  <div className="flex flex-row gap-4">
                    {assignedSchools.map((school, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col rounded-[5px] border border-slate-200 p-2 w-[200px]"
                      >
                        <div className="body2-medium">{school.name}</div>
                        {school.type && (
                          <div className="body2-regular">{school.type}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
            {control._defaultValues.custom_fields &&
              Object.keys(control._defaultValues.custom_fields).length > 0 && (
                <div className="flex flex-col gap-2 w-full">
                  <h5>Additional Info</h5>
                  <div className="flex flex-col gap-4">
                    {Object.keys(control._defaultValues.custom_fields).map(
                      (key) => (
                        <Controller
                          name={`custom_fields.${key}`}
                          control={control}
                          render={({ field }) => (
                            <CustomInput
                              {...field}
                              placeholder={`Enter ${key}`}
                              label={key}
                              error={errors.custom_fields?.[key]?.message}
                            />
                          )}
                        />
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>
          <div className="flex flex-row gap-2 items-center cursor-pointer w-full">
            <Controller
              name="receive_marketing"
              control={control}
              render={({ field }) => (
                <>
                  <Checkbox
                    id="receiveMarketing"
                    checked={field.value}
                    className="border-slate-700 bg-white data-[state=checked]:border-none"
                    onCheckedChange={(value) => field.onChange(value)}
                  />
                  <label
                    htmlFor="receiveMarketing"
                    className="body2-regular text-slate-700 cursor-pointer"
                  >
                    I agree to receive marketing materials from Reportwell
                  </label>
                </>
              )}
            />
          </div>
          <Button
            className="w-full text-white bg-blue-500 hover:bg-blue-600"
            type="submit"
          >
            Continue
          </Button>
        </div>
      </div>
      <div className="flex h-full w-1/2 p-4">
        <div className="w-full rounded-[10px] bg-[linear-gradient(180deg,_#F97316,_#f973161a)]">
          <div className="flex flex-col gap-4 justify-center items-center h-full">
            <img
              src="/assets/images/logos/reportwell-border.svg"
              alt="Reportwell Logo"
              width={200}
              height={178}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default SignUp;
