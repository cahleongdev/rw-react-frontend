import { useState } from 'react';
import {
  PlusIcon,
  BarsArrowDownIcon,
  TrashIcon,
  PencilIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

import { SearchBar } from '@/components/base/SearchBar';
import { Button } from '@/components/base/Button';
import { Checkbox } from '@/components/base/Checkbox';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/base/Tooltip';
import {
  Table,
  TableBody,
  TableCell,
  // TableHead,
  TableHeader,
  TableRow,
} from '@/components/base/Table';
import { SchoolUser } from '@/store/slices/schoolUsersSlice';
import { formatPhoneNumber } from '@/utils/validation';

interface UsersListProps {
  users: SchoolUser[];
  userSearch: string;
  setUserSearch: (value: string) => void;
  setShowCreateNewUserDialog: (value: boolean) => void;
  onUserClick: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onResendMagicLink: (userId: string) => void;
  onBulkDelete: (userIds: string[]) => void;
  onBulkResendMagicLinks: (userIds: string[]) => void;
  selectedRows: string[];
  setSelectedRows: (rows: string[]) => void;
  magicLinkLoading: {
    individual: string[];
    bulk: boolean;
  };
}

const UsersList: React.FC<UsersListProps> = ({
  userSearch,
  setUserSearch,
  setShowCreateNewUserDialog,
  onUserClick,
  onDeleteUser,
  onResendMagicLink,
  onBulkDelete,
  onBulkResendMagicLinks,
  selectedRows,
  setSelectedRows,
  users,
  magicLinkLoading,
}) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const sortedUsers = [...users].sort((a, b) => {
    const nameA = (a.first_name + ' ' + a.last_name).toLowerCase();
    const nameB = (b.first_name + ' ' + b.last_name).toLowerCase();
    if (nameA < nameB) return sortDirection === 'asc' ? -1 : 1;
    if (nameA > nameB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSelectAll = () => {
    if (selectedRows.length === sortedUsers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(sortedUsers.map((user) => user.id));
    }
  };

  const handleRowSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, userId]);
    } else {
      setSelectedRows(selectedRows.filter((id) => id !== userId));
    }
  };

  return (
    <div className="flex flex-col grow rounded-sm bg-beige border border-secondary overflow-y-auto">
      <div className="p-4 flex flex-row justify-between items-center border-b border-beige-400">
        <div className="flex flex-col gap-2">
          <h4 className="text-slate-950">Users</h4>
          <div className="body2-regular text-slate-500">
            Add, remove and set permissions for your agency users.
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <SearchBar
            className="w-[268px]"
            placeholder="Search for user"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
          <Button
            className="px-3 bg-blue-500 hover:bg-blue-600 text-white flex flex-row gap-3 items-center"
            onClick={() => setShowCreateNewUserDialog(true)}
          >
            <PlusIcon className="size-4" />
            Create New User
          </Button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedRows.length > 0 && (
        <div className="flex justify-between w-full gap-4 h-[56px] items-center p-[0px_24px] border-b-[1px] border-beige-300 bg-orange-50">
          <div className="flex items-center gap-2">
            <h5 className="body2-medium text-slate-500">
              {selectedRows.length} user{selectedRows.length > 1 ? 's' : ''}{' '}
              selected
            </h5>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-slate-300 h-[36px] hover:border-slate-500"
                    onClick={() => onBulkResendMagicLinks(selectedRows)}
                    disabled={magicLinkLoading.bulk}
                  >
                    {magicLinkLoading.bulk ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-500"></div>
                    ) : (
                      <PaperAirplaneIcon className="h-4 w-4 -rotate-45 text-slate-500 hover:text-slate-700" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="rounded-lg shadow-lg p-2 border-none"
                  sideOffset={5}
                >
                  <p>
                    {magicLinkLoading.bulk
                      ? 'Sending Magic Links...'
                      : 'Resend Magic Links'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-slate-300 h-[36px] hover:border-slate-500"
                    onClick={() => onBulkDelete(selectedRows)}
                  >
                    <TrashIcon className="h-6 w-6 text-slate-500 hover:text-slate-700" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="rounded-lg shadow-lg p-2 border-none"
                  sideOffset={5}
                >
                  <p>Delete Selected Users</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}

      <Table className="w-full gap-0">
        <TableHeader className="sticky top-0 bg-beige-100">
          <TableRow>
            <TableCell className="pl-4 pt-7.5 pb-3">
              <div className="flex items-center gap-1.5">
                <Checkbox
                  checked={
                    sortedUsers.length > 0 &&
                    selectedRows.length === sortedUsers.length
                  }
                  onCheckedChange={toggleSelectAll}
                  className="border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:text-white"
                />
                <span
                  className="body2-medium text-slate-500 flex flex-row gap-1.5 cursor-pointer"
                  onClick={handleSort}
                >
                  Name
                  <BarsArrowDownIcon
                    className={`w-5 text-orange-500 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                  />
                </span>
              </div>
            </TableCell>
            <TableCell className="pl-4 pt-7.5 pb-3">
              <span className="body2-medium text-slate-500">Email</span>
            </TableCell>
            <TableCell className="pl-4 pt-7.5 pb-3 w-[182px]">
              <span className="body2-medium text-slate-500">Phone</span>
            </TableCell>
            <TableCell className="pl-4 pt-7.5 pb-3 w-[182px]">
              <span className="body2-medium text-slate-500">Title</span>
            </TableCell>
            <TableCell className="pl-4 pt-7.5 pb-3 w-[182px]">
              <span className="body2-medium text-slate-500">Role</span>
            </TableCell>
            <TableCell className="pl-4 pt-7.5 pb-3 w-[98px]">
              <span className="body2-medium text-slate-500">Status</span>
            </TableCell>
            <TableCell className="w-[140px]"></TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedUsers?.length > 0 ? (
            sortedUsers.map((user) => (
              <TableRow
                className="border-t border-beige-400 h-14 cursor-pointer"
                key={user.id}
                // onClick={() => onUserClick(user.id)}
              >
                <TableCell className="pl-4 flex flex-row items-center gap-3 body2-medium text-slate-700">
                  <Checkbox
                    checked={selectedRows.includes(user.id)}
                    onCheckedChange={(checked) =>
                      handleRowSelect(user.id, !!checked)
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:text-white"
                  />
                  <div className="w-9.5 h-9.5 rounded-[90px] bg-orange-100 text-orange-800 flex justify-center items-center">
                    <span className="uppercase text-orange-800">
                      {user.first_name[0] + user.last_name[0]}
                    </span>
                  </div>
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell className="pl-4 body2-medium text-slate-700">
                  {user.email}
                </TableCell>
                <TableCell className="pl-4 body2-medium text-slate-700">
                  {user.phone_number
                    ? formatPhoneNumber(user.phone_number)
                    : '-'}
                </TableCell>
                <TableCell className="pl-4 body2-medium text-slate-700">
                  {user.title || '-'}
                </TableCell>
                <TableCell className="pl-4 body2-medium text-slate-700">
                  {user.role.replace('_', ' ') || '-'}
                </TableCell>
                <TableCell className="pl-4 body2-medium text-slate-700">
                  {user.is_active === null ? (
                    <div className="rounded-[50px] border border-red-300 px-3 py-1.5 bg-red-100">
                      Inactive
                    </div>
                  ) : user.is_active ? (
                    <div className="rounded-[50px] border border-green-300 px-3 py-1.5 bg-green-100">
                      Active
                    </div>
                  ) : (
                    <div className="rounded-[50px] border border-yellow-300 px-3 py-1.5 bg-yellow-100">
                      Pending
                    </div>
                  )}
                </TableCell>
                <TableCell className="pl-4 body2-medium text-slate-700">
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              onResendMagicLink(user.id);
                            }}
                            disabled={magicLinkLoading.individual.includes(
                              user.id,
                            )}
                          >
                            {magicLinkLoading.individual.includes(user.id) ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600"></div>
                            ) : (
                              <PaperAirplaneIcon className="h-5 w-5 text-slate-600 -rotate-45 " />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          className="rounded-lg shadow-lg p-2 border-none"
                          sideOffset={5}
                        >
                          <p>
                            {magicLinkLoading.individual.includes(user.id)
                              ? 'Sending Magic Link...'
                              : 'Resend Magic Link'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUserClick(user.id);
                            }}
                          >
                            <PencilIcon className="h-5 w-5 text-slate-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          className="rounded-lg shadow-lg p-2 border-none"
                          sideOffset={5}
                        >
                          <p>Edit User</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteUser(user.id);
                            }}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          className="rounded-lg shadow-lg p-2 border-none"
                          sideOffset={5}
                        >
                          <p>Delete User</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-14">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersList;
