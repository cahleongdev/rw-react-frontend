import React from 'react';

// import { User } from '@/containers/Messaging/index.types'; // No longer needed
import { SchoolUser } from '@/store/slices/schoolUsersSlice'; // Use SchoolUser directly

import { Avatar, AvatarFallback } from '@/components/base/Avatar';
import { SearchBar } from '@/components/base/SearchBar';
import { PlusIcon, XIcon } from 'lucide-react'; // Assuming lucide-react for icons

interface UserClickDropdownProps {
  onUserChange: (user: SchoolUser) => void; // Changed to SchoolUser
  onClose: () => void;
  onCreateNewUser?: () => void; // Made optional
  onRemoveAssigneeClick: () => void; // New prop for the "Remove Assignee" button
  users?: SchoolUser[] | null; // This will now be the already filtered list if search is used
  showSearchBar?: boolean;
  searchText?: string; // Keep searchText prop if SearchBar value needs to be controlled from outside
  onSearchChange?: (text: string) => void; // Keep onSearchChange if SearchBar change needs to be handled outside
}

const UserClickDropdown: React.FC<UserClickDropdownProps> = ({
  onUserChange,
  onClose,
  onCreateNewUser,
  onRemoveAssigneeClick, // Added prop
  users = [], // Directly use the passed users list
  showSearchBar = true,
  searchText = '', // Controlled search text
  onSearchChange = () => {}, // Handler for search text change
}) => {
  // Removed internal filteredUsers state and useEffect

  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-lg w-full max-w-xs flex flex-col">
      {/* Header with Remove Assignee Button and Close Button */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200">
        <button
          onClick={onRemoveAssigneeClick}
          className="text-base font-semibold text-slate-700 hover:text-red-600 focus:outline-none" // Styling for button
        >
          Remove Assignee
        </button>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-700"
        >
          <XIcon size={20} />
        </button>
      </div>

      {showSearchBar && (
        <div className="p-2 border-b border-slate-200">
          <SearchBar
            placeholder="Search by name" // Updated placeholder
            onChange={(e) => onSearchChange(e.target.value)} // Use the passed handler
            value={searchText} // Use the passed value
          />
        </div>
      )}

      <div className="flex-grow max-h-[280px] overflow-y-auto">
        {' '}
        {/* Adjusted max-h for better scroll */}
        {users && users.length > 0 ? ( // Check passed users prop
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer"
              onClick={() => onUserChange(user)}
            >
              <Avatar className="h-8 w-8 bg-orange-100 border border-orange-200">
                {' '}
                {/* Adjusted avatar style based on image */}
                <AvatarFallback className="text-orange-600 text-sm font-medium">
                  {' '}
                  {/* Adjusted avatar text style */}
                  {user.first_name.charAt(0).toUpperCase()}
                  {user.last_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium text-slate-800">{`${user.first_name} ${user.last_name}`}</span>
                {/* Removed email display as per image */}
              </div>
            </div>
          ))
        ) : (
          <div className="px-3 py-4 text-center text-sm text-gray-400">
            {' '}
            {/* Slightly adjusted no users found text color */}
            No users found
          </div>
        )}
      </div>

      {/* Create New User Button (Optional) */}
      {onCreateNewUser && (
        <div className="p-2 border-t border-slate-200">
          <button
            onClick={onCreateNewUser}
            className="flex items-center justify-center gap-2 w-full p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
          >
            <PlusIcon size={18} />
            Create New User
          </button>
        </div>
      )}
    </div>
  );
};

export { UserClickDropdown };
