import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { Button } from '@/components/base/Button';
import { confirm } from '@/components/base/Confirmation';
import CategoryManager from '@/components/AgencySettings/DisplaySettings/CategoryManager';
import AnnouncementCategoryManager from '@components/AgencySettings/DisplaySettings/AnnounmentCategoryManager';

import { RootState, AppDispatch } from '@/store/index';
import {
  fetchCategories,
  batchUpdateCategories,
} from '@/store/slices/categoriesSlice';
import {
  fetchAnnouncementsCategories,
  batchUpdateAnnouncementsCategories,
} from '@/store/slices/announcementsCategoriesSlice';

const DisplaySettings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading } = useSelector(
    (state: RootState) => state.categories,
  );
  const {
    categories: announcementsCategories,
    loading: announcementsCategoriesLoading,
  } = useSelector((state: RootState) => state.announcementsCategories);

  const [editedCategories, setEditedCategories] = useState<
    Record<string, string>
  >({});
  const [editedAnnouncementsCategories, setEditedAnnouncementsCategories] =
    useState<Record<string, string>>({});
  const [deletedCategories, setDeletedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [deletedAnnouncementsCategories, setDeletedAnnouncementsCategories] =
    useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [newCategories, setNewCategories] = useState<
    { name: string; color: string }[]
  >([]);
  const [newAnnouncementsCategories, setNewAnnouncementsCategories] = useState<
    { name: string; color: string }[]
  >([]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAnnouncementsCategories());
  }, [dispatch]);

  const hasUnsavedChanges =
    Object.keys(editedCategories).length > 0 ||
    deletedCategories.size > 0 ||
    Object.keys(editedAnnouncementsCategories).length > 0 ||
    deletedAnnouncementsCategories.size > 0 ||
    newCategories.length > 0 ||
    newAnnouncementsCategories.length > 0;

  const handleCancel = () => {
    if (!hasUnsavedChanges) return;
    confirm({
      title: 'Unsaved Changes',
      message:
        'Are you sure you want to discard your changes? All unsaved changes will be lost.',
      onConfirm: () => {
        setEditedCategories({});
        setDeletedCategories(new Set());
        setNewCategories([]);
        setNewAnnouncementsCategories([]);
      },
      confirmText: 'Discard Changes',
      cancelText: 'Stay On This Page',
      confirmButtonStyle: 'bg-red-500 hover:bg-red-600 text-white',
    });
  };

  const handleSave = async () => {
    // Validate: no new category should have a blank name
    const hasBlankName = newCategories.some((cat) => !cat.name.trim());
    const hasBlankAnnouncementsName = newAnnouncementsCategories.some(
      (cat) => !cat.name.trim(),
    );
    if (hasBlankName || hasBlankAnnouncementsName) {
      if (hasBlankName && hasBlankAnnouncementsName) {
        toast.error(
          'Category and announcement names cannot be blank. Please fill in all category and announcement names before saving.',
        );
        return;
      }
      if (hasBlankName) {
        toast.error(
          'Category name cannot be blank. Please fill in all category names before saving.',
        );
        return;
      }
      if (hasBlankAnnouncementsName) {
        toast.error(
          'Announcement name cannot be blank. Please fill in all announcement names before saving.',
        );
        return;
      }
    }
    setSaving(true);
    try {
      if (
        newCategories.length > 0 ||
        Object.keys(editedCategories).length > 0 ||
        deletedCategories.size > 0
      ) {
        await dispatch(
          batchUpdateCategories({
            updates: Object.entries(editedCategories).map(([id, color]) => ({
              id,
              color,
            })),
            deletes: Array.from(deletedCategories),
            adds: newCategories.filter((cat) => cat.name.trim()),
          }),
        );
      }

      if (
        newAnnouncementsCategories.length > 0 ||
        Object.keys(editedAnnouncementsCategories).length > 0 ||
        deletedAnnouncementsCategories.size > 0
      ) {
        await dispatch(
          batchUpdateAnnouncementsCategories({
            updates: Object.entries(editedAnnouncementsCategories).map(
              ([id, color]) => ({ id, color }),
            ),
            deletes: Array.from(deletedAnnouncementsCategories),
            adds: newAnnouncementsCategories.filter((cat) => cat.name.trim()),
          }),
        );
      }

      setEditedCategories({});
      setDeletedCategories(new Set());
      setEditedAnnouncementsCategories({});
      setDeletedAnnouncementsCategories(new Set());
      setNewCategories([]);
      setNewAnnouncementsCategories([]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-5 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h4 className="text-slate-950">Display</h4>
          <p className="body2-regular text-slate-500">
            Manage your custom colors for all objects in one space.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={!hasUnsavedChanges}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
      <hr className="border border-secondary" />
      <CategoryManager
        categories={categories}
        loading={loading}
        edited={editedCategories}
        setEdited={setEditedCategories}
        deleted={deletedCategories}
        setDeleted={setDeletedCategories}
        newCategories={newCategories}
        setNewCategories={setNewCategories}
        saving={saving}
      />
      <hr className="border border-secondary" />

      <AnnouncementCategoryManager
        categories={announcementsCategories}
        loading={announcementsCategoriesLoading}
        edited={editedAnnouncementsCategories}
        setEdited={setEditedAnnouncementsCategories}
        deleted={deletedAnnouncementsCategories}
        setDeleted={setDeletedAnnouncementsCategories}
        newCategories={newAnnouncementsCategories}
        setNewCategories={setNewAnnouncementsCategories}
        saving={saving}
      />

      <hr className="border border-secondary" />
      <div className="flex justify-end items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={!hasUnsavedChanges}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings;
