import { SearchBar } from '@/components/base/SearchBar';
import { SchoolSelectorDropdown } from '@containers/Header/SchoolSelectorDropdown';

import LogoBar from '@/layouts/SideMenu/LogoBar';
import UserMenuBar from '@/layouts/NavBar/UserMenuBar';
import { RootState } from '@store/index';
import { useSelector } from 'react-redux';

// Header Bar
const NavBar = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const isSchoolAdmin = user?.role === 'School_Admin';

  return (
    <div className="flex h-[48px] bg-beige-50 border-b-[1px] border-beige-400 px-6 py-2">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 w-full justify-between">
          <LogoBar />
          {isSchoolAdmin && <SchoolSelectorDropdown />}
          <div className="flex-1 flex justify-center px-4">
            <SearchBar
              placeholder="Search..."
              className="w-full max-w-md h-9"
            />
          </div>

          <UserMenuBar />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
