import { House, History, Package, CalendarDays, Settings2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { navItems } from '../features/navigation/navigationItems.js';

const navIcons = { home: House, box: Package, history: History, calendar: CalendarDays, settings: Settings2 };
const navPaths = { dashboard: '/', inventory: '/inventory', mutations: '/mutations', calendar: '/calendar', masterData: '/master-data' };

export function Navigation({ className, role, label = 'Navigasi utama' }) {
  return (
    <nav className={className} aria-label={label}>
      {navItems.filter(([page]) => page !== 'masterData' || role === 'supervisor').map(([page, title, iconName]) => {
        const Icon = navIcons[iconName];
        return (
          <NavLink key={page} to={navPaths[page]} end={page === 'dashboard'} className={({ isActive }) => isActive ? 'active' : ''}>
            <Icon aria-hidden="true" />
            <span>{title}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
