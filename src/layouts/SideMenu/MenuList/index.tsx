import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/store';
import { MenuItem } from '@/store/slices/menuSlice';

import CustomMenuItem from './CustomMenuItem';

interface MenuListProps {
  items: MenuItem[];
  selectedItem: string | undefined;
}

const MenuList: React.FC<MenuListProps> = ({
  items,
  selectedItem,
}) => {
  const isCollapsed = useSelector(
    (state: RootState) => state.sideMenu.isCollapsed,
  );

  return (
    <div className="flex flex-col gap-4 px-4">
      {items.map((item) => {
        // Create element from icon component
        const IconComponent = item.icon;
        const IconSelectedComponent = item.iconSelected;

        return (
          <CustomMenuItem
            key={item.label}
            label={!isCollapsed ? item.label : ''}
            icon={<IconComponent style={{ width: '20px' }} />}
            iconSelected={<IconSelectedComponent style={{ width: '20px' }} />}
            link={item.link}
            selected={item.label === selectedItem}
          />
        );
      })}
    </div>
  );
};

export default MenuList;
