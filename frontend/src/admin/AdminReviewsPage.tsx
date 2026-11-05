import React, { useEffect, useState } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, ShieldCheck, Filter } from 'lucide-react';
import { adminService } from '../services/adminService';
import { Review } from '../types';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await adminService.getReviews();
      const list = Array.isArray(res) ? res : res.results || [];
      setReviews(list);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleToggleApproval = async (id: number, currentApproved: boolean) => {
    setActionLoadingId(id);
    try {
      const updated = await adminService.updateReviewStatus(id, !currentApproved);
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err: any) {
      alert(err.message || 'Failed to update review status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this customer review?')) return;
    setActionLoadingId(id);
    try {
      await adminService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete review.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'approved') return r.is_approved;
    if (filter === 'pending') return !r.is_approved;
    return true;
  });

  return (
    <div className="aa-stack">
      <div>
        <span className="aa-eyebrow">Reputation &amp; Feedback</span>
        <h1 className="aa-title gold-gradient-text" style={{ margin: '0.5rem 0 0.5rem' }}>
          Customer Reviews Moderation
        </h1>
        <p className="aa-lede" style={{ margin: 0 }}>
          Approve authentic customer testimonials to display on the storefront homepage.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="aa-tabstrip" style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setFilter('all')}
          className={`aa-chip${filter === 'all' ? ' is-active' : ''}`}
        >
          All Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`aa-chip${filter === 'approved' ? ' is-active' : ''}`}
        >
          Approved ({reviews.filter((r) => r.is_approved).length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`aa-chip${filter === 'pending' ? ' is-active' : ''}`}
        >
          Pending Moderation ({reviews.filter((r) => !r.is_approved).length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gold-accent)', fontFamily: 'var(--font-serif)' }}>
          Loading customer reviews...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="aa-empty">
          <Filter size={32} color="var(--text-dim)" />
          <p style={{ margin: 0 }}>No reviews found matching the current filter.</p>
        </div>
      ) : (
        <div className="aa-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))' }}>
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="aa-card"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderColor: rev.is_approved ? 'var(--border-subtle)' : 'rgba(220, 184, 142, 0.35)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ margin: 0, color: 'var(--text-ivory)', fontSize: '1.05rem', fontWeight: 600 }}>{rev.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {new Date(rev.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="aa-row" style={{ justifyContent: 'flex-end' }}>
                    {rev.is_demo && <span className="aa-badge aa-badge--neutral">Demo</span>}
                    {rev.is_approved ? (
                      <span className="aa-badge aa-badge--success">
                        <ShieldCheck size={12} /> Approved
                      </span>
                    ) : (
                      <span className="aa-badge aa-badge--warning">Pending</span>
                    )}
                  </div>
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.75rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={15}
                      fill={star <= rev.rating ? 'var(--gold-accent)' : 'transparent'}
                      color={star <= rev.rating ? 'var(--gold-accent)' : 'var(--text-faint)'}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p style={{ color: 'var(--text-ivory)', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 1.25rem 0' }}>
                  "{rev.review_text}"
                </p>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-hairline)',
                }}
              >
                <button
                  onClick={() => handleToggleApproval(rev.id, rev.is_approved)}
                  disabled={actionLoadingId === rev.id}
                  className="btn-ghost"
                  style={{
                    color: rev.is_approved ? 'var(--danger)' : 'var(--success)',
                    borderColor: rev.is_approved ? 'var(--danger)' : 'var(--success)',
                    backgroundColor: rev.is_approved ? 'var(--danger-wash)' : 'var(--success-wash)',
                    cursor: actionLoadingId === rev.id ? 'not-allowed' : 'pointer',
                  }}
                >
                  {rev.is_approved ? (
                    <>
                      <XCircle size={14} /> Unapprove
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} /> Approve for Website
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(rev.id)}
                  disabled={actionLoadingId === rev.id}
                  title="Delete Review"
                  className="aa-icon-btn"
                  style={{
                    width: '36px',
                    height: '36px',
                    color: 'var(--danger)',
                    borderColor: 'var(--danger)',
                    backgroundColor: 'var(--danger-wash)',
                    cursor: actionLoadingId === rev.id ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
