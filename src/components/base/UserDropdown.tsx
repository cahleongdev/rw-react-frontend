import React, { useState, useEffect } from 'react';

import { User } from '@/containers/Messaging/index.types';

import { Avatar, AvatarFallback } from '@/components/base/Avatar';
import { SearchBar } from '@/components/base/SearchBar';

interface UserDropdownProps {
  onUserChange: (user: User | null) => void;
  users?: User[] | null;
  showSearchBar?: boolean;
  searchText?: string;
  onSearchChange?: (text: string) => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  onUserChange,
  users = [],
  showSearchBar = false,
  searchText = '',
  onSearchChange = () => {},
}) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={i} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  useEffect(() => {
    if (users) {
      setFilteredUsers(
        searchText
          ? users.filter(
              (user) =>
                `${user.first_name} ${user.last_name}`
                  .toLowerCase()
                  .includes(searchText.toLowerCase()) ||
                user.email.toLowerCase().includes(searchText.toLowerCase()) ||
                (user.title
                  ? user.title?.toLowerCase().includes(searchText.toLowerCase())
                  : false) ||
                user.schools
                  ?.map((school) => school.name)
                  .join(', ')
                  .toLowerCase()
                  .includes(searchText.toLowerCase()),
            )
          : users,
      );
    }
  }, [searchText, users]);

  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-md w-full">
      {showSearchBar && (
        <div className="p-[8px_4px] border-b border-slate-200">
          <div className="relative">
            <SearchBar
              placeholder="Search by name..."
              onChange={(e) => onSearchChange(e.target.value)}
              value={searchText}
              data-userplus-search
            />
          </div>
        </div>
      )}

      <div className="max-h-[200px] overflow-y-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer"
              onClick={() => onUserChange(user)}
            >
              <Avatar className="h-[38px] w-[38px] bg-blue-100 border border-blue-200">
                <AvatarFallback className="text-blue-700 text-base">
                  {user.first_name.charAt(0)}
                  {user.last_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left gap-1">
                <span className="text-sm font-medium">
                  {highlightText(
                    `${user.first_name} ${user.last_name}`,
                    searchText,
                  )}
                </span>
                <span className="text-xs text-gray-500">
                  {user.title
                    ? highlightText(`${user.title} | ${user.email}`, searchText)
                    : highlightText(user.email, searchText)}
                </span>
                <span className="text-xs text-gray-500">
                  {highlightText(
                    user.schools?.map((school) => school.name).join(', ') || '',
                    searchText,
                  )}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="px-3 py-4 text-center text-sm text-gray-500">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export { UserDropdown };
