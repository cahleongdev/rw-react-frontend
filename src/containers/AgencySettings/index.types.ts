import { z } from 'zod';

export interface User {
  name: string;
  email: string;
  phone: string;
  title: string;
  role: string;
  status: string;
}

export interface AcceptInviteUserData {
  token: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  title: string;
  custom_fields?: Record<string, string>;
  password: string;
  receive_marketing?: boolean;
}

export const inviteUserSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .optional()
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
  title: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
  custom_fields: z.record(z.string()).optional(),
  permissions: z.record(z.string()).optional(),
  profile_image: z.string().optional(),
});

export type InviteUserFormData = z.infer<typeof inviteUserSchema>;
