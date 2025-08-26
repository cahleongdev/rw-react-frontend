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
import { UserTooltip } from '@/components/Schools/Tooltips/UserTooltip';
import { SchoolUser } from '@/store/slices/schoolUsersSlice';
import { SchoolResponse } from '@/store/slices/schoolsSlice';
import { Badge } from '@components/base/Badge';

interface UsersTableProps {
  users: SchoolUser[];
  schools: SchoolResponse[];
  selectedRows: string[];
  onRowSelect: (userId: string, checked: boolean) => void;
  onSelectAll: () => void;
  onRowClick: (userId: string) => void;
  allSelected: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  schools,
  selectedRows,
  onRowSelect,
  onSelectAll,
  onRowClick,
  allSelected,
}) => {
  const getUserSchools = (user: SchoolUser) => {
    return schools
      .filter((school) => user.schools.includes(school.id))
      .map((school) => school.name)
      .join(', ');
  };

  const getUserStatus = (user: SchoolUser) => {
    if (user.is_active === null) {
      return (
        <Badge className="bg-red-100 text-white-900 border-red-300">
          Inactive
        </Badge>
      );
    } else if (user.is_active) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          Active
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-100 text-white-900 border-yellow-300">
          Pending
        </Badge>
      );
    }
  };

  return (
    <Table>
      <TableHeader className="sticky top-0 bg-beige-100 z-10">
        <TableRow className="hover:bg-transparent">
          <TableCell className="py-2 px-4">
            <Checkbox
              checked={allSelected && users.length > 0}
              onCheckedChange={onSelectAll}
              className="mr-2 border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:text-white"
            />
            <span className="body2-medium text-slate-500">Name</span>
          </TableCell>
          <TableCell className="py-2 px-4">
            <span className="body2-medium text-slate-500">
              Schools and Networks
            </span>
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
        {users.map((user) => (
          <TableRow
            key={user.id}
            className="border-b border-beige-500 hover:bg-beige-50/50 cursor-pointer bg-white"
            onClick={() => onRowClick(user.id)}
          >
            <TableCell className="py-4 px-4">
              <div className="flex items-center">
                <Checkbox
                  checked={selectedRows.includes(user.id)}
                  onCheckedChange={(checked) =>
                    onRowSelect(user.id, checked as boolean)
                  }
                  onClick={(e) => e.stopPropagation()}
                  className="mr-2 border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:text-white"
                />
                <UserTooltip user={user} schools={schools}>
                  <span className="body1-regular">{`${user.first_name} ${user.last_name}`}</span>
                </UserTooltip>
              </div>
            </TableCell>
            <TableCell className="py-4 px-4">
              <span className="body1-regular">{getUserSchools(user)}</span>
            </TableCell>
            <TableCell className="py-4 px-4 max-w-[40px]">
              {getUserStatus(user)}
            </TableCell>
            <TableCell className="py-4 px-4">
              <div className="flex justify-end gap-2">
                <button className="rounded-md hover:bg-slate-100">
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

export default UsersTable;
