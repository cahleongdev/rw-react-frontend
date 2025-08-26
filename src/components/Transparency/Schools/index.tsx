import { useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';

import { TransparencySchool } from '@containers/Transparency/index.types';

import { TableBody, TableCell } from '@components/base/Table';
import { Table, TableRow, TableHeader } from '@components/base/Table';
import { Loading } from '@components/base/Loading';
import EditSchoolTransparencyDetailsContainer from '@containers/Transparency/Schools/EditSchoolTransparencyDetails';

type TransparencySchoolsComponentProps = {
  schools: TransparencySchool[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onEditSchoolSubmit: (formData: Omit<TransparencySchool, 'id'>) => void;
  showEditSchoolTransparencyDetails: boolean;
  setShowEditSchoolTransparencyDetails: (show: boolean) => void;
  selectedSchool: TransparencySchool | null;
  setSelectedSchool: (school: TransparencySchool | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (previewUrl: string | null) => void;
  selectedFile: File | null;
  setSelectedFile: (selectedFile: File | null) => void;
};

const TransparencySchoolsComponent = ({
  schools,
  loading,
  setLoading,
  onEditSchoolSubmit,
  showEditSchoolTransparencyDetails,
  setShowEditSchoolTransparencyDetails,
  selectedSchool,
  setSelectedSchool,
  previewUrl,
  setPreviewUrl,
  selectedFile,
  setSelectedFile,
}: TransparencySchoolsComponentProps) => {
  useEffect(() => {
    if (selectedSchool) {
      setPreviewUrl(selectedSchool.logo || null);
    }
  }, [selectedSchool]);

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return new Date(date).toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex flex-col h-full relative">
      {loading ? (
        <Loading />
      ) : schools.length > 0 ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <Table className="border-slate-200 bg-white">
            <TableHeader className="sticky top-0 z-10 bg-beige-100">
              <TableRow className="hover:bg-transparent">
                <TableCell className="py-2 px-6">
                  <span className="body2-medium text-slate-500">School</span>
                </TableCell>
                <TableCell className="py-2 px-6">
                  <span className="body2-medium text-slate-500">Address</span>
                </TableCell>
                <TableCell className="py-2 px-6">
                  <span className="body2-medium text-slate-500">Opened In</span>
                </TableCell>
                <TableCell className="py-2 px-6">
                  <span className="body2-medium text-slate-500">
                    Contract Expire
                  </span>
                </TableCell>
                <TableCell className="py-2 px-6">
                  <span className="body2-medium text-slate-500">
                    Grades Served
                  </span>
                </TableCell>
                <TableCell className="py-2 px-6">
                  <span className="body2-medium text-slate-500">
                    Contact Phone
                  </span>
                </TableCell>
                <TableCell className="py-2 px-6">
                  <span className="body2-medium text-slate-500">Website</span>
                </TableCell>
                <TableCell className="py-2 px-6 flex justify-end"></TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="bg-white py-8 px-6">
              {schools.map((school) => {
                return (
                  <TableRow
                    key={school.id}
                    className="border-b border-beige-500 hover:bg-beige-50/50 cursor-pointer bg-white"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowEditSchoolTransparencyDetails(true);
                      setSelectedSchool(school);
                    }}
                  >
                    <TableCell className="py-4 px-6">
                      <span className="body1-regular">{`${school.name}`}</span>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <span className="body1-regular">{`${school.address}`}</span>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <span className="body1-regular">{`${school.founded_at || ''}`}</span>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <span className="body1-regular">{`${school.contract_expires ? formatDate(school.contract_expires) : ''}`}</span>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <span className="body1-regular">{`${school.gradeserved}`}</span>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <span className="body1-regular">{`${school.contact_phone_number || ''}`}</span>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <span className="body1-regular">{`${school.website_url || ''}`}</span>
                    </TableCell>
                    <TableCell className="py-4 px-6 flex justify-end">
                      <div className="flex justify-end gap-2">
                        <button className="rounded-md hover:bg-slate-100">
                          <PencilIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="gap-4 flex flex-col items-center justify-center h-full">
            <img
              src="/assets/images/svg/transparency-no-schools.svg"
              alt="No Schools"
              className="w-[100.5px] h-[100.5px]"
            />
            <h2 className="text-slate-500">No schools to Display</h2>
            <div className="flex flex-col gap-2">
              <p className="text-slate-500">
                Schools and their details will display here once schools have
                been added
              </p>
            </div>
          </div>
        </div>
      )}

      {showEditSchoolTransparencyDetails && selectedSchool && (
        <EditSchoolTransparencyDetailsContainer
          loading={loading}
          setLoading={setLoading}
          open={showEditSchoolTransparencyDetails}
          onSubmit={onEditSchoolSubmit}
          onClose={() => setShowEditSchoolTransparencyDetails(false)}
          school={selectedSchool}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      )}
    </div>
  );
};

export default TransparencySchoolsComponent;
