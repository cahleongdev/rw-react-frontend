import React from 'react';
import { Link } from 'react-router-dom';

import { SidebarMenuItem } from '@/components/base/Sidebar';

interface CustomMenuItemProps {
  label: string;
  icon: React.ReactNode;
  iconSelected: React.ReactNode;
  selected: boolean;
  link: string;
}

const CustomMenuItem: React.FC<CustomMenuItemProps> = ({
  label,
  icon,
  iconSelected,
  link,
  selected = false,
}) => (
  <Link to={link}>
    <SidebarMenuItem
      className={`flex cursor-pointer items-center gap-2 w-full p-2 rounded-[6px] transition border ${selected
        ? 'border-blue-500 bg-blue-100 text-blue-600'
        : 'border-transparent text-slate-700'
        }`}
    >
      {selected ? iconSelected : icon}
      <span className="body2-regular">{label}</span>
    </SidebarMenuItem>
  </Link>
);

export default CustomMenuItem;
