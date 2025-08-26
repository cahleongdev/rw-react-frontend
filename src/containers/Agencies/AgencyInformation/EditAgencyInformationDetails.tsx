import { useSelector, useDispatch } from 'react-redux';
import EditAgencyInformationDetailsComponent from '@/components/Agencies/AgencyInformation/EditAgencyInformationDetailsComponent'; // Corrected import
import { RootState, AppDispatch } from '@/store/index';
import { updateAgency } from '@store/slices/agencySlice';
import { Agency } from '@/store/types'; // Assuming Agency type has all these fields

interface EditAgencyInformationDetailsContainerProps {
  open: boolean;
  onClose: () => void;
  agencyId: string;
}

// Define a type for the form data based on the component's Zod schema expectations
// This should align with FormValues in EditAgencyInformationDetailsComponent.tsx
type AgencyInformationFormValues = {
  agencyName: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  county?: string;
  yearsOperation?: string;
  jurisdiction?: string;
  authorize_type?: string;
  number_of_schools?: number;
  calendar_year?: string;
  domain?: string;
  annual_budget?: string;
  number_of_impacted_students?: number;
  access_school?: boolean;
};

const EditAgencyInformationDetails = ({
  open,
  onClose,
  agencyId,
}: EditAgencyInformationDetailsContainerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { agency, loading: agencyLoading } = useSelector(
    (state: RootState) => state.agency,
  );

  // Prepare initial values for the form
  const initialValues: AgencyInformationFormValues = {
    agencyName: agency?.title || '',
    streetAddress: agency?.street_address || '',
    city: agency?.city || '',
    state: agency?.state || '',
    county: agency?.county || '',
    yearsOperation: agency?.years_operation || '',
    jurisdiction: agency?.jurisdiction || '',
    authorize_type: agency?.authorize_type || '',
    number_of_schools:
      agency?.number_of_schools === null
        ? undefined
        : agency?.number_of_schools, // Handle null from API
    calendar_year: agency?.calendar_year || '',
    domain: agency?.domain || '',
    annual_budget: agency?.annual_budget || '', // Assuming string for form
    number_of_impacted_students:
      agency?.number_of_impacted_students === null
        ? undefined
        : agency?.number_of_impacted_students, // Handle null
    access_school: agency?.access_school || false,
  };

  const handleSubmit = (data: AgencyInformationFormValues) => {
    if (!agencyId) return;

    // Construct the updates object, ensuring types match Agency expectations
    const updates: Partial<Agency> = {
      title: data.agencyName,
      street_address: data.streetAddress,
      city: data.city,
      state: data.state,
      county: data.county,
      years_operation: data.yearsOperation,
      jurisdiction: data.jurisdiction,
      authorize_type: data.authorize_type,
      number_of_schools: data.number_of_schools,
      calendar_year: data.calendar_year,
      domain: data.domain,
      annual_budget: data.annual_budget, // API might expect number, ensure conversion if needed
      number_of_impacted_students: data.number_of_impacted_students,
      access_school: data.access_school,
    };

    dispatch(updateAgency({ agencyId, updates }))
      .unwrap()
      .then(() => {
        onClose(); // Close modal on success
        // Optionally, dispatch fetchAgency again if you want to ensure UI has the absolute latest data
        // dispatch(fetchAgency(agencyId));
      })
      .catch((error) => {
        console.error('Failed to update agency:', error);
        // Handle error display to user, e.g., using a toast notification
      });
  };

  return (
    <EditAgencyInformationDetailsComponent
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      isLoading={agencyLoading} // Pass loading state to disable form during submission
    />
  );
};

export default EditAgencyInformationDetails;
