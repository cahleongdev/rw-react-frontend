import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/base/Tooltip';
// Corrected type imports
import { SchoolUser } from '@/store/slices/schoolUsersSlice';
import { SchoolResponse } from '@/store/slices/schoolsSlice';
import { Button } from '@/components/base/Button';
import { ChatBubbleLeftIcon, UserIcon } from '@heroicons/react/24/outline';

interface UserTooltipProps {
  user: SchoolUser;
  children: React.ReactNode;
  schools?: SchoolResponse[];
}

export const UserTooltip: React.FC<UserTooltipProps> = ({
  user,
  children,
  schools = [],
}) => {
  const userSchoolNames = schools
    .filter((school) => user.schools.includes(school.id))
    .map((school) => school.name);

  const primarySchool = userSchoolNames[0] || 'No school assigned';

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className="bg-white rounded-lg shadow-lg p-0 border-none"
          sideOffset={5}
        >
          <div className="w-[561px] overflow-hidden rounded-lg">
            <div className="flex">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-[200px] h-[200px] object-cover"
                />
              ) : (
                <div className="w-[200px] h-[200px] bg-beige-50 flex items-center justify-center bg-orange-50">
                  <div className="w-[107px] h-[107px] border border-orange-300 rounded-full bg-orange-100 flex items-center justify-center">
                    <h1 className="text-orange-800">
                      {`${user.first_name[0]}${user.last_name[0]}`}
                    </h1>
                  </div>
                </div>
              )}
              <div className="flex flex-col justify-between flex-1">
                <div className="p-4 flex flex-col gap-1">
                  <p className="body1-bold text-slate-800">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="body2-regular text-slate-800">
                    {user.title}, {primarySchool}
                  </p>
                  <div className="text-sm">
                    <p className="body2-regular text-slate-800">
                      {user.email} | {user.phone_number}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="body2-regular text-slate-500">Role:</span>
                    <span className="body2-regular text-slate-800">
                      {user.role?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 p-4 border-t border-beige-200 bg-beige-50">
                  <Button
                    variant="outline"
                    className="p-[8px_12px] gap-2 border-slate-700"
                  >
                    <ChatBubbleLeftIcon className="w-4 h-4 text-slate-700" />
                    <span className="button3-semibold text-slate-700">
                      Message
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="p-[8px_12px] gap-2 border-slate-700"
                  >
                    <UserIcon className="w-4 h-4 text-slate-700" />
                    <span className="button3-semibold text-slate-700">
                      View details
                    </span>
                  </Button>
                  <div className="flex items-center gap-[5px] p-[4px_8px] border border-slate-300 rounded-[6px] bg-white">
                    <div
                      className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    />
                    <span className="body2-regular text-slate-800">
                      {user.is_active ? 'Active' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
