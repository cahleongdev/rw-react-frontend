import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

import { Drawer } from '@/components/base/Drawer';
import { Tabs, TabsContainer, TabsContent } from '@/components/base/Tabs';
import { ScrollArea } from '@/components/base/ScrollArea';
import { EntityInfoHeader } from '@/components/EntitySideDrawer/EntityInfoHeader';
import { DataLoading } from '@/components/base/Loading';
import { AddField } from '@containers/EntitySideDrawer/AddField';
import { ManageCustomFields } from '@containers/EntitySideDrawer/ManageCustomFields';

import EditUserDialog from './EditUser';
import DetailsTab from './Tabs/DetailsTab';
import AssignedReportsTab from './Tabs/AssignedReportsTab';
import DocumentsTab from './Tabs/DocumentsTab';
import BoardCenterTab from './Tabs/BoardCenterTab';
import BoardMemberDetailTab from './Tabs/BoardMemberDetailTab';

import { AssignReports } from './AssignReports';
import { EditSchool } from './EditSchool';

import { useDrawerNavigation } from '@/contexts/DrawerNavigationContext';

import { CustomFieldEntityType } from '@/store/slices/customFieldDefinitionsSlice';
import { RootState } from '@/store';
import {
  EntitySideDrawerTabIds,
  EntitySideDrawerTabs,
  EntityType,
} from './index.types';

