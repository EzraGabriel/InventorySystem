import { Navigation } from './Navigation.jsx';

export function BottomNav({ role }) {
  return <Navigation className={`bottom-nav${role === "supervisor" ? " is-supervisor" : ""}`} role={role} />;
}
