// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';

// import { RootState, AppDispatch } from '@/store';
// import { setLoading, setSchools } from '@/store/slices/schoolsSlice';
// import { SchoolUser, setUsers } from '@/store/slices/schoolUsersSlice';
// import { fetchAllAgencyAdminSchools } from '@/api/schoolsApi';
// import axios from '@/api/axiosInstance';
// import { SchoolView as SchoolViewContainer } from '@/containers/Schools/SchoolView';
// import { Loading } from '@/components/base/Loading';
// import { DrawerNavigationProvider } from '@/contexts/DrawerNavigationContext';

// const YourSchoolDetailPageContainer: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   const {
//     selectedSchoolId,
//     allSchools,
//     isLoadingSchools,
//     isLoadingAuth,
//     schoolData,
//   } = useSelector((state: RootState) => {
//     const id = state.uiState.selectedSchoolIdForAdmin;
//     return {
//       selectedSchoolId: id,
//       allSchools: state.schools.schools,
//       isLoadingSchools: state.schools.loading,
//       isLoadingAuth: state.auth.isLoading,
//       schoolData: id ? state.schools.schools.find((s) => s.id === id) : null,
//     };
//   });

//   // Fetch all schools if the list is empty
//   useEffect(() => {
//     const fetchAllSchools = async () => {
//       if (allSchools.length === 0 && !isLoadingSchools) {
//         dispatch(setLoading(true));
//         try {
//           const schools = await fetchAllAgencyAdminSchools();
//           dispatch(setSchools(schools));
//         } catch (error) {
//           // Error is logged in the API function, but page-specific context might be useful.
//           // For now, matching the previous behavior where only API logs,
//           // but a console.error specific to this container could be added.
//           console.error(
//             '[YourSchoolDetailPageContainer] Failed to fetch schools:',
//             error,
//           );
//         } finally {
//           dispatch(setLoading(false));
//         }
//       }
//     };

//     fetchAllSchools();
//   }, [dispatch, allSchools.length, isLoadingSchools]);

//   // Fetch school users when selectedSchoolId changes
//   useEffect(() => {
//     const fetchSchoolUsers = async () => {
//       // Fetch all agency admin users in one call
//       const { data: usersResult } = await axios.get<SchoolUser[]>(
//         '/users/agency_admin/',
//       );
//       dispatch(
//         setUsers({
//           data: usersResult,
//         }),
//       );
//     };

//     fetchSchoolUsers();
//   }, [dispatch, selectedSchoolId]);

//   // Handle auth loading first
//   if (isLoadingAuth) {
//     return <div>Loading user data...</div>;
//   }

//   // Handle case where no school is selected yet (after auth loads)
//   if (!selectedSchoolId) {
//     return <div>Please select a school from the dropdown in the header.</div>;
//   }

//   if (!selectedSchoolId || !schoolData || isLoadingSchools || isLoadingAuth) {
//     // Fallback or if selectedSchoolId is set but schoolData is somehow still null
//     // (though the above conditions should cover most cases)
//     return <Loading />; // Or a more specific "No school selected or data unavailable" message
//   }

//   // Handle case where selected school data wasn't found after loading all schools
//   // This check is important if selectedSchoolId might point to an invalid/non-existent school
//   if (!isLoadingSchools && !schoolData && selectedSchoolId) {
//     return (
//       <div>Error: Could not find school data for ID: {selectedSchoolId}</div>
//     );
//   }

//   // If a school is selected and its data is found, render the SchoolViewContainer
//   return (
//     <DrawerNavigationProvider>
//       <SchoolViewContainer schoolId={selectedSchoolId} />
//     </DrawerNavigationProvider>
//   );
// };

// export default YourSchoolDetailPageContainer;
