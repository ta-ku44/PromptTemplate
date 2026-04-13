import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import image from '~/assets/icon.png';

export default function Sidebar() {
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    general: false,
  });

  const toggleSubMenu = (menu: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <aside className="grid h-screen w-full grid-rows-[auto_1fr_auto] bg-secondary">
      <div className="p-4"><img src={image} className='size-12'/></div>
      {/* Top : Brand
       * Logo
       * Title
       */}

      <nav className="mb-2 flex flex-col gap-2 px-4">
        <NavLink to="/general">一般</NavLink>
        <NavLink to="/platform">動作環境</NavLink>
        <NavLink to="/prompts">プロンプト</NavLink>
      </nav>
      {/* Middle : Navigation
       * General
       * Platform
       * Prompts
       */}

      <div className="p-4">Tools</div>
      {/* Bottom : Utilities
       * Theme Toggle
       * Github Repository Link
       */}
    </aside>
  );
}
