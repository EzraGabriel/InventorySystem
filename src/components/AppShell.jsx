import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { MobileHeader } from './MobileHeader.jsx';
import { Topbar } from './Topbar.jsx';
import { BottomNav } from './BottomNav.jsx';
import { Toast } from './Toast.jsx';

export function AppShell({ children, modal, toast, currentUser }) {
  const { pathname } = useLocation();
  const isDetail = /^\/inventory\/[^/]+\/?$/.test(pathname);
  const pageLabel = isDetail ? 'Detail barang' : pathname.startsWith('/inventory') ? 'Inventaris' : pathname.startsWith('/mutations') ? 'Mutasi' : pathname.startsWith('/master-data') ? 'Data master' : pathname.startsWith('/calendar') ? 'Kalender' : 'Beranda';
  return (
    <div className="app">
      <Sidebar currentUser={currentUser} />
      <MobileHeader currentUser={currentUser} />
      <div className="workspace">
        <Topbar pageLabel={pageLabel} />
        <main className="main" tabIndex={-1}>{children}</main>
      </div>
      <BottomNav role={currentUser?.role} />
      {modal}
      <div aria-live="polite" aria-atomic="true"><Toast message={toast} /></div>
    </div>
  );
}
