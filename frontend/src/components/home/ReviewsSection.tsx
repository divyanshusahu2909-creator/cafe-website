import React, { useEffect, useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle, X } from 'lucide-react';
import { Review } from '../../types';
import { reviewService } from '../../services/reviewService';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    reviewService
      .getReviews()
      .then((data) => setReviews(data))
      .catch((err) => console.error('Failed to load reviews:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !reviewText.trim()) return;

    setSubmitting(true);
    setError('');
    try {
      await reviewService.submitReview({ name, rating, review_text: reviewText });
      setSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitted(false);
        setName('');
        setReviewText('');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="aa-section" style={{ backgroundColor: '#111111' }}>
      <div className="aa-container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1.5rem',
            marginBottom: 'clamp(2rem, 5vw, 3.5rem)',
          }}
        >
          <div className="aa-stack" style={{ gap: '0.4rem' }}>
            <span className="aa-eyebrow">Guest Sentiments</span>
            <h2 className="aa-title gold-gradient-text">Reflections on Every Sip</h2>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="btn-outline-gold">
            <MessageSquarePlus size={18} /> Share Your Experience
          </button>
        </div>

        {/* Minimal & Elegant Customer Review Cards */}
        <div className="aa-grid">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="aa-card aa-card--hover"
              style={{
                padding: 'clamp(1.6rem, 3vw, 2.2rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                backgroundColor: '#1A1A1A',
                border: '1px solid rgba(248, 245, 239, 0.08)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div>
                {/* Rating stars & verified tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < rev.rating ? '#C6A15B' : 'transparent'}
                        color={i < rev.rating ? '#C6A15B' : '#555555'}
                      />
                    ))}
                  </div>

                  {rev.is_demo ? (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#A7A08F',
                        border: '1px solid rgba(248, 245, 239, 0.1)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-xs)',
                      }}
                    >
                      Sample
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#8FB89A',
                        border: '1px solid rgba(143, 184, 154, 0.3)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-xs)',
                      }}
                    >
                      Verified Guest
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p
                  className="font-serif"
                  style={{
                    color: '#F8F5EF',
                    fontSize: '1.05rem',
                    lineHeight: 1.7,
                    fontStyle: 'italic',
                    margin: '0 0 1.5rem',
                    fontWeight: 400,
                  }}
                >
                  "{rev.review_text}"
                </p>
              </div>

              {/* Author & Timestamp */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid rgba(248, 245, 239, 0.08)',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(198, 161, 91, 0.15)',
                    border: '1px solid #C6A15B',
                    color: '#C6A15B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ color: '#F8F5EF', fontSize: '0.95rem', margin: 0, fontWeight: 600 }}>{rev.name}</h4>
                  <span style={{ color: '#A7A08F', fontSize: '0.78rem' }}>
                    {new Date(rev.created_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Submission Dialog Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(17, 17, 17, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div
            className="animate-scale-up"
            style={{
              backgroundColor: '#1E1E1E',
              border: '1px solid rgba(198, 161, 91, 0.3)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '520px',
              width: '100%',
              padding: '2.5rem',
              position: 'relative',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: '#A7A08F',
                cursor: 'pointer',
                padding: '0.5rem',
              }}
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={56} color="#C6A15B" style={{ margin: '0 auto 1.25rem' }} />
                <h3 className="font-serif gold-gradient-text" style={{ fontSize: '1.8rem', margin: '0 0 0.5rem' }}>
                  Thank You
                </h3>
                <p style={{ color: '#A7A08F', lineHeight: 1.6 }}>
                  Your review has been submitted for staff moderation and will appear on our website shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#C6A15B',
                    fontWeight: 600,
                  }}
                >
                  Guest Feedback
                </span>
                <h3 className="font-serif" style={{ fontSize: '1.8rem', color: '#F8F5EF', margin: '0.25rem 0 1.5rem' }}>
                  Share Your Experience
                </h3>

                {error && (
                  <div
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-btn)',
                      backgroundColor: 'rgba(217, 112, 106, 0.15)',
                      border: '1px solid var(--danger)',
                      color: '#F87171',
                      fontSize: '0.85rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {error}
                  </div>
                )}

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ishaan Sharma"
                    className="aa-input"
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    Rating
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <Star
                          size={24}
                          fill={star <= rating ? '#C6A15B' : 'transparent'}
                          color={star <= rating ? '#C6A15B' : '#555555'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={{ display: 'block', color: '#A7A08F', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    Your Thoughts
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe your coffee, dining experience, or cafe atmosphere..."
                    className="aa-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold"
                  style={{ width: '100%', padding: '0.9rem', fontSize: '0.9rem' }}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
