import { Bell } from 'lucide-react';
import { formatDate } from '../utils/formatters.js';

export function Topbar({ pageLabel }) {
  return (
    <header className="topbar">
      <div className="crumb">Workspace <span aria-hidden="true">/</span> <strong>{pageLabel}</strong></div>
      <div className="top-actions"><div className="date-chip">{formatDate()}</div><button className="icon-button" aria-label="Notifikasi"><Bell /></button></div>
    </header>
  );
}
