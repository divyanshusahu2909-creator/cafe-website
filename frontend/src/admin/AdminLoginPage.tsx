import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Logo } from '../components/ui/Logo';

const IS_DEV = import.meta.env.DEV;
const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'adminpassword123';

export const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState(IS_DEV ? DEMO_USERNAME : '');
  const [password, setPassword] = useState(IS_DEV ? DEMO_PASSWORD : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setError('');

    try {
      await login(username, password);
      navigate('/admin-dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(4.5rem, 10vh, 6rem) clamp(1.25rem, 5vw, 2rem) clamp(2rem, 6vh, 3rem)',
        position: 'relative',
      }}
    >
      <Link
        to="/"
        style={{
          position: 'absolute',
          top: '1.75rem',
          left: 'clamp(1.25rem, 5vw, 2rem)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          fontSize: '0.88rem',
        }}
      >
        <ArrowLeft size={16} /> Back to Storefront
      </Link>

      <div
        className="aa-panel animate-fade-in"
        style={{ width: '100%', maxWidth: '440px', padding: 'clamp(1.75rem, 5vw, 2.5rem)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Logo size="md" showTagline />
          <h2 className="font-serif aa-subtitle" style={{ color: 'var(--text-ivory)', marginTop: '1.5rem', marginBottom: '0.3rem' }}>
            Staff Portal Login
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', margin: 0 }}>
            Restricted to authorized cafe administrators and baristas.
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'var(--danger-wash)',
              border: '1px solid var(--danger)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              fontSize: '0.88rem',
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="aa-label" htmlFor="admin-username">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="admin-username"
                className="aa-input"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div>
            <label className="aa-label" htmlFor="admin-password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="admin-password"
                className="aa-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {/* Development-only credential hint */}
          {IS_DEV && (
            <div
              className="aa-inset"
              style={{
                borderStyle: 'dashed',
                borderColor: 'var(--border-subtle)',
                padding: '0.6rem 0.8rem',
                fontSize: '0.8rem',
                color: 'var(--gold-hover)',
              }}
            >
              Local demo credentials: <strong>{DEMO_USERNAME}</strong> /{' '}
              <strong>{DEMO_PASSWORD}</strong>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
            style={{ width: '100%' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};