const EntitySideDrawer = () => {
  const { navigationStack, clearStack, tabChange, popView, pushView } =
    useDrawerNavigation();

  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isAssignReportsDialogOpen, setIsAssignReportsDialogOpen] =
    useState(false);
  const [isManageCustomFieldsOpen, setIsManageCustomFieldsOpen] =
    useState(false);
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [isEditSchoolOpen, setIsEditSchoolOpen] = useState(false);

  // Get the entityId and entityType from the navigation stack
  const entityId = navigationStack.length
    ? navigationStack[navigationStack.length - 1].entityId
    : '';
  const entityType = navigationStack.length
    ? navigationStack[navigationStack.length - 1].entityType
    : '';
  const currentTab = navigationStack.length
    ? navigationStack[navigationStack.length - 1].tabId
    : '';

  // Get the entity from the state
  const entity = useSelector((state: RootState) => {
    if (!entityId || !entityType) {
      return null;
    }

    if (entityType === EntityType.AgencyUser) {
      return state.agency.users.find((u) => u.id === entityId);
    } else if (entityType === EntityType.SchoolUser) {
      return state.schoolUsers.schoolUsers.find((u) => u.id === entityId);
    } else if (entityType === EntityType.School) {
      return state.schools.schools.find((s) => s.id === entityId);
    } else if (entityType === EntityType.Network) {
      return state.schools.schools.find((s) => s.id === entityId);
    } else if (entityType === EntityType.BoardMember) {
      return state.schoolUsers.allBoardMembers.find((u) => u.id === entityId);
    }
  });

  const getCustomFieldEntityType = (entityType: EntityType) => {
    if (entityType === EntityType.AgencyUser) {
      return CustomFieldEntityType.AgencyUser;
    } else if (entityType === EntityType.SchoolUser) {
      return CustomFieldEntityType.SchoolUser;
    } else if (entityType === EntityType.School) {
      return CustomFieldEntityType.SchoolEntity;
    } else if (entityType === EntityType.Network) {
      return CustomFieldEntityType.NetworkEntity;
    } else if (entityType === EntityType.BoardMember) {
      return CustomFieldEntityType.BoardMember;
    }
    return CustomFieldEntityType.SchoolUser;
  };

  // Handle the close event
  const handleClose = () => {
    if (
      isEditUserDialogOpen ||
      isManageCustomFieldsOpen ||
      isAddFieldOpen ||
      isAssignReportsDialogOpen ||
      isEditSchoolOpen
    ) {
      return;
    }
    clearStack();
    clearStates();
  };

  // reset States
  const clearStates = () => {
    setIsEditUserDialogOpen(false);
    setIsManageCustomFieldsOpen(false);
    setIsAddFieldOpen(false);
    setIsAssignReportsDialogOpen(false);
    setIsEditSchoolOpen(false);
  };

  // Handle the edit Entity
  const handleEditEntity = () => {
    if (entityType === EntityType.School || entityType === EntityType.Network) {
      setIsEditSchoolOpen(true);
    } else {
      setIsEditUserDialogOpen(true);
    }
  };

  if (!entityId || !entityType) {
    return null;
  }

  if (!entity) return <DataLoading />;

  return (
    <div className="fixed top-0 right-0 bottom-0 w-[600px] z-[50] bg-white overflow-auto shadow-[-2px_0_5px_rgba(0,0,0,0.1)]">
      {/* Entity Info Drawer */}
      <Drawer
        open={!!entityId && !!entityType}
        onClose={handleClose}
        width="600px"
        side="right"
        hideCloseButton
      >
        <div className="flex flex-col h-full overflow-hidden">
          <TabsContainer
            defaultTab={currentTab}
            className="flex flex-col h-full pt-2"
            onTabChange={(tabId) => tabChange(tabId as EntitySideDrawerTabIds)}
          >
            {/* Back button */}
            {navigationStack.length > 1 && (
              <button
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-4 py-2 mb-1 w-fit cursor-pointer"
                onClick={popView}
                type="button"
              >
                <ChevronLeftIcon className="w-5 h-5" />
                <span className="body1-medium">Back</span>
                <span className="body1-medium">
                  {navigationStack[navigationStack.length - 2].entityType}
                </span>
              </button>
            )}
            <div className="flex flex-col p-[0_16px_0_16px] gap-2 pb-2">
              <EntityInfoHeader
                entity={entity}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                entityType={entityType}
                onEditEntity={handleEditEntity}
                onManageCustomFields={() => setIsManageCustomFieldsOpen(true)}
              />
            </div>
            {entityType === EntityType.BoardMember ? (
              <BoardMemberDetailTab
                entityId={entityId}
                onAddFieldClick={setIsAddFieldOpen}
              />
            ) : (
              <>
                <Tabs
                  tabs={EntitySideDrawerTabs.filter(
                    (tab) => tab.viewBy?.includes(entityType) ?? true,
                  )}
                  activeTab={currentTab}
                  onTabChange={(tabId) =>
                    tabChange(tabId as EntitySideDrawerTabIds)
                  }
                  className="border-b border-slate-300 px-4"
                  tabClassName="body1-medium"
                  activeTabClassName="border-b-4 border-orange-500 text-orange-500"
                />
                <TabsContent
                  tabId={EntitySideDrawerTabIds.Details}
                  activeTab={currentTab}
                  className="flex-1 overflow-hidden flex flex-col px-6"
                >
                  <ScrollArea className="h-full pr-3">
                    <DetailsTab
                      entityId={entityId}
                      onAddFieldClick={setIsAddFieldOpen}
                      entityType={entityType}
                      pushView={pushView}
                    />
                  </ScrollArea>
                </TabsContent>
                <TabsContent
                  tabId={EntitySideDrawerTabIds.AssignedReports}
                  activeTab={currentTab}
                  className="flex-1 overflow-hidden flex flex-col px-6"
                >
                  <ScrollArea className="h-full pr-3">
                    <AssignedReportsTab
                      entityId={entityId}
                      entityType={entityType}
                      onAssignReportsClick={() =>
                        setIsAssignReportsDialogOpen(true)
                      }
                    />
                  </ScrollArea>
                </TabsContent>
                <TabsContent
                  tabId={EntitySideDrawerTabIds.Documents}
                  activeTab={currentTab}
                  className="flex-1 overflow-hidden flex flex-col"
                >
                  <DocumentsTab entityId={entityId} entityType={entityType} />
                </TabsContent>
                <TabsContent
                  tabId={EntitySideDrawerTabIds.BoardCenter}
                  activeTab={currentTab}
                  className="flex-1 overflow-hidden flex flex-col px-6"
                >
                  <ScrollArea className="h-full pr-3">
                    {(entityType === EntityType.School ||
                      entityType === EntityType.Network) && (
                      <BoardCenterTab entityId={entityId} pushView={pushView} />
                    )}
                  </ScrollArea>
                </TabsContent>
              </>
            )}
          </TabsContainer>
        </div>
      </Drawer>

      {/* Dialogs */}
      <AddField
        open={isAddFieldOpen}
        onClose={() => setIsAddFieldOpen(false)}
        entityType={getCustomFieldEntityType(entityType)}
      />
      <EditUserDialog
        open={isEditUserDialogOpen}
        onClose={() => setIsEditUserDialogOpen(false)}
        userId={entityId || ''}
      />
      <EditSchool
        open={isEditSchoolOpen}
        schoolId={entityId}
        onClose={() => setIsEditSchoolOpen(false)}
      />
      <ManageCustomFields
        open={isManageCustomFieldsOpen}
        onClose={() => setIsManageCustomFieldsOpen(false)}
        entityType={getCustomFieldEntityType(entityType)}
      />
      <AssignReports
        open={isAssignReportsDialogOpen}
        onClose={() => setIsAssignReportsDialogOpen(false)}
        entityId={entityId}
      />
    </div>
  );
};

export default EntitySideDrawer;
