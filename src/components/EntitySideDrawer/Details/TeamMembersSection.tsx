import React from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';

import type { SchoolUser } from '@/store/slices/schoolUsersSlice';

interface TeamMembersSectionProps {
  teamMembers: SchoolUser[];
  isAddingUser: boolean;
  userSearchQuery: string;
  userSearchResults: SchoolUser[];
  initialUserSuggestions: SchoolUser[];
  onAddUserClick: () => void;
  onCancelAddUser: () => void;
  onUserSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUserSelect: (user: SchoolUser) => void;
  onTriggerAddUserDialog: (query: string) => void;
  onViewUser: (userId: string) => void;
}

export const TeamMembersSection: React.FC<TeamMembersSectionProps> = ({
  teamMembers,
  isAddingUser,
  userSearchQuery,
  userSearchResults,
  initialUserSuggestions,
  onAddUserClick,
  onCancelAddUser,
  onUserSearchChange,
  onUserSelect,
  onTriggerAddUserDialog,
  onViewUser,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h5 className="flex-1">Team Members</h5>
      </div>
      <div className="flex gap-4 w-full flex-wrap">
        {teamMembers.map((user) => (
          <div
            key={user.id}
            className="flex items-start w-[calc(50%-8px)] p-2 rounded-[8px] border border-slate-200 hover:bg-slate-50 cursor-pointer group"
            onClick={() => onViewUser(user.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') onViewUser(user.id);
            }}
          >
            <div className="flex gap-2 bg-white">
              <div className="flex w-[56px] h-[56px] rounded-[3px] overflow-hidden items-center justify-center bg-orange-50">
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-orange-100 flex items-center justify-center text-orange-500 rounded-full border border-orange-300">
                    <span className="body1-regular text-orange-800">{`${user.first_name[0]}${user.last_name[0]}`}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col group-hover:bg-slate-50">
                <span className="body2-bold text-slate-900">{`${user.first_name} ${user.last_name}`}</span>
                <span className="body3-regular">{user.title}</span>
                <span className="body3-regular text-slate-500">{`${user.role === 'School_Admin' ? 'Admin' : 'School User'} | ${user.is_active ? 'Active' : 'Pending'} `}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isAddingUser ? (
        <div className="flex flex-col gap-2">
          <div className="relative">
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1 pl-1">
                <Input
                  type="text"
                  placeholder="Search for user to add as team member"
                  value={userSearchQuery}
                  onChange={onUserSearchChange}
                  className="w-full"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="p-1 mr-4 text-slate-500 hover:text-slate-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelAddUser();
                }}
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>
            {/* Suggestions or search results dropdown */}
            <div className="relative">
              {userSearchQuery === '' && initialUserSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2 text-sm text-slate-500">Suggestions:</div>
                  {initialUserSuggestions.map((user) => (
                    <div
                      key={user.id}
                      className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUserSelect(user);
                      }}
                    >
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs flex-shrink-0">
                        <span className="text-xs">{`${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{`${user.first_name} ${user.last_name}`}</span>
                        {user.email && (
                          <span className="text-xs text-slate-500">
                            {user.email}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {userSearchQuery !== '' && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {userSearchResults.map((user) => (
                    <div
                      key={user.id}
                      className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUserSelect(user);
                      }}
                    >
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs flex-shrink-0">
                        <span className="text-xs">{`${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{`${user.first_name} ${user.last_name}`}</span>
                        {user.email && (
                          <span className="text-xs text-slate-500">
                            {user.email}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {userSearchQuery &&
                    !userSearchResults.some(
                      (u) =>
                        `${u.first_name} ${u.last_name}`.toLowerCase() ===
                          userSearchQuery.toLowerCase() ||
                        u.email.toLowerCase() === userSearchQuery.toLowerCase(),
                    ) && (
                      <div
                        className="px-4 py-2 text-blue-500 hover:bg-slate-50 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTriggerAddUserDialog(userSearchQuery);
                        }}
                      >
                        + Add '{userSearchQuery}' as new user
                      </div>
                    )}
                  {userSearchResults.length === 0 && userSearchQuery && (
                    <div className="px-4 py-2 text-slate-500">
                      No existing users found. You can add '{userSearchQuery}'
                      as a new user.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          className="hover:bg-transparent text-blue-500 hover:text-blue-600 !pl-0 w-auto self-start"
          onClick={onAddUserClick}
        >
          <PlusIcon className="w-4 h-4" />
          Add user
        </Button>
      )}
    </div>
  );
};

export default TeamMembersSection;
