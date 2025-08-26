// Validation helper functions
export const isValidZipCode = (zipcode: string): boolean => {
  return /^\d{5}$/.test(zipcode);
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  return /^\d{10}$/.test(phone.replace(/\D/g, ''));
};

// More flexible phone validation, allowing common formatting
export const isValidFormattedPhone = (phone: string): boolean => {
  return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone);
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 0) return '';
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6)
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
};

export interface ValidationErrors {
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  zipcode?: string;
  address?: string;
  city?: string;
  state?: string;
  school_type?: string;
  custom_fields: Record<string, string>;
  [key: string]: string | Record<string, string> | undefined;
}

export const validateField = (
  name: string,
  value: string,
  type?: string,
): string => {
  if (!value && type !== 'File Upload') return 'This field is required';

  switch (name) {
    case 'zipcode':
      return !isValidZipCode(value) ? 'ZIP code must be 5 digits' : '';
    case 'email':
      return !isValidEmail(value) ? 'Invalid email address' : '';
    case 'phone_number':
      return !isValidPhone(value) ? 'Phone number must be 10 digits' : '';
    default:
      if (type) {
        switch (type) {
          case 'Email':
            return !isValidEmail(value) ? 'Invalid email address' : '';
          case 'Phone':
            return !isValidPhone(value) ? 'Phone number must be 10 digits' : '';
          default:
            return '';
        }
      }
      return '';
  }
};
