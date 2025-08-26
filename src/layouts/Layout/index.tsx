import React from 'react';
import { Outlet } from 'react-router-dom';

import SideMenu from '@/layouts/SideMenu';
import NavBar from '@/layouts/NavBar';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <SideMenu />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
