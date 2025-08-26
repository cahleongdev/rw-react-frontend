import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';

import EditCustomFieldsComponent from '@/components/AgencySettings/AgencySettings/EditCustomFields';
import { RootState, AppDispatch } from '@/store/index';
import { updateAgency } from '@store/slices/agencySlice';

interface EditCustomFieldsProps {
  open: boolean;
  onClose: () => void;
  agencyId: string;
}

const EditCustomFields = ({
  open,
  onClose,
  agencyId,
}: EditCustomFieldsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const customFieldDefs = useSelector(
    (state: RootState) =>
      state.agency.customFieldDefinitions.agency_entity_fields,
  );
  const agencyCustomFields =
    useSelector((state: RootState) => state.agency.agency?.custom_fields) || {};
  // Map definitions to initial fields with values from agency custom fields
  const initialFields = customFieldDefs.reduce(
    (acc, def) => ({
      ...acc,
      [def.Name]: agencyCustomFields[def.Name] || '',
    }),
    {} as Record<string, string>,
  );

  // Handle form submit (validated fields from component)
  const handleSubmit = (fields: Record<string, string>) => {
    if (!agencyId) return;
    dispatch(
      updateAgency({
        agencyId,
        updates: {
          custom_fields: fields,
        },
      }),
    )
      .unwrap()
      .then(() => {
        toast.success('Custom fields updated successfully');
        onClose();
      })
      .catch(() => {
        toast.error('Failed to update custom fields');
      });
  };

  return (
    <EditCustomFieldsComponent
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      initialFields={initialFields}
    />
  );
};

export default EditCustomFields;
