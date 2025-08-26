import { HomeIcon as SolidHomeIcon } from '@heroicons/react/24/solid';
import { HomeIcon as OutlineHomeIcon } from '@heroicons/react/24/outline';
import { MenuItem } from '@/store/slices/menuSlice';

export const commonMenuItems: Pick<
  MenuItem,
  'id' | 'label' | 'link' | 'icon' | 'iconSelected'
>[] = [
  {
    id: '0',
    label: 'Home',
    iconSelected: SolidHomeIcon,
    icon: OutlineHomeIcon,
    link: '/home',
  },
  // Inbox and Analytics are NOT here, they are privilege-controlled
];
