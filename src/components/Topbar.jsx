import { LogOut } from "lucide-react";
import { formatDate } from "../utils/formatters.js";

export function Topbar({ pageLabel, onLogout }) {
  return (
    <header className="topbar">
      <div className="crumb">Workspace <span aria-hidden="true">/</span> <strong>{pageLabel}</strong></div>
      <div className="top-actions">
        <div className="date-chip">{formatDate()}</div>
        <button className="logout-button" type="button" onClick={onLogout}>
          <LogOut aria-hidden="true" /><span>Keluar</span>
        </button>
      </div>
    </header>
  );
}
