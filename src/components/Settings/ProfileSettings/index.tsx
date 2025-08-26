import React, { useState } from 'react';
import { UserCircleIcon, PencilIcon } from '@heroicons/react/24/solid';
// import { toast } from 'sonner';

import UploadProfilePicture from '@/containers/Settings/ProfileSettings/UploadProfilePicture';
import PersonalDetails from '@/containers/Settings/ProfileSettings/PersonalDetails';
import EditContact from '@/containers/Settings/ProfileSettings/EditContact';
import { SchoolUser } from '@/store/slices/schoolUsersSlice';
import { Button } from '@/components/base/Button';

interface ProfileSettingsProps {
  user: SchoolUser;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  const [showUploadProfilePictureModal, setShowUploadProfilePictureModal] =
    useState(false);
  const [showEditPersonalDetailsModal, setShowEditPersonalDetailsModal] =
    useState(false);
  const [showEditContactModal, setShowEditContactModal] = useState(false);

  return (
    <div className="flex flex-col gap-6 grow">
      <h4 className="text-slate-950">Profile Information</h4>
      <hr className="border border-secondary" />
      <div className="flex flex-row gap-4">
        <div className="body2-medium text-slate-700 w-[280px]">
          Profile Picture
        </div>
        <div className="flex flex-col gap-1 items-center">
          {user.profile_image ? (
            <img src={user.profile_image} className="w-24 h-24 rounded-md" />
          ) : (
            <div className="w-[100px] h-[100px] border border-[#E2E8F0] border-dashed rounded-sm ml-0.5 mr-0.5 flex justify-center items-center">
              <UserCircleIcon className="size-[100px] text-slate-200" />
            </div>
          )}
          <Button
            variant="outline"
            onClick={() => setShowUploadProfilePictureModal(true)}
          >
            {user.profile_image ? 'Replace photo' : 'Upload photo'}
          </Button>
        </div>
      </div>
      <hr className="border border-secondary" />
      <div className="flex flex-row gap-4">
        <div className="body2-medium text-slate-700 w-[280px]">
          Personal Details
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row w-[512px] justify-between">
            <div className="flex flex-col gap-1">
              <div className="body2-medium text-slate-700">First Name</div>
              <div className="body2-regular text-slate-500">
                {user.first_name}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowEditPersonalDetailsModal(true)}
            >
              <PencilIcon className="size-4 text-slate-700" />
              Edit
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            <div className="body2-medium text-slate-700">Last Name</div>
            <div className="body2-regular text-slate-500">{user.last_name}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="body2-medium text-slate-700">Title</div>
            <div className="body2-regular text-slate-500">
              {user.title || '-'}
            </div>
          </div>
        </div>
      </div>
      <hr className="border border-secondary" />
      <div className="flex flex-row gap-4">
        <div className="body2-medium text-slate-700 w-[280px]">
          Contact Info
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row w-[512px] justify-between">
            <div className="flex flex-col gap-1">
              <div className="body2-medium text-slate-700">Email</div>
              <div className="body2-regular text-slate-500">{user.email}</div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowEditContactModal(true)}
            >
              <PencilIcon className="size-4 text-slate-700" />
              Edit
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            <div className="body2-medium text-slate-700">Phone Number</div>
            <div className="body2-regular text-slate-500">
              {user.phone_number || '-'}
            </div>
          </div>
        </div>
      </div>
      <UploadProfilePicture
        open={showUploadProfilePictureModal}
        onClose={() => setShowUploadProfilePictureModal(false)}
      />
      <PersonalDetails
        open={showEditPersonalDetailsModal}
        onClose={() => setShowEditPersonalDetailsModal(false)}
      />
      <EditContact
        open={showEditContactModal}
        onClose={() => setShowEditContactModal(false)}
      />
    </div>
  );
};

export default ProfileSettings;
