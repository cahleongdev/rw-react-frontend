import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  TransparencyDetail,
  TransparencyContactDetail,
  TransparencyLinkFields,
} from '@containers/Transparency/index.types';

import {
  fetchTransparencyDetails,
  updateTransparencyDetails,
} from '@/api/transparency';

import { RootState, AppDispatch } from '@/store';
import { updateAgency } from '@store/slices/agencySlice';

import TransparencyDetailsComponent from '@components/Transparency/Details';

const TransparencyDetailsContainer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, agenciesLoading } = useSelector((state: RootState) => ({
    user: state.auth.user,
    agenciesLoading: state.agency.loading,
  }));

  const agencyId = user?.agency;

  const [transparencyDetail, setTransparencyDetail] =
    useState<TransparencyDetail>();
  const [showEditContact, setShowEditContact] = useState(false);
  const [showEditLinkFields, setShowEditLinkFields] = useState(false);
  const [showAgencyLogo, setShowAgencyLogo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadTransparencyDetails = async () => {
    if (!user || !agencyId) return;
    return await fetchTransparencyDetails(agencyId);
  };

  useEffect(() => {
    setIsLoading(true);
    loadTransparencyDetails()
      .then((details) => {
        if (details) {
          const newTransparencyDetail = {
            logo: details.logo_url,
            ...details,
          };
          setTransparencyDetail(newTransparencyDetail);
        }
      })
      .catch((error) => {
        console.error('Error loading transparency details:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user, agencyId]);

  const onEditAgencyLogoSubmit = async (formData: TransparencyDetail) => {
    if (!agencyId) return;
    const responseData = await updateTransparencyDetails(formData);
    dispatch(
      updateAgency({
        agencyId: agencyId,
        updates: {
          logo_url: responseData.logo_url,
        },
      }),
    );
    setTransparencyDetail(responseData);
    setShowAgencyLogo(false);
  };

  const onEditContactSubmit = async (formData: TransparencyContactDetail) => {
    if (!agencyId) return;
    const responseData = await updateTransparencyDetails(formData);
    const updatedAgency = {
      street_address: responseData.street_address,
      city: responseData.city,
      state: responseData.state,
      county: responseData.country,
      zipcode: responseData.zipcode,
    };
    dispatch(updateAgency({ agencyId: agencyId, updates: updatedAgency }));
    setTransparencyDetail(responseData);
    setShowEditContact(false);
  };

  const onEditLinkFieldsSubmit = async (formData: TransparencyLinkFields) => {
    if (!agencyId) return;
    const responseData = await updateTransparencyDetails(formData);
    setTransparencyDetail(responseData);
    setShowEditLinkFields(false);
  };

  return (
    <TransparencyDetailsComponent
      loading={isLoading || agenciesLoading}
      transparencyDetail={transparencyDetail}
      setTransparencyDetail={setTransparencyDetail}
      onEditAgencyLogoSubmit={onEditAgencyLogoSubmit}
      onEditContactSubmit={onEditContactSubmit}
      onEditLinkFieldsSubmit={onEditLinkFieldsSubmit}
      showAgencyLogo={showAgencyLogo}
      setShowAgencyLogo={setShowAgencyLogo}
      showEditContact={showEditContact}
      setShowEditContact={setShowEditContact}
      showEditLinkFields={showEditLinkFields}
      setShowEditLinkFields={setShowEditLinkFields}
    />
  );
};

export default TransparencyDetailsContainer;
