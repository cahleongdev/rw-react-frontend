import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '@/store';
import { MenuItem } from '@/store/slices/menuSlice';

import MenuList from './MenuList';

import { commonMenuItems } from './MenuList/index.constants';

// Define the desired order for the top section
const TOP_SECTION_ORDER = ['Home', 'Inbox', 'Analytics'];

const SideMenu: React.FC = () => {
  const privilegeMenuItems = useSelector(
    (state: RootState) => state.menu.items,
  );
  const { pathname } = useLocation();

  // Combine common items and privilege-based items for selection logic and top section creation
  const allAvailableMenuItems = useMemo(() => {
    // commonMenuItems items are now compatible with MenuItem core properties
    return [...commonMenuItems, ...privilegeMenuItems];
  }, [privilegeMenuItems]);

  const [selectedItem, setSelectedItem] = useState(
    allAvailableMenuItems.find(
      (menuItem) => menuItem.link && pathname.startsWith(menuItem.link),
    )?.label,
  );

  useEffect(() => {
    setSelectedItem(
      allAvailableMenuItems.find(
        (menuItem) => menuItem.link && pathname.startsWith(menuItem.link),
      )?.label,
    );
  }, [allAvailableMenuItems, pathname]);

  // Create the top section items (Home, and conditionally Inbox, Analytics)
  const topSectionItems = useMemo(() => {
    const items: MenuItem[] = [];
    const homeItemFromCommon = commonMenuItems.find(
      (item) => item.label === 'Home',
    );

    if (homeItemFromCommon) {
      // Ensure it fully matches MenuItem structure if there are discrepancies not covered by Pick
      // For now, assuming compatibility for core fields used by MenuList
      items.push(homeItemFromCommon as MenuItem);
    }

    const inboxItem = privilegeMenuItems.find((item) => item.label === 'Inbox');
    if (inboxItem) {
      items.push(inboxItem);
    }

    const analyticsItem = privilegeMenuItems.find(
      (item) => item.label === 'Analytics',
    );
    if (analyticsItem) {
      items.push(analyticsItem);
    }

    // Sort them according to TOP_SECTION_ORDER
    return items.sort(
      (a, b) =>
        TOP_SECTION_ORDER.indexOf(a.label) - TOP_SECTION_ORDER.indexOf(b.label),
    );
  }, [privilegeMenuItems]);

  // Filter out Home, Inbox, Analytics from the main list that goes to MenuList component
  const mainMenuItems = useMemo(() => {
    return privilegeMenuItems.filter(
      (item) => item.label !== 'Inbox' && item.label !== 'Analytics',
    );
  }, [privilegeMenuItems]);

  return (
    <div className="w-[210px] p-0 border-r-[1px] border-beige-400 bg-beige-50">
      <div className="flex flex-col gap-4">
        {/* Logo and toggle button */}
        {/* <LogoBar onToggle={handleToggle} /> */}

        {/* Main menu */}
        <div className="flex flex-col gap-4 pt-2">
          <MenuList items={topSectionItems} selectedItem={selectedItem} />
          <div className="w-full bg-[#F5E8D4] h-[1px]" />
          <MenuList items={mainMenuItems} selectedItem={selectedItem} />
        </div>

        {/* User profile
          <UserProfile
            selectedItem={selectedItem}
            onSelect={handleSelect}
            isTallScreen={isTallScreen}
          /> */}
      </div>
    </div>
  );
};

export default SideMenu;
