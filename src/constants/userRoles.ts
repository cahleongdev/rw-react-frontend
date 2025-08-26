export const USER_ROLES = {
  Agency_Admin: 'Agency Admin',
  Super_Admin: 'Super Admin',
  Board_Member: 'View Only',
  School_User: 'School User',
  School_Admin: 'School Admin',
} as const;

export type UserRoleKey = keyof typeof USER_ROLES;

export type UserRoleDisplay = (typeof USER_ROLES)[UserRoleKey];
