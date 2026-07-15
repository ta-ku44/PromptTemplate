import Sidebar from './Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-screen w-screen grid-cols-[330px_1fr]">
      <Sidebar />
      <main className="overflow-y-auto overscroll-contain bg-background p-4">{children}</main>
    </div>
  );
}
