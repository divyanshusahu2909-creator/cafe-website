import React, { useEffect, useState } from 'react';
import { Save, Building2, Phone, Clock, Truck, Check, AlertCircle } from 'lucide-react';
import { adminService } from '../services/adminService';
import { BusinessSettings } from '../types';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Partial<BusinessSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const data = await adminService.getBusinessSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load business settings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings((prev) => ({ ...prev, [name]: checked }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const updated = await adminService.updateBusinessSettings(settings);
      setSettings(updated);
      setMessage({ type: 'success', text: 'Business settings updated successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update business settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ color: '#A7A08F', padding: '3rem', textAlign: 'center' }}>Loading cafe settings...</div>;
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C6A15B', fontWeight: 600 }}>
          Configuration & Operations
        </span>
        <h1 className="font-serif gold-gradient-text" style={{ fontSize: '2.2rem', margin: '0.25rem 0' }}>
          Business Settings
        </h1>
        <p style={{ color: '#A7A08F', fontSize: '0.92rem' }}>
          Manage your Indore cafe identity, opening hours, WhatsApp concierge line, and delivery pricing.
        </p>
      </div>

      {message && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            borderRadius: '6px',
            backgroundColor: message.type === 'success' ? 'rgba(143, 184, 154, 0.15)' : 'rgba(217, 112, 106, 0.15)',
            border: message.type === 'success' ? '1px solid #8fb89a' : '1px solid #d9706a',
            color: message.type === 'success' ? '#a3c7ab' : '#e4a29c',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.9rem',
          }}
        >
          {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Brand Information */}
        <div
          style={{
            backgroundColor: '#1f1a16',
            border: '1px solid rgba(245, 239, 230, 0.08)',
            borderRadius: '8px',
            padding: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', color: '#DBB68B' }}>
            <Building2 size={20} />
            <h2 className="font-serif" style={{ fontSize: '1.2rem', margin: 0, color: '#F8F5EF' }}>
              Cafe Identity & Location
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Cafe Name</label>
              <input
                type="text"
                name="name"
                value={settings.name || ''}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  backgroundColor: '#111111',
                  border: '1px solid rgba(245, 239, 230, 0.12)',
                  borderRadius: '4px',
                  color: '#F8F5EF',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Tagline</label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline || ''}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  backgroundColor: '#111111',
                  border: '1px solid rgba(245, 239, 230, 0.12)',
                  borderRadius: '4px',
                  color: '#F8F5EF',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Description</label>
            <textarea
              name="description"
              rows={3}
              value={settings.description || ''}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                backgroundColor: '#111111',
                border: '1px solid rgba(245, 239, 230, 0.12)',
                borderRadius: '4px',
                color: '#F8F5EF',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Street Address</label>
              <input
                type="text"
                name="address_placeholder"
                value={settings.address_placeholder || ''}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  backgroundColor: '#111111',
                  border: '1px solid rgba(245, 239, 230, 0.12)',
                  borderRadius: '4px',
                  color: '#F8F5EF',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>City</label>
              <input
                type="text"
                name="city"
                value={settings.city || ''}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  backgroundColor: '#111111',
                  border: '1px solid rgba(245, 239, 230, 0.12)',
                  borderRadius: '4px',
                  color: '#F8F5EF',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>State</label>
              <input
                type="text"
                name="state"
                value={settings.state || ''}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  backgroundColor: '#111111',
                  border: '1px solid rgba(245, 239, 230, 0.12)',
                  borderRadius: '4px',
                  color: '#F8F5EF',
                }}
              />
            </div>
          </div>
        </div>

        {/* Contact & WhatsApp */}
        <div
          style={{
            backgroundColor: '#1f1a16',
            border: '1px solid rgba(245, 239, 230, 0.08)',
            borderRadius: '8px',
            padding: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', color: '#DBB68B' }}>
            <Phone size={20} />
            <h2 className="font-serif" style={{ fontSize: '1.2rem', margin: 0, color: '#F8F5EF' }}>
              Contact & Concierge Lines
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={settings.phone || ''}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  backgroundColor: '#111111',
                  border: '1px solid rgba(245, 239, 230, 0.12)',
                  borderRadius: '4px',
                  color: '#F8F5EF',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                WhatsApp Number (e.g. +919876543210)
              </label>
              <input
                type="text"
                name="whatsapp_number"
                value={settings.whatsapp_number || ''}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  backgroundColor: '#111111',
                  border: '1px solid rgba(245, 239, 230, 0.12)',
                  borderRadius: '4px',
                  color: '#F8F5EF',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Public Email</label>
              <input
                type="email"
                name="email"
                value={settings.email || ''}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  backgroundColor: '#111111',
                  border: '1px solid rgba(245, 239, 230, 0.12)',
                  borderRadius: '4px',
                  color: '#F8F5EF',
                }}
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div
          style={{
            backgroundColor: '#1f1a16',
            border: '1px solid rgba(245, 239, 230, 0.08)',
            borderRadius: '8px',
            padding: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', color: '#DBB68B' }}>
            <Clock size={20} />
            <h2 className="font-serif" style={{ fontSize: '1.2rem', margin: 0, color: '#F8F5EF' }}>
              Operating Schedule
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Opening Time</label>
              <input
                type="text"
                name="opening_time"
                placeholder="10:00:00"
                value={settings.opening_time || ''}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  backgroundColor: '#111111',
                  border: '1px solid rgba(245, 239, 230, 0.12)',
                  borderRadius: '4px',
                  color: '#F8F5EF',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Closing Time</label>
              <input
                type="text"
                name="closing_time"
                placeholder="22:30:00"
                value={settings.closing_time || ''}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  backgroundColor: '#111111',
                  border: '1px solid rgba(245, 239, 230, 0.12)',
                  borderRadius: '4px',
                  color: '#F8F5EF',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Open Days</label>
              <input
                type="text"
                name="opening_days"
                placeholder="Monday to Sunday"
                value={settings.opening_days || ''}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  backgroundColor: '#111111',
                  border: '1px solid rgba(245, 239, 230, 0.12)',
                  borderRadius: '4px',
                  color: '#F8F5EF',
                }}
              />
            </div>
          </div>
        </div>

        {/* Delivery & Ordering Policies */}
        <div
          style={{
            backgroundColor: '#1f1a16',
            border: '1px solid rgba(245, 239, 230, 0.08)',
            borderRadius: '8px',
            padding: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', color: '#DBB68B' }}>
            <Truck size={20} />
            <h2 className="font-serif" style={{ fontSize: '1.2rem', margin: 0, color: '#F8F5EF' }}>
              Delivery & Order Pricing
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                Delivery Fee (₹)
              </label>
              <input
                type="number"
                step="0.01"
                name="delivery_fee"
                value={settings.delivery_fee || '50.00'}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  backgroundColor: '#111111',
                  border: '1px solid rgba(245, 239, 230, 0.12)',
                  borderRadius: '4px',
                  color: '#F8F5EF',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                Free Delivery Threshold (₹)
              </label>
              <input
                type="number"
                step="0.01"
                name="free_delivery_threshold"
                value={settings.free_delivery_threshold || '500.00'}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  backgroundColor: '#111111',
                  border: '1px solid rgba(245, 239, 230, 0.12)',
                  borderRadius: '4px',
                  color: '#F8F5EF',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="checkbox"
              id="delivery_available"
              name="delivery_available"
              checked={settings.delivery_available !== false}
              onChange={(e) => setSettings((prev) => ({ ...prev, delivery_available: e.target.checked }))}
              style={{ width: '18px', height: '18px', accentColor: '#C6A15B', cursor: 'pointer' }}
            />
            <label htmlFor="delivery_available" style={{ color: '#F8F5EF', fontSize: '0.92rem', cursor: 'pointer' }}>
              Enable takeaway & local delivery checkout
            </label>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-gold"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem', fontSize: '0.95rem' }}
          >
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
