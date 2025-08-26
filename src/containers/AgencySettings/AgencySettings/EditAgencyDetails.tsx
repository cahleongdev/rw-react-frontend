import { useSelector, useDispatch } from 'react-redux';

import EditAgencyDetailsComponent from '@/components/AgencySettings/AgencySettings/EditAgencyDetails';
import { RootState, AppDispatch } from '@/store/index';
import { updateAgency } from '@store/slices/agencySlice';

interface EditAgencyDetailsContainerProps {
  open: boolean;
  onClose: () => void;
  agencyId: string;
}

const EditAgencyDetails = ({
  open,
  onClose,
  agencyId,
}: EditAgencyDetailsContainerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { agency } = useSelector((state: RootState) => state.agency);

  // Prepare initial values for the form (all fields optional)
  const initialValues = {
    agencyName: agency?.title || '',
    streetAddress: agency?.street_address || '',
    city: agency?.city || '',
    state: agency?.state || '',
    county: agency?.county || '',
    yearsOperation: agency?.years_operation || '',
  };

  // Handle form submit (validated data from component)
  const handleSubmit = (data: {
    agencyName: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    county?: string;
    yearsOperation?: string;
  }) => {
    if (!agencyId) return;
    dispatch(
      updateAgency({
        agencyId,
        updates: {
          title: data.agencyName,
          street_address: data.streetAddress,
          city: data.city,
          state: data.state,
          county: data.county,
          years_operation: data.yearsOperation,
        },
      }),
    )
      .unwrap()
      .then(() => onClose());
  };

  return (
    <EditAgencyDetailsComponent
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      initialValues={initialValues}
    />
  );
};

export default EditAgencyDetails;
