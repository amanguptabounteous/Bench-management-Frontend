// components/Layout.jsx
import React from 'react';
import GlobalNavbar from './GlobalNav';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <>
      <GlobalNavbar />
      <Outlet /> {/* Where nested child routes will render */}
    </>
  );
}

export default Layout;
