import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import UserInfoDrawer from '@containers/EntitySideDrawer';
import CreateNewUserDialog from '@/components/AgencySettings/UsersSettings/CreateNewUserDialog';
import UsersListComponent from '@/components/AgencySettings/UsersSettings/UsersList';
import { DataLoading } from '@components/base/Loading';
import { confirm } from '@/components/base/Confirmation';
import useFileUpload from '@/hooks/useFileUpload';

import {
  fetchAgencyUsers,
  createAgencyUser,
  createAndInviteAgencyUser,
  deleteAgencyUser,
  bulkDeleteAgencyUsers,
  resendMagicLink,
  bulkResendMagicLinks,
} from '@store/slices/agencySlice';

import { useDrawerNavigation } from '@/contexts/DrawerNavigationContext';

import { AppDispatch, RootState } from '@/store/index';
import { InviteUserFormData, inviteUserSchema } from '../index.types';
import { CustomFieldEntityType } from '@/store/slices/customFieldDefinitionsSlice';
import {
  EntitySideDrawerTabIds,
  EntityType,
} from '@/containers/EntitySideDrawer/index.types';
import { STORAGE_PATH } from '@/containers/Settings/index.constants';

interface UsersSettingsProps {
  agencyId: string;
}

const UsersSettings: React.FC<UsersSettingsProps> = ({ agencyId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { pushView } = useDrawerNavigation();

  const { users, loading, magicLinkLoading } = useSelector(
    (state: RootState) => state.agency,
  );
  const customFieldDefinitions = useSelector(
    (state: RootState) =>
      state.customFieldDefinitions[CustomFieldEntityType.AgencyUser] || [],
  );

  const [showCreateNewUserDialog, setShowCreateNewUserDialog] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [isInvitingUser, setIsInvitingUser] = useState(false);
  const [tempImage, setTempImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Permissions state
  const [permissions, setPermissions] = useState<Record<string, string>>({});

  // Custom fields state
  const [customFields, setCustomFields] = useState<Record<string, string>>({});

  const { uploadFile } = useFileUpload();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
  });

  useEffect(() => {
    if (agencyId) {
      dispatch(fetchAgencyUsers(agencyId));
    }
  }, [dispatch, agencyId]);

  const handleCreateUser = async (data: InviteUserFormData) => {
    setIsInvitingUser(true);
    let uploadedProfileImage = '';
    if (tempImage) {
      try {
        const filename = await uploadFile(tempImage, undefined, 'avatar');
        uploadedProfileImage = STORAGE_PATH + filename;
      } catch {
        toast.error('Failed to upload avatar');
        setIsInvitingUser(false);
        return;
      }
    }

    try {
      await dispatch(
        createAgencyUser({
          agencyId,
          data: {
            ...data,
            profile_image: uploadedProfileImage,
            permissions,
            custom_fields: customFields,
          },
        }),
      ).unwrap();
      toast.success('User created successfully');
      setShowCreateNewUserDialog(false);
    } catch {
      toast.error('Failed to create user');
    }
    setIsInvitingUser(false);
  };

  const handleCreateAndInviteUser = async (data: InviteUserFormData) => {
    setIsInvitingUser(true);
    let uploadedProfileImage = '';
    if (tempImage) {
      try {
        const filename = await uploadFile(tempImage, undefined, 'avatar');
        uploadedProfileImage = STORAGE_PATH + filename;
      } catch {
        toast.error('Failed to upload avatar');
        setIsInvitingUser(false);
        return;
      }
    }

    try {
      await dispatch(
        createAndInviteAgencyUser({
          agencyId,
          data: {
            ...data,
            profile_image: uploadedProfileImage,
            permissions,
            custom_fields: customFields,
          },
        }),
      ).unwrap();
      toast.success('User created and invited successfully');
      setShowCreateNewUserDialog(false);
    } catch {
      toast.error('Failed to create and invite user');
    }
    setIsInvitingUser(false);
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find((user) => user.id === userId);
    const userName = userToDelete
      ? `${userToDelete.first_name} ${userToDelete.last_name}`
      : 'this user';

    confirm({
      title: 'Delete User?',
      message: `This will delete the user "${userName}" and remove their access to the agency. Are you sure you want to delete? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmButtonStyle: 'bg-red-600 hover:bg-red-700 text-white',
      onConfirm: async () => {
        try {
          await dispatch(deleteAgencyUser({ agencyId, userId })).unwrap();
          toast.success(`User "${userName}" deleted successfully.`);
          setSelectedRows((prev) => prev.filter((rowId) => rowId !== userId));
        } catch (error) {
          console.error('Error deleting user:', error);
          toast.error(`Failed to delete user "${userName}".`);
        }
      },
    });
  };

  const handleBulkDelete = (userIds: string[]) => {
    const userCount = userIds.length;

    confirm({
      title: `Delete ${userCount} User${userCount > 1 ? 's' : ''}?`,
      message: `This will delete ${userCount} user${userCount > 1 ? 's' : ''} and remove their access to the agency. Are you sure you want to delete? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmButtonStyle: 'bg-red-600 hover:bg-red-700 text-white',
      onConfirm: async () => {
        try {
          await dispatch(bulkDeleteAgencyUsers({ agencyId, userIds })).unwrap();
          toast.success(
            `${userCount} user${userCount > 1 ? 's' : ''} deleted successfully.`,
          );
          setSelectedRows([]);
        } catch (error) {
          console.error('Error deleting users:', error);
          toast.error(`Failed to delete user${userCount > 1 ? 's' : ''}.`);
        }
      },
    });
  };

  const handleResendMagicLink = async (userId: string) => {
    const userToResend = users.find((user) => user.id === userId);
    const userName = userToResend
      ? `${userToResend.first_name} ${userToResend.last_name}`
      : 'this user';

    try {
      await dispatch(resendMagicLink({ agencyId, userId })).unwrap();
      toast.success(`Magic link sent to ${userName} successfully.`);
    } catch (error) {
      console.error('Error resending magic link:', error);
      toast.error(`Failed to send magic link to ${userName}.`);
    }
  };

  const handleBulkResendMagicLinks = async (userIds: string[]) => {
    const userCount = userIds.length;

    try {
      await dispatch(bulkResendMagicLinks({ agencyId, userIds })).unwrap();
      toast.success(
        `Magic links sent to ${userCount} user${userCount > 1 ? 's' : ''} successfully.`,
      );
      setSelectedRows([]);
    } catch (error) {
      console.error('Error resending magic links:', error);
      toast.error(
        `Failed to send magic links to ${userCount} user${userCount > 1 ? 's' : ''}.`,
      );
    }
  };

  const handleAvatarChange = (file: File | null) => {
    if (file) {
      setTempImage(file);
      setProfileImage(URL.createObjectURL(file));
    } else {
      setTempImage(null);
      setProfileImage('');
    }
  };

  const handlePermissionChange = (feature: string, value: string) => {
    setPermissions((prev) => ({ ...prev, [feature]: value }));
  };

  const handleCustomFieldChange = (field: string, value: string) => {
    setCustomFields((prev) => ({ ...prev, [field]: value }));
  };

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const search = userSearch.toLowerCase();
        return (
          user.first_name.toLowerCase().includes(search) ||
          user.last_name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.phone_number?.replace(/\D/g, '').includes(search) ||
          user.title.toLowerCase().includes(search) ||
          user.role.toLowerCase().includes(search)
        );
      }),
    [users, userSearch],
  );

  useEffect(() => {
    if (showCreateNewUserDialog) {
      // Reset all state when dialog opens
      reset();
      setTempImage(null);
      setProfileImage('');
      setPermissions({});
      // Initialize custom fields
      const initialFields: Record<string, string> = {};
      customFieldDefinitions.forEach((def) => {
        initialFields[def.Name] = '';
      });
      setCustomFields(initialFields);
    }
  }, [showCreateNewUserDialog, customFieldDefinitions, reset]);

  useEffect(() => {
    dispatch(fetchAgencyUsers(agencyId));
  }, [dispatch, agencyId]);

  if ((loading && filteredUsers.length === 0) || !agencyId) {
    return <DataLoading />;
  }

  return (
    <>
      <UsersListComponent
        users={filteredUsers}
        userSearch={userSearch}
        setUserSearch={setUserSearch}
        setShowCreateNewUserDialog={setShowCreateNewUserDialog}
        onUserClick={(userId) => {
          pushView(
            userId,
            EntityType.AgencyUser,
            EntitySideDrawerTabIds.Details,
          );
        }}
        onDeleteUser={handleDeleteUser}
        onResendMagicLink={handleResendMagicLink}
        onBulkDelete={handleBulkDelete}
        onBulkResendMagicLinks={handleBulkResendMagicLinks}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        magicLinkLoading={magicLinkLoading}
      />
      <CreateNewUserDialog
        open={showCreateNewUserDialog}
        onClose={() => setShowCreateNewUserDialog(false)}
        isSubmitting={isInvitingUser}
        control={control}
        errors={errors}
        handleCreateUser={handleSubmit(handleCreateUser)}
        handleCreateAndInviteUser={handleSubmit(handleCreateAndInviteUser)}
        customFieldDefinitions={customFieldDefinitions}
        permissions={permissions}
        onPermissionChange={handlePermissionChange}
        customFields={customFields}
        onCustomFieldChange={handleCustomFieldChange}
        profileImage={profileImage}
        onAvatarChange={handleAvatarChange}
      />
      <UserInfoDrawer />
    </>
  );
};

export default UsersSettings;
