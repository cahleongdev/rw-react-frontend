import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  TransparencyFolder,
  TransparencyReport,
  TransparencySubFolder,
} from '@containers/Transparency/index.types';
import { ReportResponse, Schedule } from '@containers/Reports/index.types';

import axios from '@/api/axiosInstance';

import { RootState } from '@/store';

import TransparencyDocumentsComponent from '@components/Transparency/Documents';

import {
  setReports,
  setLoading as setReportsLoading,
} from '@store/slices/reportsSlice';

const TransparencyDocumentsContainer = () => {
  const dispatch = useDispatch();
  const { user, reports, reportsLoading } = useSelector((state: RootState) => ({
    user: state.auth,
    reports: state.reports.reports,
    reportsLoading: state.reports.loading,
  }));
  const [folders, setFolders] = useState<TransparencyFolder[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] =
    useState<TransparencyFolder | null>(null);
  const [selectedSubFolder, setSelectedSubFolder] =
    useState<TransparencySubFolder | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [showEditFolder, setShowEditFolder] = useState(false);
  const [showAddSubFolder, setShowAddSubFolder] = useState(false);
  const [showEditSubFolder, setShowEditSubFolder] = useState(false);
  const [showAddReport, setShowAddReport] = useState(false);
  const [assignedReports, setAssignedReports] = useState<TransparencyReport[]>(
    [],
  );
  const [unassignedReports, setUnassignedReports] = useState<
    TransparencyReport[]
  >([]);
  const [searchText, setSearchText] = useState<string>('');
  const [transparencyReports, setTransparencyReports] = useState<
    TransparencyReport[]
  >([]);

  const handleSelectAll = () => {
    setAssignedReports([...unassignedReports]);
    setUnassignedReports([]);
  };

  const handleAssign = (report: TransparencyReport) => {
    setAssignedReports([...assignedReports, report]);
    setUnassignedReports(unassignedReports.filter((r) => r.id !== report.id));
  };

  const handleUnassign = (report: TransparencyReport) => {
    setAssignedReports(assignedReports.filter((r) => r.id !== report.id));
    setUnassignedReports([...unassignedReports, report]);
  };

  const loadFolders = async () => {
    if (!user || !user.user) return;

    const response = await axios.get('/transparency/folders/');

    return response.data.map((folder: TransparencyFolder) => {
      return {
        ...folder,
        expanded: true,
        subFolders: folder.subFolders.map(
          (subFolder: TransparencySubFolder) => {
            return {
              ...subFolder,
              expanded: true,
              direction: new Map([
                ['name', 'asc'],
                ['due_date', 'asc'],
              ]),
            };
          },
        ),
      };
    });
  };

  const deleteFolder = async (folderId: string) => {
    if (!user || !user.user) return;
    setDocumentsLoading(true);
    const response = await axios.delete(`/transparency/folders/${folderId}/`);
    if (response.status === 200) {
      setFolders(folders.filter((folder) => folder.id !== folderId));
      setSelectedFolder(null);
      setEditValue('');
      setShowEditFolder(false);
    }
    setDocumentsLoading(false);
  };

  const deleteSubFolder = async (subFolderId: string) => {
    if (!user || !user.user) return;

    setDocumentsLoading(true);
    const response = await axios.delete(
      `/transparency/sub-folders/${subFolderId}/`,
    );
    if (response.status === 200) {
      setFolders(
        folders.map((folder) => {
          if (folder.id === selectedFolder?.id) {
            return {
              ...folder,
              subFolders: folder.subFolders.filter(
                (subFolder) => subFolder.id !== subFolderId,
              ),
            };
          }
          return folder;
        }),
      );

      setSelectedFolder(null);
      setSelectedSubFolder(null);
      setEditValue('');
      setShowEditSubFolder(false);
    }
    setDocumentsLoading(false);
  };

  const onFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddFolder(false);
    setDocumentsLoading(true);

    const prevFolders = [...folders];

    const response = await axios.post('/transparency/folders/', {
      name: editValue,
    });

    if (response.status === 201) {
      prevFolders.push({
        id: response.data.id,
        name: editValue,
        subFolders: [],
        expanded: true,
      });
      setFolders(prevFolders);
      setDocumentsLoading(false);
      setEditValue('');

      return;
    }

    setFolders(prevFolders);
    setDocumentsLoading(false);
    setEditValue('');
  };

  const onFolderEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowEditFolder(false);
    setDocumentsLoading(true);
    const prevFolders = [...folders];
    const folder = prevFolders.find(
      (folder) => folder.id === selectedFolder?.id,
    );
    if (folder) {
      folder.name = editValue;
      const response = await axios.put(`/transparency/folders/${folder.id}/`, {
        name: editValue,
      });

      if (response.status === 200) {
        setFolders(prevFolders);
        setDocumentsLoading(false);
        setSelectedFolder(null);
        setEditValue('');
      }

      return;
    }

    setFolders(prevFolders);
    setShowEditFolder(false);
    setDocumentsLoading(false);
    setSelectedFolder(null);
    setEditValue('');
  };

  const onSubFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddSubFolder(false);
    setDocumentsLoading(true);
    const prevFolders = [...folders];

    const selectedFolderIndex = prevFolders.findIndex(
      (folder) => folder.id === selectedFolder?.id,
    );
    if (selectedFolderIndex !== -1) {
      const response = await axios.post('/transparency/sub-folders/', {
        name: editValue,
        folder_id: selectedFolder?.id,
      });

      if (response.status === 201) {
        prevFolders[selectedFolderIndex].subFolders.push({
          id: response.data.id,
          name: editValue,
          reports: [],
          expanded: true,
          direction: new Map([
            ['name', 'asc'],
            ['due_date', 'asc'],
          ]),
        });

        setFolders(prevFolders);
        setEditValue('');
        setDocumentsLoading(false);
      }

      return;
    }
    setFolders(prevFolders);
    setShowAddSubFolder(false);
    setSelectedFolder(null);
    setSelectedSubFolder(null);
    setEditValue('');
  };

  const onSubFolderEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowEditSubFolder(false);
    setDocumentsLoading(true);
    const prevFolders = [...folders];
    const folder = prevFolders.find(
      (folder) => folder.id === selectedFolder?.id,
    );

    if (folder) {
      const subFolder = folder.subFolders.find(
        (subFolder) => subFolder.id === selectedSubFolder?.id,
      );
      if (subFolder) {
        const response = await axios.put(
          `/transparency/sub-folders/${subFolder.id}/`,
          {
            name: editValue,
          },
        );

        if (response.status === 200) {
          setFolders(prevFolders);
          setDocumentsLoading(false);
          setSelectedFolder(null);
          setSelectedSubFolder(null);
          setEditValue('');

          subFolder.name = editValue;
        }

        return;
      }
    }

    setFolders(prevFolders);
    setShowEditFolder(false);
    setDocumentsLoading(false);
    setSelectedFolder(null);
    setSelectedSubFolder(null);
    setEditValue('');
  };

  const onReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddReport(false);
    setDocumentsLoading(true);
    const prevFolders = [...folders];
    const folder = prevFolders.find(
      (folder) => folder.id === selectedFolder?.id,
    );
    if (folder) {
      const subFolder = folder.subFolders.find(
        (subFolder) => subFolder.id === selectedSubFolder?.id,
      );

      if (subFolder) {
        const response = await axios.post('/transparency/reports/', {
          sub_folder_id: subFolder.id,
          report_ids: assignedReports.map((report) => report.id),
        });

        if (response.status === 200) {
          subFolder.reports = response.data.map(
            (report: TransparencyReport) => ({
              id: report.id,
              name: report.name,
              due_date: report.due_date,
              file_urls: report.file_urls,
            }),
          );
        }
        setDocumentsLoading(false);
      }
    }

    setFolders(prevFolders);
    setShowAddReport(false);
    setDocumentsLoading(false);
    setSelectedFolder(null);
    setSelectedSubFolder(null);
  };

  const fetchReports = async () => {
    dispatch(setReportsLoading(true));
    const response = await axios.get('/reports/');
    dispatch(setReports(response.data.results || response.data || []));
    dispatch(setReportsLoading(false));
    setTransparencyReports(response.data.results || response.data || []);
  };

  useEffect(() => {
    const filteredReports =
      searchText.length > 0
        ? reports.filter((report) =>
            report.name.toLowerCase().includes(searchText.toLowerCase()),
          )
        : reports;

    const newReports = filteredReports.map((report) => {
      const getEarliestDate = (report: ReportResponse) => {
        if (!report.schedules || report.schedules.length === 0) return 0;

        return Math.min(
          ...report.schedules.map((schedule: Schedule) =>
            new Date(schedule.schedule_time).getTime(),
          ),
        );
      };

      const aDate = getEarliestDate(report);

      return {
        id: report.id,
        name: report.name,
        due_date: aDate ? new Date(aDate).toISOString().split('T')[0] : '',
        file_urls: report.file_urls.map((file) => ({
          file_name: file.file_name,
          file_url: file.file_url,
        })),
      };
    });

    setUnassignedReports(newReports);
  }, [searchText, reports, selectedSubFolder]);

  useEffect(() => {
    setDocumentsLoading(true);

    loadFolders()
      .then((folders) => {
        setFolders(folders);
      })
      .finally(() => {
        setDocumentsLoading(false);
      });

    if (reports.length === 0) {
      fetchReports();
    }
  }, []);

  return (
    <TransparencyDocumentsComponent
      folders={folders}
      setFolders={setFolders}
      reports={transparencyReports}
      loading={reportsLoading || documentsLoading}
      deleteFolder={deleteFolder}
      deleteSubFolder={deleteSubFolder}
      showEditFolder={showEditFolder}
      setShowEditFolder={setShowEditFolder}
      showAddSubFolder={showAddSubFolder}
      setShowAddSubFolder={setShowAddSubFolder}
      showAddReport={showAddReport}
      setShowAddReport={setShowAddReport}
      selectedFolder={selectedFolder}
      setSelectedFolder={setSelectedFolder}
      selectedSubFolder={selectedSubFolder}
      setSelectedSubFolder={setSelectedSubFolder}
      editValue={editValue}
      setEditValue={setEditValue}
      onFolderSubmit={onFolderSubmit}
      onFolderEditSubmit={onFolderEditSubmit}
      onSubFolderEditSubmit={onSubFolderEditSubmit}
      onSubFolderSubmit={onSubFolderSubmit}
      onReportSubmit={onReportSubmit}
      showAddFolder={showAddFolder}
      setShowAddFolder={setShowAddFolder}
      showEditSubFolder={showEditSubFolder}
      setShowEditSubFolder={setShowEditSubFolder}
      assignedReports={assignedReports}
      setAssignedReports={setAssignedReports}
      unassignedReports={unassignedReports}
      setUnassignedReports={setUnassignedReports}
      searchText={searchText}
      setSearchText={setSearchText}
      handleAssign={handleAssign}
      handleUnassign={handleUnassign}
      handleSelectAll={handleSelectAll}
    />
  );
};

export default TransparencyDocumentsContainer;
