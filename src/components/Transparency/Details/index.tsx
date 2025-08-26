import { PencilIcon } from '@heroicons/react/24/solid';

import {
  TransparencyContactDetail,
  TransparencyDetail,
  TransparencyLinkFields,
} from '@containers/Transparency/index.types';
import EditAgencyLogoContainer from '@containers/Transparency/Details/EditAgencyLogo';

import EditContactDetails from '@components/Transparency/Details/EditContactDetails';
import EditLinkFields from '@components/Transparency/Details/EditLinkFields';
import { Loading } from '@components/base/Loading';

interface TransparencyDetailsProps {
  loading: boolean;
  transparencyDetail?: TransparencyDetail;
  setTransparencyDetail: (formData: TransparencyDetail) => void;
  onEditAgencyLogoSubmit: (formData: TransparencyDetail) => void;
  onEditContactSubmit: (formData: TransparencyContactDetail) => void;
  onEditLinkFieldsSubmit: (formData: TransparencyLinkFields) => void;
  showAgencyLogo: boolean;
  setShowAgencyLogo: (show: boolean) => void;
  showEditContact: boolean;
  setShowEditContact: (show: boolean) => void;
  showEditLinkFields: boolean;
  setShowEditLinkFields: (show: boolean) => void;
}

const TransparencyDetails = ({
  loading,
  transparencyDetail,
  setTransparencyDetail,
  onEditAgencyLogoSubmit,
  onEditContactSubmit,
  onEditLinkFieldsSubmit,
  showAgencyLogo,
  setShowAgencyLogo,
  showEditContact,
  setShowEditContact,
  showEditLinkFields,
  setShowEditLinkFields,
}: TransparencyDetailsProps) => {
  return (
    <div className="overflow-y-auto min-h-[calc(100vh-48px)] flex flex-col bg-white p-6 flex flex-col gap-6 grow">
      {loading ? (
        <Loading />
      ) : (
        <>
          <h4 className="text-slate-950">Agency Details</h4>
          <hr className="border border-secondary" />
          <div className="flex flex-row gap-4">
            <div className="w-70 body2-medium text-slate-700">Agency Logo</div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-row justify-center items-center w-25 h-25">
                <img
                  src={transparencyDetail?.logo_url}
                  alt="Agency Logo"
                  className="w-25 h-25 object-cover rounded-sm"
                />
              </div>
              <button
                className="rounded-sm border border-slate-500 px-3 py-2 body3-semibold leading-[1.0] cursor-pointer"
                onClick={() => setShowAgencyLogo(true)}
              >
                Upload Logo
              </button>
            </div>
          </div>
          <hr className="border border-secondary" />
          <div className="flex flex-row gap-4">
            <div className="w-70 body2-medium text-slate-700">
              Contact Details
            </div>
            <div className="flex flex-col gap-4 w-[512px]">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-1">
                  <div className="body2-medium text-slate-700">
                    Contact Phone Number
                  </div>
                  <div className="body2-regular text-slate-500">
                    {transparencyDetail?.contact_phone_number}
                  </div>
                </div>
                <button
                  className="rounded-sm border border-slate-500 px-3 py-2 body3-semibold leading-[1.0] flex flex-row items-center gap-2 h-fit cursor-pointer"
                  onClick={() => setShowEditContact(true)}
                >
                  <PencilIcon className="size-3" />
                  Edit
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">Contact Email</div>
                <div className="body2-regular text-slate-500">
                  {transparencyDetail?.contact_email}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">Address</div>
                <div className="body2-regular text-slate-500">
                  {transparencyDetail?.street_address}
                  <br />
                  {transparencyDetail?.city}, {transparencyDetail?.state}
                  <br />
                  {transparencyDetail?.country}
                </div>
              </div>
            </div>
          </div>
          <hr className="border border-secondary" />
          <div className="flex flex-row gap-4">
            <div className="w-70 body2-medium text-slate-700">Links</div>
            <div className="flex flex-col gap-4 w-[512px]">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-1">
                  <div className="body2-medium text-slate-700">Help/FAQs</div>
                  <div className="body2-regular text-slate-500">
                    {transparencyDetail?.help_faqs_url}
                  </div>
                </div>
                <button
                  className="rounded-sm border border-slate-500 px-3 py-2 body3-semibold leading-[1.0] flex flex-row items-center gap-2 h-fit cursor-pointer"
                  onClick={() => setShowEditLinkFields(true)}
                >
                  <PencilIcon className="size-3" />
                  Edit
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">Contact Form</div>
                <div className="body2-regular text-slate-500">
                  {transparencyDetail?.contact_form_url}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">
                  Privacy Policy
                </div>
                <div className="body2-regular text-slate-500">
                  {transparencyDetail?.privacy_policy_url}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">
                  Website Homepage
                </div>
                <div className="body2-regular text-slate-500">
                  {transparencyDetail?.website_homepage_url}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="body2-medium text-slate-700">Custom Domain</div>
                <div className="body2-regular text-slate-500">
                  {transparencyDetail?.custom_domain_url}
                </div>
              </div>
            </div>
          </div>
          {showAgencyLogo && (
            <EditAgencyLogoContainer
              open={showAgencyLogo}
              onSubmit={onEditAgencyLogoSubmit}
              onClose={() => setShowAgencyLogo(false)}
              transparencyDetail={
                transparencyDetail || ({} as TransparencyDetail)
              }
              setTransparencyDetail={setTransparencyDetail}
            />
          )}
          {showEditContact && (
            <EditContactDetails
              open={showEditContact}
              onSubmit={onEditContactSubmit}
              onClose={() => setShowEditContact(false)}
              transparencyDetail={
                transparencyDetail || ({} as TransparencyDetail)
              }
            />
          )}
          {showEditLinkFields && (
            <EditLinkFields
              open={showEditLinkFields}
              onSubmit={onEditLinkFieldsSubmit}
              onClose={() => setShowEditLinkFields(false)}
              transparencyDetail={
                transparencyDetail || ({} as TransparencyDetail)
              }
            />
          )}
        </>
      )}
    </div>
  );
};

export default TransparencyDetails;
