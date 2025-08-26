import {
  FolderPlusIcon,
  PencilIcon,
  DocumentPlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import {
  PencilIcon as PencilIconSolid,
  FolderPlusIcon as FolderPlusIconSolid,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
  // ArrowUpIcon,
  // ArrowDownIcon,
} from '@heroicons/react/24/solid';

import { Button } from '@components/base/Button';
import { Loading } from '@components/base/Loading';
import AddReports from '@components/Transparency/Documents/AddReports';
import AddFolder from '@components/Transparency/Documents/AddFolder';
import AddSubFolder from '@components/Transparency/Documents/AddSubFolder';
import EditFolder from '@components/Transparency/Documents/EditFolder';
import EditSubFolder from '@components/Transparency/Documents/EditSubFolder';

import {
  TransparencyFolder,
  TransparencySubFolder,
  TransparencyReport,
} from '@containers/Transparency/index.types';

type TransparencyDocumentsComponentProps = {
  folders: TransparencyFolder[];
  setFolders: (folders: TransparencyFolder[]) => void;
  reports: TransparencyReport[];
  loading: boolean;
  deleteFolder: (folderId: string) => void;
  deleteSubFolder: (subFolderId: string) => void;
  showAddFolder: boolean;
  setShowAddFolder: (showAddFolder: boolean) => void;
  showEditFolder: boolean;
  setShowEditFolder: (showEditFolder: boolean) => void;
  showAddSubFolder: boolean;
  setShowAddSubFolder: (showAddSubFolder: boolean) => void;
  showEditSubFolder: boolean;
  setShowEditSubFolder: (showEditSubFolder: boolean) => void;
  showAddReport: boolean;
  setShowAddReport: (showAddReport: boolean) => void;
  selectedFolder: TransparencyFolder | null;
  setSelectedFolder: (selectedFolder: TransparencyFolder | null) => void;
  selectedSubFolder: TransparencySubFolder | null;
  setSelectedSubFolder: (
    selectedSubFolder: TransparencySubFolder | null,
  ) => void;
  editValue: string;
  setEditValue: (editValue: string) => void;
  onFolderSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onFolderEditSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSubFolderEditSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSubFolderSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onReportSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleAssign: (report: TransparencyReport) => void;
  handleUnassign: (report: TransparencyReport) => void;
  handleSelectAll: () => void;
  assignedReports: TransparencyReport[];
  setAssignedReports: (assignedReports: TransparencyReport[]) => void;
  unassignedReports: TransparencyReport[];
  setUnassignedReports: (unassignedReports: TransparencyReport[]) => void;
  searchText: string;
  setSearchText: (searchText: string) => void;
};

const TransparencyDocumentsComponent = ({
  folders,
  setFolders,
  reports,
  loading,
  deleteFolder,
  deleteSubFolder,
  showAddFolder,
  setShowAddFolder,
  showEditFolder,
  setShowEditFolder,
  showAddSubFolder,
  setShowAddSubFolder,
  showEditSubFolder,
  setShowEditSubFolder,
  showAddReport,
  setShowAddReport,
  selectedFolder,
  setSelectedFolder,
  selectedSubFolder,
  setSelectedSubFolder,
  editValue,
  setEditValue,
  onFolderSubmit,
  onFolderEditSubmit,
  onSubFolderEditSubmit,
  onSubFolderSubmit,
  onReportSubmit,
  assignedReports,
  setAssignedReports,
  unassignedReports,
  setUnassignedReports,
  searchText,
  setSearchText,
  handleAssign,
  handleUnassign,
  handleSelectAll,
}: TransparencyDocumentsComponentProps) => {
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
        <div className="min-h-[calc(100vh-48px)] flex flex-col items-center bg-beige-100">
          {folders.length === 0 ? (
            <div className="gap-4 flex flex-col items-center justify-center h-full">
              <img
                src="/assets/images/svg/transparency-no-documents.svg"
                alt="No Documents"
                className="w-[100.5px] h-[100.5px]"
              />
              <h2 className="text-slate-700">No documents to Display</h2>
              <div className="flex flex-col gap-2">
                <p className="text-slate-500">
                  Add a folder to begin uploading documents
                </p>
              </div>
              <Button
                onClick={() => setShowAddFolder(true)}
                className="bg-blue-500 text-white hover:bg-blue-600 rounded-[6px] h-[40px] p-6 m-2 flex flex-row justify-center items-center"
              >
                <FolderPlusIcon className="size-6 ml-2" />
                <span className="body2-semibold p-3">Add Folder</span>
              </Button>
            </div>
          ) : (
            <div className=" bg-beige-100 p-6 gap-6 grow min-w-[calc(60vw)]">
              <div className="flex flex-col">
                <div className="flex flex-row justify-between items-center py-6">
                  <h3>Folders</h3>
                  <Button
                    onClick={() => setShowAddFolder(true)}
                    className="bg-blue-500 text-white hover:bg-blue-600 rounded-[6px] h-[40px] p-6 flex flex-row justify-center items-center"
                  >
                    <FolderPlusIcon className="size-6 ml-2" />
                    <span className="body2-semibold p-3">Add Folder</span>
                  </Button>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-col w-full">
                    {folders.map((folder) => (
                      <div key={folder.id} className="mb-10">
                        <div
                          className={`bg-slate-100 flex flex-row justify-between w-full items-center border border-slate-200 px-4 py-2 rounded-t-lg ${!folder.expanded || folder.subFolders.length === 0 ? 'rounded-b-lg' : ''}`}
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
                            <h3 className="text-slate-900 bg-slate-200 rounded-[6px] w-[28px] text-center mx-2">
                              {folder.subFolders.length}
                            </h3>
                          </div>
                          <div className="flex flex-row items-center">
                            <Button
                              onClick={() => {
                                setSelectedFolder(folder);
                                setEditValue(folder.name);
                                setShowEditFolder(true);
                              }}
                              className="bg-white text-slate-700 hover:bg-slate-200 h-[40px] border border-slate-800 shadow-none justify-center items-center"
                            >
                              <PencilIconSolid className="size-6" />
                            </Button>
                            <Button
                              onClick={() => {
                                setSelectedFolder(folder);
                                setShowAddSubFolder(true);
                              }}
                              className="bg-white text-slate-700 hover:bg-slate-100 rounded-[6px] h-[40px] m-2 flex flex-row justify-center items-center border border-slate-800"
                            >
                              <FolderPlusIconSolid className="size-6 ml-2" />
                              <span className="body2-semibold p-3">
                                Add Sub-Folder
                              </span>
                            </Button>
                          </div>
                        </div>
                        {folder.expanded &&
                          folder.subFolders.map((subFolder, subFolderIndex) => (
                            <div key={subFolder.id}>
                              <div
                                className={`bg-slate-100 flex flex-row justify-between w-full border border-slate-200 py-2 px-4 ${!subFolder.expanded && subFolderIndex === folder.subFolders.length - 1 ? 'rounded-b-lg' : ''}`}
                              >
                                <div className="flex flex-row justify-between w-full items-center pl-4">
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
                                    <h5 className="text-slate-900 bg-slate-200 min-w-[24px] text-center rounded-[6px] px-2 mx-2">
                                      {subFolder.reports.length}
                                    </h5>
                                  </div>
                                  <div className="flex flex-row gap-2">
                                    <Button
                                      onClick={() => {
                                        setSelectedFolder(folder);
                                        setSelectedSubFolder(subFolder);
                                        setEditValue(subFolder.name);
                                        setShowEditSubFolder(true);
                                      }}
                                      className={'bg-slate-100 text-slate-1000 hover:bg-slate-200 h-[40px] shadow-none justify-center items-center'}
                                    >
                                      <PencilIcon className="size-6" />
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setSelectedFolder(folder);
                                        setSelectedSubFolder(subFolder);
                                        setUnassignedReports(
                                          reports.filter(
                                            (report) =>
                                              !subFolder.reports.some(
                                                (r) => r.id === report.id,
                                              ),
                                          ),
                                        );
                                        setAssignedReports(subFolder.reports);
                                        setShowAddReport(true);
                                      }}
                                      className={'bg-slate-100 text-slate-1000 hover:bg-slate-200 h-[40px] shadow-none justify-center items-center'}
                                    >
                                      <DocumentPlusIcon className="size-6" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              {subFolder.expanded &&
                                subFolder.reports.length > 0 && (
                                  <div className="px-16 bg-white bg-slate-100 flex flex-row gap-2 justify-between border border-slate-200">
                                    <div className="flex flex-row gap-1 items-center">
                                      <h6 className="text-slate-700">
                                        Report Name
                                      </h6>
                                      <Button
                                        onClick={() => {
                                          sortReports(
                                            folder,
                                            subFolder,
                                            'name',
                                          );
                                        }}
                                        className="bg-white text-slate-1000 hover:bg-slate-100 h-[40px] m-1 shadow-none justify-center items-center"
                                      >
                                        {subFolder.direction.get('name') ===
                                        'asc' ? (
                                          <BarsArrowUpIcon className="size-6 text-orange-500" />
                                        ) : (
                                          <BarsArrowDownIcon className="size-6 text-orange-500" />
                                        )}
                                      </Button>
                                    </div>
                                    {/* TODO: When Report Years is added back */}
                                    {/* <div className="flex flex-row gap-2 items-center">
                                      <h5 className="text-slate-900">
                                        Due Date
                                      </h5>
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
                                        {subFolder.direction.get('due_date') ===
                                          'asc' ? (
                                          <ArrowUpIcon className="size-6 text-slate-400" />
                                        ) : (
                                          <ArrowDownIcon className="size-6 text-slate-400" />
                                        )}
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
                                    className={`pl-16 pr-6 flex flex-row w-full bg-white justify-between border border-slate-200 ${subFolderIndex === folder.subFolders.length - 1 && reportIndex === subFolder.reports.length - 1 ? 'rounded-b-lg' : ''} px-4 py-2`}
                                  >
                                    <div className="flex flex-row gap-2 w-full justify-between">
                                      <h5 className="text-slate-900">
                                        {report.name}
                                      </h5>
                                      {/* TODO: When Report Years is added back */}
                                      {/* <h5 className="text-slate-900">
                                        {report.due_date}
                                      </h5> */}
                                      <span> </span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {showAddFolder && (
        <AddFolder
          open={showAddFolder}
          onSubmit={onFolderSubmit}
          onClose={() => setShowAddFolder(false)}
          setEditValue={setEditValue}
        />
      )}
      {showAddSubFolder && (
        <AddSubFolder
          open={showAddSubFolder}
          onSubmit={onSubFolderSubmit}
          onClose={() => setShowAddSubFolder(false)}
          setEditValue={setEditValue}
        />
      )}
      {showEditFolder && selectedFolder && (
        <EditFolder
          open={showEditFolder}
          onSubmit={onFolderEditSubmit}
          onClose={() => setShowEditFolder(false)}
          setEditValue={setEditValue}
          folder={selectedFolder}
          editValue={editValue}
          deleteFolder={deleteFolder}
        />
      )}
      {showEditSubFolder && selectedSubFolder && (
        <EditSubFolder
          open={showEditSubFolder}
          onSubmit={onSubFolderEditSubmit}
          onClose={() => setShowEditSubFolder(false)}
          setEditValue={setEditValue}
          subFolder={selectedSubFolder}
          editValue={editValue}
          deleteSubFolder={deleteSubFolder}
        />
      )}
      {showAddReport && selectedSubFolder && (
        <AddReports
          open={showAddReport}
          onSubmit={onReportSubmit}
          onClose={() => setShowAddReport(false)}
          assignedReports={assignedReports}
          handleAssign={handleAssign}
          handleUnassign={handleUnassign}
          handleSelectAll={handleSelectAll}
          unassignedReports={unassignedReports}
          setUnassignedReports={setUnassignedReports}
          setAssignedReports={setAssignedReports}
          loading={loading}
          setSearchText={setSearchText}
          searchText={searchText}
        />
      )}
    </div>
  );
};

export default TransparencyDocumentsComponent;
