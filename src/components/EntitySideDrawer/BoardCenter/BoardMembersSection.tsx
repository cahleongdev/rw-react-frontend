import React from 'react';
import { format } from 'date-fns';
import { EyeIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { Input } from '@components/base/Input';
import { Table, TableBody, TableCell, TableRow } from '@/components/base/Table';
import { Button } from '@/components/base/Button';
import { BoardMemberBase } from '@/store/slices/schoolUsersSlice';
import { SchoolResponse } from '@store/slices/schoolsSlice';

interface BoardMembersSectionProps {
  boardMembers: BoardMemberBase[];
  isLoadingBoardMembers: boolean;
  isAddingBoardMember: boolean;
  boardMemberSearchQuery: string;
  boardMemberSearchResults: BoardMemberBase[];
  initialBoardMemberSuggestions: BoardMemberBase[];
  onAddBoardMemberClick: () => void;
  onCancelAddBoardMember: () => void;
  onBoardMemberSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBoardMemberSelect: (userId: string) => void;
  onTriggerAddBoardMemberDialog: () => void;
  onViewUser: (userId: string) => void;
  entity: SchoolResponse;
}

export const BoardMembersSection: React.FC<BoardMembersSectionProps> = ({
  boardMembers,
  isLoadingBoardMembers,
  isAddingBoardMember,
  boardMemberSearchQuery,
  boardMemberSearchResults,
  initialBoardMemberSuggestions,
  onAddBoardMemberClick,
  onCancelAddBoardMember,
  onBoardMemberSearchChange,
  onBoardMemberSelect,
  onTriggerAddBoardMemberDialog,
  onViewUser,
  entity,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h5>Board Members</h5>
      {isLoadingBoardMembers ? (
        <div className="flex items-center justify-center py-4">
          <p className="text-slate-500">Loading board members...</p>
        </div>
      ) : boardMembers.length > 0 ? (
        <Table className="border-b border-slate-200">
          <TableBody>
            {boardMembers.map((user) => (
              <TableRow
                key={user.id}
                className="flex justify-between items-center border-b border-slate-200 hover:bg-slate-50"
                role="link"
                tabIndex={0}
              >
                <TableCell className="flex items-center gap-3 max-w-[200px] min-w-[200px]">
                  <div className="w-8 h-8 aspect-square rounded-full bg-orange-100 flex items-center justify-center text-orange-500 border border-orange-300">
                    <span className="text-sm">{`${user.first_name[0]}${user.last_name[0]}`}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="body1-regular truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{`${user.first_name} ${user.last_name}`}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] min-w-[200px]">
                  {user.start_term && user.end_term
                    ? `${format(new Date(user.start_term), 'M/d/yyyy')} - ${format(new Date(user.end_term), 'M/d/yyyy')}`
                    : 'Term not set'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex gap-2 text-blue-500 hover:text-blue-600 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewUser(user.id);
                    }}
                  >
                    <EyeIcon className="w-4 h-4" />
                    View member
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="body2-medium text-slate-500">
          No board members assigned to this {entity.type.toLowerCase()}.
        </p>
      )}
      {isAddingBoardMember ? (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2 w-full pl-1 pr-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search or select a board member"
                value={boardMemberSearchQuery}
                onChange={onBoardMemberSearchChange}
                className="w-full"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="p-1 text-slate-500 hover:text-slate-700"
              onClick={(e) => {
                e.stopPropagation();
                onCancelAddBoardMember();
              }}
            >
              <XMarkIcon className="w-5 h-5" />
            </Button>
          </div>

          {/* Container for suggestions or search results dropdown */}
          <div className="relative">
            {boardMemberSearchQuery === '' &&
              initialBoardMemberSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2 text-sm text-slate-500">Suggestions:</div>
                  {initialBoardMemberSuggestions.map((user) => (
                    <div
                      key={user.id}
                      className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                      onClick={() => onBoardMemberSelect(user.id)}
                    >
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs flex-shrink-0">
                        <span className="text-xs">{`${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{`${user.first_name} ${user.last_name}`}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            {boardMemberSearchQuery !== '' && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {boardMemberSearchResults.map((user) => (
                  <div
                    key={user.id}
                    className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                    onClick={() => onBoardMemberSelect(user.id)}
                  >
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs flex-shrink-0">
                      <span className="text-xs">{`${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{`${user.first_name} ${user.last_name}`}</span>
                    </div>
                  </div>
                ))}
                {boardMemberSearchQuery &&
                  !boardMemberSearchResults.some(
                    (u) =>
                      `${u.first_name} ${u.last_name}`.toLowerCase() ===
                      boardMemberSearchQuery.toLowerCase(),
                  ) &&
                  !initialBoardMemberSuggestions.some(
                    (u) =>
                      `${u.first_name} ${u.last_name}`.toLowerCase() ===
                      boardMemberSearchQuery.toLowerCase(),
                  ) && (
                    <div
                      className="px-4 py-2 text-blue-500 hover:bg-slate-50 cursor-pointer"
                      onClick={() => onTriggerAddBoardMemberDialog()}
                    >
                      + Add '{boardMemberSearchQuery}' as new board member
                    </div>
                  )}
                {boardMemberSearchResults.length === 0 &&
                  boardMemberSearchQuery && (
                    <div className="px-4 py-2 text-slate-500">
                      No existing users found. You can add '
                      {boardMemberSearchQuery}' as a new board member.
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          className="hover:bg-transparent text-blue-500 hover:text-blue-600 !pl-0 w-auto self-start"
          onClick={onAddBoardMemberClick}
        >
          <PlusIcon className="w-4 h-4" />
          Add board member
        </Button>
      )}
    </div>
  );
};
