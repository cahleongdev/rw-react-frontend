import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { RootState, AppDispatch } from '@/store';
import {
  fetchAgencies,
  deleteAgency,
  addAgency,
} from '@/store/slices/agenciesSlice';
import AgenciesComponent from '@/components/Agencies/SuperAdmin';
import AgencyDetails from '@/containers/Agencies/AgencyDetails';
import { confirm } from '@/components/base/Confirmation';
import AddAgency from '@/components/Agencies/AddAgency';
import { Agency } from '@/store/types';
import { DataLoading } from '@/components/base/Loading';
import { Button } from '@/components/base/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { toast } from 'sonner';

// Extend Agency type to include status
interface AgencyWithStatus extends Agency {
  status: 'active' | 'inactive';
}

const SuperAdminContainer = () => {
  const { agencyId } = useParams<{ agencyId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Get agencies data from Redux
  const allAgenciesFromStore = useSelector(
    (state: RootState) => state.agencies.agencies,
  );
  const agenciesLoading = useSelector(
    (state: RootState) => state.agencies.loading,
  );

  const agencies = React.useMemo(
    () =>
      (allAgenciesFromStore || []).map((agency) => ({
        ...agency,
        status: agency.status || 'active',
      })) as AgencyWithStatus[],
    [allAgenciesFromStore],
  );

  // Local state
  const [isAddAgencyOpen, setIsAddAgencyOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('Active');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAgencies());
  }, [dispatch]);

  const filteredAndSortedAgencies = useCallback(() => {
    return (agencies || [])
      .filter((agency) => {
        if (!agency) return false;
        const matchesFilter =
          activeFilter === 'Active'
            ? agency.status === 'active'
            : agency.status === 'inactive';
        const searchLower = searchText.toLowerCase();
        const matchesSearch = agency.title?.toLowerCase().includes(searchLower);
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        if (!a.id || !b.id) return 0;
        // Assuming creation timestamp or a sortable ID is available if actual newest/oldest is needed
        // For now, using ID as a proxy for sort order as in original code
        return sortOrder === 'newest'
          ? b.id.localeCompare(a.id)
          : a.id.localeCompare(b.id);
      });
  }, [agencies, activeFilter, searchText, sortOrder]);

  // Handlers for LIST VIEW actions
  const handleViewAgencySettings = (id: string) => {
    navigate(`/agencies/${id}/details`);
  };

  const handleEditAgency = (id: string) => {
    navigate(`/agencies/${id}/details`); // Or a specific edit route if different
  };

  const handleDeleteAgency = (id: string) => {
    const agencyToDelete = agencies.find((agency) => agency.id === id);
    const agencyName = agencyToDelete ? agencyToDelete.title : 'this agency';

    confirm({
      title: 'Delete Agency?',
      message: `This will permanently delete the agency "${agencyName}" and remove its association from all users. Are you sure you want to delete? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmButtonStyle: 'bg-red-600 hover:bg-red-700 text-white',
      onConfirm: async () => {
        setIsSubmitting(true);
        try {
          await dispatch(deleteAgency(id)).unwrap();
          toast.success(`Agency "${agencyName}" deleted successfully.`);
          setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
        } catch (error) {
          console.error('Error deleting agency:', error);
          toast.error(`Failed to delete agency "${agencyName}".`);
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  const handleTabChange = (tab: string) => {
    setActiveFilter(tab);
    setSelectedRows([]);
  };

  const toggleSelectAll = () => {
    const currentFilteredIds = filteredAndSortedAgencies().map((a) => a.id);
    if (selectedRows.length === currentFilteredIds.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentFilteredIds);
    }
  };

  // Handler for Add Agency Modal submission
  const handleAddAgencySubmit = async (values: Partial<Agency>) => {
    setIsSubmitting(true);
    try {
      await dispatch(addAgency(values as Agency)).unwrap();
      toast.success('Agency added successfully!');
      setIsAddAgencyOpen(false);
    } catch (error) {
      console.error('Error adding agency:', error);
      toast.error('Failed to add agency.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Conditional Rendering based on agencyId ----
  if (agencyId) {
    if (agenciesLoading && !agencies.find((a) => a.id === agencyId)) {
      return <DataLoading />;
    }
    if (!agenciesLoading && !agencies.find((a) => a.id === agencyId)) {
      return (
        <div className="p-4 text-center text-red-500">Agency not found.</div>
      );
    }

    return (
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex items-center mb-4">
          <Button asChild variant="outline" size="sm" className="mr-4">
            <Link to="/agencies">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to List
            </Link>
          </Button>
        </div>
        <AgencyDetails />
      </div>
    );
  }

  const agenciesToRender = filteredAndSortedAgencies();

  return (
    <>
      <AgenciesComponent
        isAddAgencyOpen={isAddAgencyOpen}
        setIsAddAgencyOpen={setIsAddAgencyOpen}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        searchText={searchText}
        setSearchText={setSearchText}
        loading={agenciesLoading}
        agencies={agenciesToRender}
        handleEdit={handleEditAgency}
        handleView={handleViewAgencySettings}
        handleDeletePrompt={handleDeleteAgency}
        handleTabChange={handleTabChange}
        activeFilter={activeFilter}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        toggleSelectAll={toggleSelectAll}
      />

      {isAddAgencyOpen && (
        <AddAgency
          open={isAddAgencyOpen}
          onClose={() => setIsAddAgencyOpen(false)}
          onSubmit={handleAddAgencySubmit}
          isLoading={isSubmitting}
        />
      )}
    </>
  );
};

export default SuperAdminContainer;
