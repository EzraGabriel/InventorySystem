import { Brand } from './Brand.jsx';
import { ProfileBadge } from './ProfileBadge.jsx';
import { Navigation } from './Navigation.jsx';

export function Sidebar({ currentUser }) {
  return (
    <aside className="sidebar" aria-label="Navigasi utama">
      <Brand />
      <div className="nav-label">Menu</div>
      <Navigation className="nav" role={currentUser?.role} label="Menu utama" />
      <div className="side-bottom">
        <div className="profile">
          <ProfileBadge name={currentUser?.name} />
          <div><div className="profile-name">{currentUser?.name}</div><div className="profile-role">{currentUser?.role === "supervisor" ? "Supervisor" : "Volunteer"}</div></div>
        </div>
      </div>
    </aside>
  );
}
