import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/base/Tooltip';
// Corrected type import
import { SchoolResponse } from '@/store/slices/schoolsSlice';
import { Button } from '@/components/base/Button';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

interface SchoolTooltipProps {
  school: SchoolResponse;
  children: React.ReactNode;
}

export const SchoolTooltip: React.FC<SchoolTooltipProps> = ({
  school,
  children,
}) => {
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
              {school.profile_image ? (
                <img
                  src={school.profile_image}
                  alt={school.name}
                  className="w-[200px] h-[200px] object-cover"
                />
              ) : (
                <div className="w-[200px] h-[200px] bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-400">No image</span>
                </div>
              )}
              <div className="flex flex-col justify-between flex-1">
                <div className="p-4 flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {school.name}
                  </h3>
                  {school.type === 'School' && (
                    <div className="text-sm text-slate-800">
                      <p className="body2-regular">{school.address}</p>
                      <p className="body2-regular">
                        {school.city}, {school.state}, {school.zipcode}
                      </p>
                    </div>
                  )}
                  <p className="body2-regular text-slate-500">
                    Next board meeting: 3/25/2025
                  </p>
                </div>
                <div className="flex gap-2 p-4 border-t border-beige-200 bg-beige-50">
                  <Button
                    variant="outline"
                    className="p-[8px_12px] gap-2 border-slate-700"
                  >
                    <ArrowUpRightIcon className="w-4 h-4 text-slate-700" />
                    <span className="button3-semibold text-slate-700">
                      Assign report
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="p-[8px_12px] gap-2 border-slate-700"
                  >
                    <ArrowUpRightIcon className="w-4 h-4 text-slate-700" />
                    <span className="button3-semibold text-slate-700">
                      View users
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
