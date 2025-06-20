import Sidebar from './Sidebar';


export default function Layout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
