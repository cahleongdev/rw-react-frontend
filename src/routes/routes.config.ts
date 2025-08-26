import { AGENCY_ADMIN_ROUTES } from './config/agencyAdmin.routes';
import { SCHOOL_ADMIN_ROUTES } from './config/schoolAdmin.routes';
import { SUPER_ADMIN_ROUTES } from './config/superAdmin.routes';

export const getProtectedRoutes = (userRole: string) => {
  switch (userRole) {
    case 'Agency_Admin':
      return AGENCY_ADMIN_ROUTES;
    case 'School_Admin':
      return SCHOOL_ADMIN_ROUTES;
    case 'Super_Admin':
      return SUPER_ADMIN_ROUTES;
    default:
      return [];
  }
};
