import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layouts/Sidebar';
import General from './components/pages/General';
import Platform from './components/pages/Platform';
import Prompts from './components/pages/Prompts';

export default function OptionsApp() {
  return (
    <HashRouter>
      <div className="grid h-screen w-screen grid-cols-[330px_1fr] bg-primary text-white">
        <Sidebar />
        <main className="p-4">
          <Routes>
            <Route path="/general" element={<General />} />
            <Route path="/platform" element={<Platform />} />
            <Route path="/prompts" element={<Prompts />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
