import { useState } from 'react';
import { useLocation } from 'wouter';

export default function Sidebar() {
  const [location, setLocation] = useLocation();
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
    <aside className="grid h-screen w-full grid-rows-[auto_1fr_auto] bg-sidebar-background text-sidebar-foreground">
      <header className="p-4">Prompt Library</header>
      {/* Top : Brand
       * Logo
       * Title
       */}

      <nav className="mb-2 flex flex-col gap-2 px-4">
        <a onClick={() => setLocation('/general')}>一般</a>
        <a onClick={() => setLocation('/platform')}>動作環境</a>
        <a onClick={() => setLocation('/prompts')}>プロンプト</a>
      </nav>
      {/* Middle : Navigation
       * General
       * Platform
       * Prompts
       */}

      <footer className="p-4">Tools</footer>
      {/* Bottom : Utilities
       * Theme Toggle
       * Github Repository Link
       */}
    </aside>
  );
}
