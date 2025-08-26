import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PhotoIcon, PencilIcon } from '@heroicons/react/24/solid';
import { fetchAgency } from '@store/slices/agencySlice';
import { RootState, AppDispatch } from '@/store/index';

import EditAgencyDetailsContainer from './EditAgencyDetails';
import UploadLogoContainer from './UploadLogo';
import EditCustomFieldsContainer from './EditCustomFields';

import { Button } from '@/components/base/Button';
import { DataLoading } from '@/components/base/Loading';

interface AgencySettingsProps {
  agencyId: string;
}

const AgencySettings: React.FC<AgencySettingsProps> = ({ agencyId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showUploadLogo, setShowUploadLogo] = useState(false);
  const [showEditAgency, setShowEditAgency] = useState(false);
  const [showEditCustomFields, setShowEditCustomFields] = useState(false);

  const { agency, loading } = useSelector((state: RootState) => state.agency);

  const customFieldDefs = useSelector(
    (state: RootState) =>
      state.agency.customFieldDefinitions.agency_entity_fields,
  );

  useEffect(() => {
    if (agencyId) {
      dispatch(fetchAgency(agencyId));
    }
  }, [agencyId, dispatch]);

  if (loading && !agency && !agencyId) {
    return <DataLoading />;
  } // For now, returning null or a generic message if no agency can be loaded.

  return (
    <>
      <div className="flex flex-col gap-6 grow overflow-y-auto">
        <h4 className="text-slate-950">Agency Information</h4>
        <hr className="border border-secondary" />
        <div className="flex flex-row gap-4">
          <div className="w-70 body2-medium text-slate-700">Agency Logo</div>
          <div className="flex flex-col gap-1 items-center">
            <div className="flex flex-row justify-center items-center w-25 h-25">
              {agency?.logo_url ? (
                <img
                  src={agency.logo_url}
                  alt="Agency Logo"
                  className="object-contain w-full h-full rounded"
                />
              ) : (
                <PhotoIcon className="size-25 text-slate-200" />
              )}
            </div>
            <Button variant="outline" onClick={() => setShowUploadLogo(true)}>
              Upload Logo
            </Button>
          </div>
        </div>
        <hr className="border border-secondary" />
        <div className="flex flex-row gap-4">
          <div className="w-70 body2-medium text-slate-700">Agency Details</div>
          <div className="flex flex-col gap-4 w-[512px]">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">Agency Name</div>
                <div className="body2-regular text-slate-500">
                  {agency?.title || '-'}
                </div>
              </div>
              <Button variant="outline" onClick={() => setShowEditAgency(true)}>
                <PencilIcon className="size-3" />
                Edit
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              <div className="body2-medium text-slate-700">Street Address</div>
              <div className="body2-regular text-slate-500">
                {agency?.street_address || '-'}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="body2-medium text-slate-700">City</div>
              <div className="body2-regular text-slate-500">
                {agency?.city || '-'}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="body2-medium text-slate-700">State</div>
              <div className="body2-regular text-slate-500">
                {agency?.state || '-'}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="body2-medium text-slate-700">County</div>
              <div className="body2-regular text-slate-500">
                {agency?.county || '-'}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="body2-medium text-slate-700">
                Years in Operation
              </div>
              <div className="body2-regular text-slate-500">
                {agency?.years_operation || '-'}
              </div>
            </div>
          </div>
        </div>
        <hr className="border border-secondary" />
        <div className="flex flex-row gap-4">
          <div className="w-70 body2-medium text-slate-700">Custom Fields</div>
          <div className="flex justify-between  w-[512px]">
            {customFieldDefs && customFieldDefs.length > 0 ? (
              <div className="flex flex-col gap-4">
                {customFieldDefs.map((field) => (
                  <div className="flex flex-col gap-1" key={field.Name}>
                    <div className="body2-medium text-slate-700">
                      {field.Name}
                    </div>
                    <div className="body2-regular text-slate-500">
                      {agency?.custom_fields?.[field.Name] || '-'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="body2-regular text-slate-500">
                No custom fields
              </div>
            )}
            {customFieldDefs && customFieldDefs.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowEditCustomFields(true)}
              >
                <PencilIcon className="size-3" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
      <UploadLogoContainer
        agencyId={agencyId}
        open={showUploadLogo}
        onClose={() => setShowUploadLogo(false)}
      />
      <EditAgencyDetailsContainer
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

export default AgencySettings;
