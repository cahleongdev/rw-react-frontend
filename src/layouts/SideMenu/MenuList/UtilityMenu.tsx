import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/store';

import CustomMenuItem from './CustomMenuItem';

import { commonMenuItems } from './index.constants';

interface UtilityMenuProps {
  selectedItem: string | undefined;
}

const UtilityMenu: React.FC<UtilityMenuProps> = ({ selectedItem }) => {
  const isCollapsed = useSelector(
    (state: RootState) => state.sideMenu.isCollapsed,
  );
  // const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  // const unreadCount = notificationService.getUnreadCount();

  // const handleClose = (event?: React.MouseEvent<HTMLElement>) => {
  //   if (event) {
  //     event.stopPropagation();
  //   }
  //   setAnchorEl(null);
  // };

  return (
    <div className="flex flex-col gap-4 px-4">
      {commonMenuItems.map((item) => (
        // <Badge
        //   key={item.label}
        //   // badgeContent={item.label === 'Notifications' ? unreadCount : 0}
        //   color="error"
        //   sx={{
        //     '& .MuiBadge-badge': {
        //       right: isCollapsed ? 10 : 30,
        //       top: 10,
        //     },
        //   }}
        // >
        <CustomMenuItem
          label={!isCollapsed ? item.label : ''}
          icon={<item.icon />}
          iconSelected={<item.iconSelected />}
          selected={item.label === selectedItem}
          key={item.label}
          link={item.link}
        />
        // </Badge>
      ))}
      {/* <NotificationsPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      /> */}
    </div>
  );
};

export default UtilityMenu;
