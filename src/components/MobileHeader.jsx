import { Brand } from "./Brand.jsx";

export function MobileHeader({ currentUser }) {
  return (
    <header className="mobile-header">
      <Brand mobile />
      <button className="icon-button" aria-label={`Profil ${currentUser?.name || "pengguna"}`}>
        <span className="avatar avatar-small">
          {currentUser?.name?.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
        </span>
      </button>
    </header>
  );
}
