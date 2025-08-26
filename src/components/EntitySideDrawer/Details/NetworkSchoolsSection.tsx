import React from 'react';
import {
  EyeIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';
import { Table, TableBody, TableCell, TableRow } from '@/components/base/Table';

import type { School } from '@/store/slices/schoolsSlice';

interface NetworkSchoolsSectionProps {
  networkSchools: School[];
  isAddingSchool: boolean;
  schoolSearchQuery: string;
  schoolSearchResults: School[];
  selectedSchool: School | null;
  onAddSchoolClick: () => void;
  onCancelAddSchool: () => void;
  onConfirmAddSchool: () => void;
  onSchoolSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSchoolSelect: (school: School) => void;
  onViewSchool: (school: School) => void;
  onTriggerAddSchoolDialog: () => void;
}

export const NetworkSchoolsSection: React.FC<NetworkSchoolsSectionProps> = ({
  networkSchools,
  isAddingSchool,
  schoolSearchQuery,
  schoolSearchResults,
  selectedSchool,
  onAddSchoolClick,
  onCancelAddSchool,
  onConfirmAddSchool,
  onSchoolSearchChange,
  onSchoolSelect,
  onViewSchool,
  onTriggerAddSchoolDialog,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h5 className="flex-1">Network Schools</h5>
      </div>
      <Table>
        <TableBody>
          {networkSchools.map((networkSchool) => (
            <TableRow
              key={networkSchool.id}
              className="border-b border-slate-200"
            >
              <TableCell>{networkSchool.name}</TableCell>
              <TableCell>{networkSchool.gradeserved?.[0]}</TableCell>
              <TableCell>
                {networkSchool.city}, {networkSchool.state}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex gap-1 text-blue-500"
                  onClick={() => onViewSchool(networkSchool)}
                >
                  <EyeIcon className="w-4 h-4" />
                  View school
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isAddingSchool ? (
        <div className="flex flex-col gap-2 pl-1 pr-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for school"
              value={schoolSearchQuery}
              onChange={onSchoolSearchChange}
              className="w-full"
            />
            {(schoolSearchResults.length > 0 || schoolSearchQuery) &&
              !selectedSchool && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg">
                  {schoolSearchResults.map((school) => (
                    <div
                      key={school.id}
                      className="px-4 py-2 hover:bg-slate-50 cursor-pointer"
                      onClick={() => onSchoolSelect(school)}
                    >
                      {school.name}
                    </div>
                  ))}
                  {schoolSearchQuery && (
                    <div
                      className="px-4 py-2 text-blue-500 hover:bg-slate-50 cursor-pointer"
                      onClick={onTriggerAddSchoolDialog}
                    >
                      + Add '{schoolSearchQuery}' as new school
                    </div>
                  )}
                </div>
              )}
          </div>
          {selectedSchool && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
                onClick={onConfirmAddSchool}
              >
                <CheckIcon className="w-4 h-4 text-green-500" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
                onClick={onCancelAddSchool}
              >
                <XMarkIcon className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Button
          variant="ghost"
          className="hover:bg-transparent text-blue-500 hover:text-blue-600 !pl-0 w-auto self-start"
          onClick={onAddSchoolClick}
        >
          <PlusIcon className="w-4 h-4" />
          Add school
        </Button>
      )}
    </div>
  );
};

export default NetworkSchoolsSection;
