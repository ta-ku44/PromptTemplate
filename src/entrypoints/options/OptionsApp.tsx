import { Router, Route } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import Sidebar from './components/layouts/Sidebar';
import General from './components/pages/General';
import Platform from './components/pages/Platform';
import Prompts from './components/pages/Prompts';

export default function OptionsApp() {
  return (
    <Router hook={useHashLocation}>
      <div className="grid h-screen w-screen grid-cols-[330px_1fr] bg-[rgb(29,29,29)]">
        <Sidebar />
        <main className="p-4">
          <Route path="/general" component={General} />
          <Route path="/platform" component={Platform} />
          <Route path="/prompts" component={Prompts} />
        </main>
      </div>
    </Router>
  );
}
