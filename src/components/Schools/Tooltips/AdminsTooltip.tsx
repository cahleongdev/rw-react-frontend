import React from 'react';
import { SchoolUser } from '@/store/slices/schoolUsersSlice';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/base/Tooltip';
import { ListTooltipContent } from '@/components/base/ListTooltip';

interface AdminsTooltipProps {
  admins: SchoolUser[];
}

export const AdminsTooltip: React.FC<AdminsTooltipProps> = ({ admins }) => {
  if (admins.length === 0) return <span className="body1-regular">-</span>;

  const firstAdmin = admins[0];
  const remainingAdmins = admins.slice(1);
  const firstAdminName = `${firstAdmin.first_name} ${firstAdmin.last_name}`;

  if (remainingAdmins.length === 0) {
    return <span className="body1-regular">{firstAdminName}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="body1-regular text-left hover:text-slate-700 focus:outline-none">
            {firstAdminName} +{remainingAdmins.length} more
          </button>
        </TooltipTrigger>
        <ListTooltipContent
          side="bottom"
          align="start"
          sideOffset={5}
          className="w-[200px] rounded-md border border-slate-200 p-0 shadow-md"
        >
          <div className="py-1">
            {remainingAdmins.map((admin) => (
              <div
                key={admin.id}
                className="px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 cursor-default"
              >
                {admin.first_name} {admin.last_name}
              </div>
            ))}
          </div>
        </ListTooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
