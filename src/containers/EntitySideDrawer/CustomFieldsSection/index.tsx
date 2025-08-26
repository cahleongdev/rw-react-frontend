import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { CustomFieldsSection } from '@/components/EntitySideDrawer/Details/CustomFieldsSection';
import useFileUpload from '@/hooks/useFileUpload';

import { RootState, AppDispatch } from '@/store';
import { updateUser } from '@/store/slices/schoolUsersSlice';
import { updateAgencyUser } from '@/store/slices/agencySlice';
import { updateSchool } from '@/store/slices/schoolsSlice';
import { CustomFieldEntityType } from '@/store/slices/customFieldDefinitionsSlice';

import { validateField } from '@/utils/validation';
import axiosInstance from '@/api/axiosInstance';
import { EntityType } from '../index.types';
import BoardMembersAPI from '@/api/boardMembers';

interface Props {
  entityId?: string;
  entityType: EntityType;
  onAddFieldClick: (open: boolean) => void;
}

const CustomFieldsSectionContainer: React.FC<Props> = ({
  entityId,
  entityType,
  onAddFieldClick,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { uploadFile } = useFileUpload();

  const entity = useSelector((state: RootState) => {
    switch (entityType) {
      case EntityType.School:
        return state.schools.schools.find((s) => s.id === entityId);
      case EntityType.Network:
        return state.schools.schools.find((n) => n.id === entityId);
      case EntityType.SchoolUser:
        return state.schoolUsers.schoolUsers.find((u) => u.id === entityId);
      case EntityType.AgencyUser:
        return state.agency.users.find((u) => u.id === entityId);
      case EntityType.BoardMember:
        return state.school.boardMembers.find((u) => u.id === entityId);
      default:
        return null;
    }
  });

  // Custom field definitions for the entity
  const customFieldDefinitions = useSelector((state: RootState) => {
    if (entityType === EntityType.SchoolUser) {
      return (
        state.customFieldDefinitions[CustomFieldEntityType.SchoolUser] || []
      );
    }
    if (entityType === EntityType.BoardMember) {
      return (
        state.customFieldDefinitions[CustomFieldEntityType.BoardMember] || []
      );
    }
    if (entityType === EntityType.School) {
      return (
        state.customFieldDefinitions[CustomFieldEntityType.SchoolEntity] || []
      );
    }
    if (entityType === EntityType.Network) {
      return (
        state.customFieldDefinitions[CustomFieldEntityType.NetworkEntity] || []
      );
    }
    if (entityType === EntityType.AgencyUser) {
      return (
        state.customFieldDefinitions[CustomFieldEntityType.AgencyUser] || []
      );
    }
    return [];
  });

  // Custom fields for the entity
  const customFields = useSelector((state: RootState) => {
    if (
      entityType === EntityType.SchoolUser ||
      entityType === EntityType.BoardMember
    ) {
      return (
        state.schoolUsers.schoolUsers.find((u) => u.id === entityId)
          ?.custom_fields ?? null
      );
    }
    if (entityType === EntityType.School || entityType === EntityType.Network) {
      return (
        state.schools.schools.find((s) => s.id === entityId)?.custom_fields ??
        null
      );
    }
    if (entityType === EntityType.AgencyUser) {
      return (
        state.agency.users.find((u) => u.id === entityId)?.custom_fields ?? null
      );
    }
    return null;
  });

  // Custom Fields logic
  const handleUserCustomFieldSave = useCallback(
    async (fieldName: string, newValue: string | File) => {
      if (!entity) return;
      if (newValue instanceof File) {
        toast.error('An internal error occurred while saving the file field.');
        return;
      }

      const finalValue = newValue;
      const fieldDefinition = customFieldDefinitions.find(
        (f) => f.Name === fieldName,
      );

      const validationError = validateField(
        fieldName,
        finalValue,
        fieldDefinition?.Type,
      );

      if (validationError) {
        toast.error(validationError);
        return;
      }

      try {
        if (
          (entityType === EntityType.AgencyUser ||
            entityType === EntityType.BoardMember) &&
          entity
        ) {
          const updatedCustomFields = {
            ...(entity.custom_fields || {}),
            [fieldName]: finalValue,
          };
          const payload = { custom_fields: updatedCustomFields };
          await axiosInstance.put(`/users/${entityId}/`, payload);
          if (entityType === EntityType.AgencyUser) {
            dispatch(
              updateAgencyUser({
                id: entityId as string,
                updates: { custom_fields: updatedCustomFields },
              }),
            );
          } else {
            dispatch(
              updateUser({
                id: entityId as string,
                updates: { custom_fields: updatedCustomFields },
              }),
            );
          }
        }

        if (entityType === EntityType.BoardMember) {
          const updatedCustomFields = {
            ...(entity.custom_fields || {}),
            [fieldName]: finalValue,
          };
          const payload = { custom_fields: updatedCustomFields };
          await BoardMembersAPI.updateBoardMember(entityId as string, payload);
        }

        if (
          (entityType === EntityType.School ||
            entityType === EntityType.Network) &&
          entity
        ) {
          const updatedCustomFields = {
            ...(entity.custom_fields || {}),
            [fieldName]: finalValue,
          };
          const payload = { custom_fields: updatedCustomFields };
          await axiosInstance.put(`/schools/${entityId}/`, payload);
          dispatch(
            updateSchool({
              id: entityId as string,
              updates: { custom_fields: updatedCustomFields },
            }),
          );
        }
        toast.success('Custom field updated successfully');
      } catch {
        toast.error('Failed to update custom field');
      }
    },
    [customFieldDefinitions, dispatch, entityId, entityType, entity],
  );

  const handleCustomFieldFileUpload = useCallback(
    async (
      file: File,
      onProgress: (progress: number) => void,
    ): Promise<string> => {
      try {
        const fileUrl = await uploadFile(file, onProgress);
        if (!fileUrl) {
          throw new Error('Upload returned empty URL');
        }
        return fileUrl;
      } catch (error) {
        console.error('Custom field file upload failed:', error);
        throw new Error('File upload failed. Please try again.');
      }
    },
    [uploadFile],
  );

  return (
    <CustomFieldsSection
      customFieldDefinitions={customFieldDefinitions}
      customFields={customFields}
      onCustomFieldSave={handleUserCustomFieldSave}
      onAddFieldClick={() => onAddFieldClick(true)}
      onCustomFieldFileUpload={handleCustomFieldFileUpload}
    />
  );
};

export default CustomFieldsSectionContainer;
