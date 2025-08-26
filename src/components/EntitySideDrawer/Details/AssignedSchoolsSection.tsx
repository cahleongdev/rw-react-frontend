import React from 'react';
import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';
import { Table, TableBody, TableCell, TableRow } from '@/components/base/Table';
import {
  EyeIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import type { School } from '@/store/slices/schoolsSlice';

interface AssignedSchoolsSectionProps {
  assignedSchools: School[];
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
}

export const AssignedSchoolsSection: React.FC<AssignedSchoolsSectionProps> = ({
  assignedSchools,
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
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h5>Assigned Schools and Networks</h5>
      <Table className="border-b border-slate-200">
        <TableBody>
          {assignedSchools.map((school) => (
            <TableRow
              key={school.id}
              className="flex justify-between border-b border-slate-200"
            >
              <TableCell className="min-w-[230px] max-w-[230px] truncate">
                {school.name}
              </TableCell>
              <TableCell className="min-w-[150px] max-w-[150px] truncate">
                {school.type}
              </TableCell>
              <TableCell>
                {school.type === 'School' && (school as any).gradeserved?.[0]}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex gap-2 text-blue-500 hover:text-blue-600 hover:bg-transparent"
                  onClick={() => onViewSchool(school)}
                >
                  <EyeIcon className="w-4 h-4" /> View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isAddingSchool ? (
        <div className="flex flex-col gap-2">
          <div className="relative px-1">
            <Input
              type="text"
              placeholder="Search for school or network"
              value={schoolSearchQuery}
              onChange={onSchoolSearchChange}
              className="w-full"
            />
            {schoolSearchResults.length > 0 && !selectedSchool && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg">
                {schoolSearchResults.map((school) => (
                  <div
                    key={school.id}
                    className="px-4 py-2 hover:bg-slate-50 cursor-pointer"
                    onClick={() => onSchoolSelect(school)}
                  >
                    {school.name} ({school.type})
                  </div>
                ))}
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
          <PlusIcon className="w-4 h-4" /> Add school or network
        </Button>
      )}
    </div>
  );
};

export default AssignedSchoolsSection;
