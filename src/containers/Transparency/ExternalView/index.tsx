import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
} from '@heroicons/react/24/outline';

import {
  TransparencyDetail,
  TransparencyFolder,
  TransparencyReport,
  TransparencySchool,
  TransparencySubFolder,
} from '@containers/Transparency/index.types';

import axios from '@/api/axiosInstance';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select';
import { Loading } from '@components/base/Loading';
import { Button } from '@components/base/Button';
import ShowReportFiles from '@components/Transparency/External';

import { Agency } from '@store/types';
import { formatGradeRange } from '@utils/gradeFormatting';

const TransparencyExternalViewContainer = () => {
  const params = useParams();
  const agency_id = params.agency_id as string;
  const [agency, setAgency] = useState<Agency | null>(null);
  const [transparencyDetail, setTransparencyDetail] =
    useState<TransparencyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState<TransparencySchool[]>([]);
  // const [years, setYears] = useState<string[]>([]);

  const [selectedSchool, setSelectedSchool] =
    useState<TransparencySchool | null>(null);
  const [selectedReport, setSelectedReport] =
    useState<TransparencyReport | null>(null);
  // const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const fetchAgency = async () => {
      const [
        agencyResponse,
        transparencyDetailResponse,
        schoolsResponse,
        foldersResponse,
      ] = await Promise.all([
        axios.get(`/agencies/${agency_id}/`),
        axios.get(`/transparency/details/${agency_id}/`),
        axios.get(`/transparency/schools/${agency_id}/`),
        axios.get(`/transparency/folders/?agency_id=${agency_id}`),
      ]);

      setAgency(agencyResponse.data);
      setTransparencyDetail(transparencyDetailResponse.data);
      setSchools(schoolsResponse.data);
      setSelectedSchool(schoolsResponse.data[0]);
      // setYears([agencyResponse.data.calendar_year]);
      // setSelectedYear(agencyResponse.data.calendar_year);

      setFolders(
        foldersResponse.data.map((folder: TransparencyFolder) => ({
          ...folder,
          expanded: true,
          subFolders: folder.subFolders.map(
            (subFolder: TransparencySubFolder) => ({
              ...subFolder,
              expanded: true,
              direction: new Map([
                ['name', 'asc'],
                ['due_date', 'asc'],
              ]),
            }),
          ),
        })),
      );
      setLoading(false);
    };

    setLoading(true);
    fetchAgency().then(() => {
      setLoading(false);
    });
  }, []);

  const [folders, setFolders] = useState<TransparencyFolder[]>([]);

  const toggleFolderExpansion = (folderId: string, subFolderId?: string) => {
    setFolders(
      folders.map((f) => {
        if (f.id === folderId) {
          if (subFolderId) {
            // Toggle subfolder expansion
            return {
              ...f,
              subFolders: f.subFolders.map((sf) =>
                sf.id === subFolderId ? { ...sf, expanded: !sf.expanded } : sf,
              ),
            };
          }
          // Toggle main folder expansion
          return { ...f, expanded: !f.expanded };
        }
        return f;
      }),
    );
  };

  const sortReports = (
    folder: TransparencyFolder,
    subFolder: TransparencySubFolder,
    sortBy: string,
  ) => {
    const direction = subFolder.direction.get(sortBy) === 'asc' ? 1 : -1;

    let sortedReports: TransparencyReport[] = [];
    if (sortBy === 'name') {
      sortedReports = subFolder.reports.sort(
        (a, b) => a.name.localeCompare(b.name) * direction,
      );
    } else if (sortBy === 'due_date') {
      sortedReports = subFolder.reports.sort(
        (a, b) =>
          (new Date(a.due_date).getTime() - new Date(b.due_date).getTime()) *
          direction,
      );
    }

    const folderIndex = folders.findIndex((f) => f.id === folder.id);
    const subFolderIndex = folders[folderIndex].subFolders.findIndex(
      (sf) => sf.id === subFolder.id,
    );

    const updatedDirection = direction === 1 ? 'desc' : 'asc';
    const updatedFolders = [...folders];

    const newMap = new Map(subFolder.direction);
    newMap.set(sortBy, updatedDirection);
    updatedFolders[folderIndex].subFolders[subFolderIndex] = {
      ...subFolder,
      reports: sortedReports,
      direction: newMap,
    };

    setFolders(updatedFolders);
  };

  return (
    <div className="flex flex-col h-full relative">
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col min-h-screen w-full relative">
          {/* Header */}
          <div className="flex h-[48px] bg-beige-50 border-b-[1px] border-beige-400 px-6 py-2">
            <div className="flex flex-row items-center mx-auto justify-between w-[calc(80vw)]">
              <div className="flex flex-row gap-2 items-center">
                <img
                  src={transparencyDetail?.logo_url}
                  alt="Agency Logo"
                  className="w-10 h-10 rounded-full"
                />
                <h1 className="text-slate-900">
                  {agency?.title || 'Agency Title'}
                </h1>
              </div>
              <div className="flex flex-row gap-2 items-center">
                {/* School Selector */}
                <div className="flex flex-row gap-2 items-center">
                  <div>
                    <Select
                      value={selectedSchool?.id || ''}
                      onValueChange={(value) => {
                        const school = schools.find((s) => s.id === value);
                        if (school) {
                          setSelectedSchool(school);
                        }
                      }}
                    >
                      <SelectTrigger className="w-auto min-w-[180px] h-9 border-slate-300 bg-white">
                        <SelectValue placeholder="Select School..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {schools.map((school) => (
                            <SelectItem key={school.id} value={school.id}>
                              {school.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Year Selector */}
                {/* <div className="flex flex-row gap-2 items-center">
                  <Select
                    value={selectedYear || ''}
                    onValueChange={(value) => {
                      setSelectedYear(value);
                    }}
                  >
                    <SelectTrigger className="w-auto min-w-[180px] h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Year..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow bg-beige-100 grid grid-cols-3 gap-8 justify-between my-8 mx-auto w-[calc(80vw)] mb-auto">
            {/* Documents */}
            <div className="grid col-span-2 gap-8 w-full">
              <div className="flex flex-col w-full">
                {folders.map((folder, index) => (
                  <div key={folder.id} className="mb-10">
                    <div
                      className={`bg-slate-100 flex flex-row justify-between w-full items-center border border-slate-200 p-4 rounded-t-lg ${(index === folders.length - 1 && folder.subFolders.length === 0) || !folder.expanded ? 'rounded-b-lg' : ''}`}
                    >
                      <div className="flex flex-row gap-2">
                        {folder.expanded ? (
                          <ChevronDownIcon
                            onClick={() => toggleFolderExpansion(folder.id)}
                            className="size-6"
                          />
                        ) : (
                          <ChevronRightIcon
                            onClick={() => toggleFolderExpansion(folder.id)}
                            className="size-6"
                          />
                        )}
                        <h3 className="text-slate-900">{folder.name}</h3>
                        <h3 className="text-slate-900 bg-slate-200 rounded-[6px] min-w-[15px] text-center px-2 mx-2">
                          {folder.subFolders.length}
                        </h3>
                      </div>
                    </div>
                    {folder.expanded &&
                      folder.subFolders.map((subFolder, folderIndex) => (
                        <div key={subFolder.id}>
                          <div
                            className={`bg-slate-100 flex flex-row border border-slate-200 p-4  ${(!subFolder.expanded && folderIndex === folder.subFolders.length - 1) || folder.subFolders.length === 0 ? 'rounded-b-lg' : ''}`}
                          >
                            <div className="flex flex-row px-4 items-center">
                              <div className="flex flex-row gap-2">
                                {subFolder.expanded ? (
                                  <ChevronDownIcon
                                    onClick={() =>
                                      toggleFolderExpansion(
                                        folder.id,
                                        subFolder.id,
                                      )
                                    }
                                    className="size-6"
                                  />
                                ) : (
                                  <ChevronRightIcon
                                    onClick={() =>
                                      toggleFolderExpansion(
                                        folder.id,
                                        subFolder.id,
                                      )
                                    }
                                    className="size-6"
                                  />
                                )}
                                <h5 className="text-slate-900">
                                  {subFolder.name}
                                </h5>
                                <h5 className="text-slate-900 bg-slate-200 min-w-[15px] text-center rounded-[6px] px-2 mx-2">
                                  {subFolder.reports.length}
                                </h5>
                              </div>
                            </div>
                          </div>
                          {subFolder.expanded &&
                            subFolder.reports.length > 0 && (
                              <div className="px-14 bg-white bg-slate-100 flex flex-row gap-2 justify-between border border-slate-200">
                                <div className="flex flex-row gap-2 items-center">
                                  <h6 className="text-slate-700">
                                    Report Name
                                  </h6>
                                  <Button
                                    onClick={() => {
                                      sortReports(folder, subFolder, 'name');
                                    }}
                                    className="bg-white text-slate-1000 hover:bg-slate-200 h-[40px] m-1 shadow-none justify-center items-center"
                                  >
                                    {subFolder.direction.get('name') ===
                                    'asc' ? (
                                      <BarsArrowDownIcon className="size-6 text-orange-500" />
                                    ) : (
                                      <BarsArrowUpIcon className="size-6 text-orange-500" />
                                    )}
                                  </Button>
                                </div>
                                {/* <div className="flex flex-row gap-2 items-center">
                                  <h5 className="text-slate-900">Due Date</h5>
                                  <Button
                                    onClick={() => {
                                      sortReports(
                                        folder,
                                        subFolder,
                                        'due_date',
                                      );
                                    }}
                                    className="bg-white text-slate-1000 hover:bg-slate-200 h-[40px] shadow-none justify-center items-center"
                                  >
                                    <ArrowsUpDownIcon className="size-6 text-slate-300" />
                                  </Button>
                                </div> */}
                                <div className="flex flex-row gap-2">
                                  <span> </span>
                                </div>
                              </div>
                            )}
                          {subFolder.expanded &&
                            subFolder.reports.map((report, reportIndex) => (
                              <div
                                key={report.id}
                                className={`pl-14 pr-6 flex flex-row w-full bg-white justify-between border border-slate-200 ${folderIndex === folder.subFolders.length - 1 && reportIndex === subFolder.reports.length - 1 ? 'rounded-b-lg' : ''} p-2`}
                              >
                                <div className="flex flex-row gap-2 w-full justify-between">
                                  <h5 className="text-slate-900">
                                    {report.name}
                                  </h5>
                                  {/* <h5 className="text-slate-900">
                                    {report.due_date}
                                  </h5> */}
                                  <ArrowTopRightOnSquareIcon
                                    className="size-6"
                                    onClick={() => {
                                      setSelectedReport(report);
                                      setShowReport(true);
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
            {/* School Info */}
            <div className="bg-white flex justify-left flex-col h-fit mb-10">
              <div className="flex flex-row items-center border-b-[1px] border-beige-400 w-full">
                <div className="flex flex-col gap-6 p-6">
                  <img
                    src={selectedSchool?.logo || transparencyDetail?.logo_url}
                    alt="School Logo"
                    className="max-w-[100px] max-h-[100px] rounded-full"
                  />
                </div>
                <div className="flex flex-col gap-1 p-6">
                  <h3 className="font-semibold text-slate-900">
                    {selectedSchool?.name}
                  </h3>
                  <p className="text-slate-500">{selectedSchool?.address}</p>
                </div>
              </div>
              <div className="flex flex-col gap-8 p-6">
                <div className="flex flex-col">
                  <h4 className="font-semibold text-slate-700">Opened In</h4>
                  <p className="text-slate-500">
                    {/* Format the date to be in the format of Month Day, Year */}
                    {selectedSchool?.founded_at
                      ? selectedSchool?.founded_at.split('-')[0]
                      : ''}
                  </p>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-semibold text-slate-700">
                    Current Contract Expires
                  </h4>
                  <p className="text-slate-500">
                    {selectedSchool?.contract_expires
                      ? new Date(
                          selectedSchool.contract_expires,
                        ).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : ''}
                  </p>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-semibold text-slate-700">
                    Grades Served
                  </h4>
                  <p className="text-slate-500">
                    {formatGradeRange(selectedSchool?.gradeserved || [])}
                  </p>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-semibold text-slate-700">
                    School Contact Information
                  </h4>
                  <p className="text-slate-500">
                    {selectedSchool?.contact_phone_number}
                  </p>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-semibold text-slate-700">
                    School Website
                  </h4>
                  <a
                    href={selectedSchool?.website_url}
                    className="text-slate-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedSchool?.website_url}
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="mt-auto bg-white flex flex-row justify-between w-full border-t-[1px] border-beige-400 mx-auto py-4">
            <div className="flex flex-row gap-2 w-[calc(80vw)] justify-between mx-auto py-4">
              <div className="flex flex-col gap-2">
                <h3 className="py-4">Contact Details</h3>
                <div className="flex flex-row gap-2">
                  <p>Email:</p>
                  <a
                    href={`mailto:${transparencyDetail?.contact_email}`}
                    className="text-slate-500"
                  >
                    {transparencyDetail?.contact_email}
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-2 ">
                <h3 className="py-4">Quick Links</h3>
                <div className="flex flex-col gap-3">
                  {transparencyDetail?.help_faqs_url && (
                    <div className="flex flex-row gap-2">
                      Help FAQs:
                      <a
                        href={transparencyDetail?.help_faqs_url}
                        aria-label="Help FAQs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-700"
                      >
                        <span className="text-slate-500">
                          {transparencyDetail?.help_faqs_url}
                        </span>
                      </a>
                    </div>
                  )}
                  {transparencyDetail?.contact_form_url && (
                    <div className="flex flex-row gap-2">
                      Contact Form:
                      <a
                        href={transparencyDetail?.contact_form_url}
                        aria-label="Contact Form"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-700"
                      >
                        <span className="text-slate-500">
                          {transparencyDetail?.contact_form_url}
                        </span>
                      </a>
                    </div>
                  )}
                  {transparencyDetail?.privacy_policy_url && (
                    <div className="flex flex-row gap-2">
                      Privacy Policy:
                      <a
                        href={transparencyDetail?.privacy_policy_url}
                        aria-label="Privacy Policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-700"
                      >
                        <span className="text-slate-500">
                          {transparencyDetail?.privacy_policy_url}
                        </span>
                      </a>
                    </div>
                  )}
                  {transparencyDetail?.website_homepage_url && (
                    <div className="flex flex-row gap-2">
                      Website Homepage:
                      <a
                        href={transparencyDetail?.website_homepage_url}
                        aria-label="Website Homepage"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-700"
                      >
                        <span className="text-slate-500">
                          {transparencyDetail?.website_homepage_url}
                        </span>
                      </a>
                    </div>
                  )}
                  {transparencyDetail?.custom_domain_url && (
                    <div className="flex flex-row gap-2">
                      Custom Domain:
                      <a
                        href={transparencyDetail?.custom_domain_url}
                        aria-label="Custom Domain"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-700"
                      >
                        <span className="text-slate-500">
                          {transparencyDetail?.custom_domain_url}
                        </span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="py-4">System Info</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2">
                    <p>Last Updated: </p>
                    <p>{transparencyDetail?.updated_at}</p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <p>Powered By</p>
                    <a
                      href="https://www.reportwell.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      ReportWell
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showReport && selectedSchool && selectedReport && (
            <ShowReportFiles
              open={showReport}
              onClose={() => setShowReport(false)}
              report={selectedReport}
              school={selectedSchool}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TransparencyExternalViewContainer;
