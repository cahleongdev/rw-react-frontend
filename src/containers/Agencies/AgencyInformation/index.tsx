import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PhotoIcon, PencilIcon } from '@heroicons/react/24/solid';
import { fetchAgency } from '@store/slices/agencySlice';
import { RootState, AppDispatch } from '@/store/index';

import EditAgencyInformationDetails from './EditAgencyInformationDetails'; // Changed from EditAgencyDetailsContainer
import UploadLogoContainer from '@/containers/AgencySettings/AgencySettings/UploadLogo'; // Corrected path
import EditCustomFieldsContainer from '@/containers/AgencySettings/AgencySettings/EditCustomFields'; // Corrected path

import { Button } from '@/components/base/Button';
import { DataLoading } from '@/components/base/Loading';
// Agency type is already imported in EditAgencyInformationDetails, but good to have if directly used here.
// import { Agency } from '@/store/types';

interface AgencyInformationProps {
  agencyId: string;
}

const AgencyInformation: React.FC<AgencyInformationProps> = ({ agencyId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showUploadLogo, setShowUploadLogo] = useState(false);
  const [showEditAgency, setShowEditAgency] = useState(false); // This controls EditAgencyInformationDetails
  const [showEditCustomFields, setShowEditCustomFields] = useState(false);

  const { agency, loading } = useSelector((state: RootState) => state.agency);

  const customFieldDefs = useSelector(
    (state: RootState) => state.customFieldDefinitions.agency_entity_fields,
  );

  useEffect(() => {
    if (agencyId) {
      dispatch(fetchAgency(agencyId));
    }
  }, [agencyId, dispatch]);

  if (loading && !agency && !agencyId) {
    return <DataLoading />;
  }

  const displayData = (data: any) => data || '-';

  return (
    <>
      <div className="flex flex-col gap-6 grow overflow-y-auto p-6 bg-white rounded-lg shadow">
        {/* Header can be dynamic if needed */}
        {/* <h4 className="text-slate-950">Agency Information</h4> */}
        {/* <hr className="border border-secondary" /> */}

        {/* Agency Logo Section */}
        <div className="flex flex-row gap-4 items-start">
          <div className="w-70 body2-medium text-slate-700 pt-1">
            Agency Logo
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="flex justify-center items-center w-28 h-28 border border-slate-200 rounded bg-slate-50">
              {agency?.logo_url ? (
                <img
                  src={agency.logo_url}
                  alt="Agency Logo"
                  className="object-contain w-full h-full rounded"
                />
              ) : (
                <PhotoIcon className="size-16 text-slate-300" />
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowUploadLogo(true)}
            >
              Upload Logo
            </Button>
          </div>
        </div>
        <hr className="border-slate-200" />

        {/* Agency Details Section */}
        <div className="flex flex-row gap-4 items-start">
          <div className="w-70 body2-medium text-slate-700 pt-1">
            Agency Details
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-row justify-between items-start">
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">Agency Name</div>
                <div className="body2-regular text-slate-500">
                  {displayData(agency?.title)}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowEditAgency(true)}
              >
                <PencilIcon className="size-3 mr-1" />
                Edit
              </Button>
            </div>

            {/* Combined grid for details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {/* Original fields */}
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">
                  Street Address
                </div>
                <div className="body2-regular text-slate-500">
                  {displayData(agency?.street_address)}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">City</div>
                <div className="body2-regular text-slate-500">
                  {displayData(agency?.city)}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">State</div>
                <div className="body2-regular text-slate-500">
                  {displayData(agency?.state)}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">County</div>
                <div className="body2-regular text-slate-500">
                  {displayData(agency?.county)}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">
                  Years in Operation
                </div>
                <div className="body2-regular text-slate-500">
                  {displayData(agency?.years_operation)}
                </div>
              </div>

              {/* New fields from AddAgency */}
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">Jurisdiction</div>
                <div className="body2-regular text-slate-500">
                  {displayData(agency?.jurisdiction)}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">
                  Authorize Type
                </div>
                <div className="body2-regular text-slate-500">
                  {displayData(agency?.authorize_type)}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">
                  Number of Schools
                </div>
                <div className="body2-regular text-slate-500">
                  {displayData(agency?.number_of_schools)}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">Calendar Year</div>
                <div className="body2-regular text-slate-500">
                  {displayData(agency?.calendar_year)}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">Domain</div>
                <div className="body2-regular text-slate-500">
                  {displayData(agency?.domain)}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">Annual Budget</div>
                <div className="body2-regular text-slate-500">
                  {displayData(agency?.annual_budget)}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">
                  Number of Impacted Students
                </div>
                <div className="body2-regular text-slate-500">
                  {displayData(agency?.number_of_impacted_students)}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">
                  Access to Schools
                </div>
                <div className="body2-regular text-slate-500">
                  {agency?.access_school ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-slate-200" />

        {/* Custom Fields Section */}
        <div className="flex flex-row gap-4 items-start">
          <div className="w-70 body2-medium text-slate-700 pt-1">
            Custom Fields
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {customFieldDefs && customFieldDefs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {customFieldDefs.map((field) => (
                  <div className="flex flex-col gap-1" key={field.Name}>
                    <div className="body2-medium text-slate-700">
                      {field.Name}
                    </div>
                    <div className="body2-regular text-slate-500">
                      {displayData(agency?.custom_fields?.[field.Name])}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="body2-regular text-slate-500 italic">
                No custom fields defined for agencies.
              </div>
            )}
            {/* Show Edit button only if there are fields to edit */}
            {customFieldDefs && customFieldDefs.length > 0 && (
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowEditCustomFields(true)}
                >
                  <PencilIcon className="size-3 mr-1" />
                  Edit Custom Fields
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <UploadLogoContainer
        agencyId={agencyId}
        open={showUploadLogo}
        onClose={() => setShowUploadLogo(false)}
      />
      <EditAgencyInformationDetails // Changed from EditAgencyDetailsContainer
        agencyId={agencyId}
        open={showEditAgency}
        onClose={() => setShowEditAgency(false)}
      />
      <EditCustomFieldsContainer
        agencyId={agencyId}
        open={showEditCustomFields}
        onClose={() => setShowEditCustomFields(false)}
      />
    </>
  );
};

export default AgencyInformation;
