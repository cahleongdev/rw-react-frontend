export interface UpdatePersonalProfile {
  first_name: string;
  last_name: string;
  title: string;
  profile_image: string;
  email: string;
  phone_number: string;
  notification_settings: Record<string, boolean>;
}
