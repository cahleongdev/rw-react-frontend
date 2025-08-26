import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  EntitySideDrawerTabIds,
  EntityType,
} from '@containers/EntitySideDrawer/index.types';

interface DrawerNavigation {
  entityId: string;
  entityType: EntityType;
  tabId: EntitySideDrawerTabIds;
  // parentEntityId?: string;
  // parentEntityType?: EntityType;
  // options?: { returnToTabForOpener?: string };
}

interface DrawerNavigationContextType {
  navigationStack: DrawerNavigation[];
  // currentView: DrawerNavigation | null;
  pushView: (
    entityId: string,
    entityType: EntityType,
    tabId: EntitySideDrawerTabIds,
  ) => void;
  popView: () => void;
  clearStack: () => void;
  tabChange: (tabId: EntitySideDrawerTabIds) => void;
  // tabOverrideForParent: { entityId: string; tabId: string } | null;
  // clearTabOverride: () => void;
}

const DrawerNavigationContext =
  createContext<DrawerNavigationContextType | null>(null);

export const DrawerNavigationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [navigationStack, setNavigationStack] = useState<DrawerNavigation[]>(
    [],
  );
  // const [tabOverrideForParent, setTabOverrideForParent] = useState<{
  //   entityId: string;
  //   tabId: string;
  // } | null>(null);

  const pushView = useCallback(
    (
      entityId: string,
      entityType: EntityType,
      tabId: EntitySideDrawerTabIds,
      // parentEntityId?: string,
      // parentEntityType?: EntityType,
      // options?: { returnToTabForOpener?: string },
    ) => {
      setNavigationStack((prev) => [...prev, { entityId, entityType, tabId }]);
    },
    [],
  );

  const popView = useCallback(() => {
    setNavigationStack((prev) => prev.slice(0, -1));
  }, []);

  // const popView = useCallback(() => {
  //   setNavigationStack((prev) => {
  //     const currentPopped = prev[prev.length - 1];
  //     if (
  //       currentPopped &&
  //       currentPopped.parentEntityId &&
  //       currentPopped.options?.returnToTabForOpener
  //     ) {
  //       const override = {
  //         entityId: currentPopped.parentEntityId,
  //         tabId: currentPopped.options.returnToTabForOpener,
  //       };
  //       console.log(
  //         '[DrawerNavigationContext] popView setting tabOverrideForParent:',
  //         override,
  //       );
  //       setTabOverrideForParent(override);
  //     }
  //     return prev.slice(0, -1);
  //   });
  // }, []);

  const clearStack = useCallback(() => {
    setNavigationStack([]);
    // setTabOverrideForParent(null);
  }, []);

  const tabChange = (tabId: EntitySideDrawerTabIds) => {
    setNavigationStack((prev) => [
      ...prev.slice(0, -1),
      {
        entityId: prev[prev.length - 1].entityId,
        entityType: prev[prev.length - 1].entityType,
        tabId,
      },
    ]);
  };

  // const clearTabOverride = useCallback(() => {
  //   setTabOverrideForParent(null);
  // }, []);

  // const currentView = navigationStack[navigationStack.length - 1] || null;

  return (
    <DrawerNavigationContext.Provider
      value={{
        navigationStack,
        // currentView,
        pushView,
        popView,
        clearStack,
        tabChange,
        // tabOverrideForParent,
        // clearTabOverride,
      }}
    >
      {children}
    </DrawerNavigationContext.Provider>
  );
};

export const useDrawerNavigation = () => {
  const context = useContext(DrawerNavigationContext);
  if (!context) {
    throw new Error(
      'useDrawerNavigation must be used within a DrawerNavigationProvider',
    );
  }
  return context;
};
