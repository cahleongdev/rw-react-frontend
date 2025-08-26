import React from 'react';
import { PencilIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/base/Table';
import { Checkbox } from '@/components/base/Checkbox';
import { Badge } from '@/components/base/Badge';
import { SchoolTooltip } from '@/components/Schools/Tooltips/SchoolTooltip';
import { AdminsTooltip } from '@/components/Schools/Tooltips/AdminsTooltip';
import { DisplaySchoolResponse } from '@/containers/Schools/AgencyAdmin/SchoolsContainer';
import { SchoolResponse, Network } from '@/store/slices/schoolsSlice';
import { SchoolUser } from '@/store/slices/schoolUsersSlice';

interface SchoolsTableProps {
  schools: DisplaySchoolResponse[];
  schoolUsers: SchoolUser[];
  selectedRows: string[];
  onRowSelect: (schoolId: string, checked: boolean) => void;
  onSelectAll: () => void;
  onRowClick: (schoolId: string, schoolType: 'School' | 'Network') => void;
  onEditClick: (e: React.MouseEvent, school: SchoolResponse) => void;
  allSelected: boolean;
}

const SchoolsTable: React.FC<SchoolsTableProps> = ({
  schools,
  schoolUsers,
  selectedRows,
  onRowSelect,
  onSelectAll,
  onRowClick,
  onEditClick,
  allSelected,
}) => {
  const renderNameContent = (school: DisplaySchoolResponse) => {
    const isNetwork = school.type === 'Network';

    if ('parentNetworkName' in school && school.parentNetworkName) {
      // It's a nested school
      return (
        <>
          <span className="body1-regular">{school.name}</span>
          <span className="body1-regular text-slate-500">
            ({school.parentNetworkName})
          </span>
        </>
      );
    } else if (isNetwork) {
      // It's a Network
      const networkSchoolCount = (school as Network).schools?.length ?? 0;
      return (
        <>
          <span className="body1-regular">{school.name}</span>
          <span className="body1-regular text-slate-500">
            ({networkSchoolCount} schools)
          </span>
        </>
      );
    } else {
      // Standalone school
      return <span className="body1-regular">{school.name}</span>;
    }
  };

  const getSchoolAdmins = (schoolId: string) => {
    return schoolUsers.filter(
      (user) =>
        user.role === 'School_Admin' &&
        user.schools &&
        user.schools.includes(schoolId),
    );
  };

  return (
    <Table>
      <TableHeader className="sticky top-0 bg-beige-100 z-10">
        <TableRow className="hover:bg-transparent">
          <TableCell className="py-2 px-4">
            <Checkbox
              checked={allSelected && schools.length > 0}
              onCheckedChange={onSelectAll}
              className="mr-2 border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:text-white"
            />
            <span className="body2-medium text-slate-500">Name</span>
          </TableCell>
          <TableCell className="py-2 px-4">
            <span className="body2-medium text-slate-500">Type</span>
          </TableCell>
          <TableCell className="py-2 px-4">
            <span className="body2-medium text-slate-500">Admin</span>
          </TableCell>
          <TableCell className="py-2 px-4">
            <span className="body2-medium text-slate-500">Status</span>
          </TableCell>
          <TableCell className="py-2 px-4 flex justify-end">
            <Cog6ToothIcon className="h-6 w-6 text-slate-500" />
          </TableCell>
        </TableRow>
      </TableHeader>

      <TableBody>
        {schools.map((school) => (
          <TableRow
            key={school.id}
            className="border-b border-beige-500 hover:bg-beige-50/50 cursor-pointer bg-white"
            onClick={() =>
              onRowClick(school.id, school.type as 'School' | 'Network')
            }
          >
            <TableCell className="py-4 px-4">
              <div className="flex items-center">
                <Checkbox
                  checked={selectedRows.includes(school.id)}
                  onCheckedChange={(checked) =>
                    onRowSelect(school.id, checked as boolean)
                  }
                  onClick={(e) => e.stopPropagation()}
                  className="mr-2 border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:text-white"
                />
                <SchoolTooltip school={school}>
                  <div className="flex gap-1 items-center">
                    {renderNameContent(school)}
                  </div>
                </SchoolTooltip>
              </div>
            </TableCell>
            <TableCell className="py-4 px-4">
              {school.type === 'Network' ? 'Network' : 'School'}
            </TableCell>
            <TableCell className="py-4 px-4">
              <span className="body1-regular">
                <AdminsTooltip admins={getSchoolAdmins(school.id)} />
              </span>
            </TableCell>
            <TableCell className="py-4 px-4">
              <Badge
                className={`${
                  school.status === 'Active'
                    ? 'bg-green-100 text-green-800 border-green-300'
                    : 'bg-yellow-100 text-white-900 border-yellow-300'
                } border rounded-[50px] p-[6px_12px] body2-bold`}
              >
                {school.status}
              </Badge>
            </TableCell>
            <TableCell className="py-4 px-4">
              <div className="flex justify-end gap-2">
                <button
                  className="rounded-md hover:bg-slate-100"
                  onClick={(e) => onEditClick(e, school)}
                >
                  <PencilIcon className="h-6 w-6" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SchoolsTable;
