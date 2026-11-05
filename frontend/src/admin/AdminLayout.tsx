import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  CalendarDays,
  Star,
  Settings,
  LogOut,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Logo } from '../components/ui/Logo';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAdminAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gold-accent)',
          fontFamily: 'var(--font-serif)',
          letterSpacing: '0.05em',
        }}
      >
        Verifying staff credentials...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(1.5rem, 5vw, 3rem)',
        }}
      >
        <div
          className="aa-panel"
          style={{ maxWidth: '420px', width: '100%', textAlign: 'center', padding: '2.5rem' }}
        >
          <ShieldAlert size={48} color="var(--gold-accent)" style={{ margin: '0 auto 1rem' }} />
          <h2 className="font-serif aa-subtitle" style={{ color: 'var(--text-ivory)', marginBottom: '0.5rem' }}>
            Staff Access Required
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            Please authenticate with authorized cafe staff or administrator credentials.
          </p>
          <button onClick={() => navigate('/admin-login')} className="btn-gold" style={{ width: '100%' }}>
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin-login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin-dashboard', icon: <LayoutDashboard size={18} />, end: true },
    { label: 'Menu & Products', path: '/admin-dashboard/menu', icon: <UtensilsCrossed size={18} /> },
    { label: 'Customer Orders', path: '/admin-dashboard/orders', icon: <ShoppingBag size={18} /> },
    { label: 'Reservations', path: '/admin-dashboard/reservations', icon: <CalendarDays size={18} /> },
    { label: 'Review Moderation', path: '/admin-dashboard/reviews', icon: <Star size={18} /> },
    { label: 'Business Settings', path: '/admin-dashboard/settings', icon: <Settings size={18} /> },
  ];

  const sidebarLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.7rem 0.95rem',
    borderRadius: 'var(--radius-sm)',
    color: isActive ? 'var(--gold-hover)' : 'var(--text-muted)',
    backgroundColor: isActive ? 'var(--gold-wash)' : 'transparent',
    border: '1px solid',
    borderColor: isActive ? 'var(--border-subtle)' : 'transparent',
    boxShadow: isActive ? 'inset 3px 0 0 var(--gold-accent)' : 'none',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: isActive ? 600 : 400,
    transition: 'color var(--dur-fast) var(--ease-luxury), background var(--dur-fast) var(--ease-luxury), border-color var(--dur-fast) var(--ease-luxury)',
  });

  const mobileLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    flex: '0 0 auto',
    padding: '0.45rem 0.85rem',
    borderRadius: 'var(--radius-pill)',
    color: isActive ? 'var(--espresso)' : 'var(--text-muted)',
    backgroundColor: isActive ? 'var(--gold-accent)' : 'var(--bg-coffee-tint)',
    border: '1px solid',
    borderColor: isActive ? 'var(--gold-accent)' : 'var(--border-card)',
    textDecoration: 'none',
    fontSize: '0.8rem',
    fontWeight: isActive ? 600 : 400,
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex' }}>
      {/* Sidebar Navigation — sticky desktop column, hidden on mobile */}
      <aside
        className="aa-hide-mobile"
        style={{
          width: '260px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          alignSelf: 'flex-start',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          boxShadow: '1px 0 0 var(--bg-coffee-tint)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem 1rem',
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ padding: '0.5rem 0.75rem 1.75rem', borderBottom: '1px solid var(--border-hairline)' }}>
            <Logo size="sm" />
            <span className="aa-badge aa-badge--coffee" style={{ marginTop: '0.75rem' }}>
              Staff Portal
            </span>
          </div>

          <nav style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.end} style={sidebarLinkStyle}>
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div
          style={{
            borderTop: '1px solid var(--border-hairline)',
            paddingTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ padding: '0 0.5rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
            Logged in as: <strong style={{ color: 'var(--text-ivory)' }}>{user?.username}</strong>
          </div>

          <div className="aa-row">
            <Link
              to="/"
              className="btn-ghost"
              style={{ flex: 1, justifyContent: 'center', padding: '0.55rem' }}
            >
              <ExternalLink size={14} /> Storefront
            </Link>

            <button
              onClick={handleLogout}
              className="aa-icon-btn"
              title="Logout"
              style={{
                color: 'var(--danger)',
                borderColor: 'var(--danger)',
                backgroundColor: 'var(--danger-wash)',
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Right region: mobile nav strip sits above content, then the outlet */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile top navigation — horizontally scrollable, only shown below 900px */}
        <nav
          className="aa-show-mobile"
          style={{
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: '0.85rem',
            padding: '1rem var(--gutter)',
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <Logo size="sm" />
            <button
              onClick={handleLogout}
              className="aa-icon-btn"
              title="Logout"
              style={{
                color: 'var(--danger)',
                borderColor: 'var(--danger)',
                backgroundColor: 'var(--danger-wash)',
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
          <div className="aa-scroll-x" style={{ gap: '0.5rem', paddingBottom: '0.25rem' }}>
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.end} style={mobileLinkStyle}>
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Main Content Area */}
        <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: 'clamp(1.25rem, 3vw, 2.5rem)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
