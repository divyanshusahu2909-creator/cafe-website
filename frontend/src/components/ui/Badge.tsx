import React from 'react';

const TONE_BY_STATUS: Record<string, string> = {
  pending: 'aa-badge--warning',
  confirmed: 'aa-badge--success',
  completed: 'aa-badge--success',
  paid: 'aa-badge--success',
  preparing: 'aa-badge--coffee',
  out_for_delivery: 'aa-badge--coffee',
  ready: 'aa-badge--gold',
  cancelled: 'aa-badge--danger',
  rejected: 'aa-badge--danger',
  failed: 'aa-badge--danger',
};

export const VegBadge: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => {
  return (
    <span
      className={size === 'sm' ? 'aa-veg' : 'aa-veg aa-veg--lg'}
      title="100% Pure Vegetarian"
      aria-label="100% Pure Vegetarian"
    />
  );
};

export const FeaturedBadge: React.FC<{ label?: string }> = ({ label = 'Signature' }) => {
  return <span className="aa-badge aa-badge--gold">★ {label}</span>;
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const tone = TONE_BY_STATUS[status.toLowerCase()] || 'aa-badge--neutral';
  return <span className={`aa-badge ${tone}`}>{status.replace(/_/g, ' ').toUpperCase()}</span>;
};
