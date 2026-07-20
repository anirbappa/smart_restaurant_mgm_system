import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllFeedback, submitFeedback, resetFeedbackSuccess } from '../features/feedbackSlice';
import { Star, MessageSquare, Info, CheckCircle2, User } from 'lucide-react';

function Feedback() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { feedbacks, loading, error, success } = useSelector((state) => state.feedback);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllFeedback());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setComment('');
      setRating(5);
      dispatch(resetFeedbackSuccess());
    }
  }, [success, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!comment) return;

    dispatch(submitFeedback({ rating, comment }));
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }}>
      
      {/* Reviews list */}
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: '800' }}>Customer Reviews</h2>
          <p style={{ color: 'var(--text-muted)' }}>What our dining guests have to say about their experience</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading reviews...</p>
        ) : feedbacks.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <MessageSquare size={36} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>No feedback left yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {feedbacks.map((f) => (
              <div key={f._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                  <User size={20} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>{f.userName}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(f.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Stars display */}
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        fill={star <= f.rating ? 'var(--color-primary)' : 'none'}
                        color={star <= f.rating ? 'var(--color-primary)' : 'var(--text-muted)'}
                      />
                    ))}
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '4px' }}>"{f.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Write Feedback form */}
      <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          Leave a Review
        </h3>

        {success && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--color-success)',
            padding: '0.75rem',
            borderRadius: '4px',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <CheckCircle2 size={16} />
            <span>Thank you for your feedback!</span>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--color-danger)',
            color: 'var(--color-danger)',
            padding: '0.75rem',
            borderRadius: '4px',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Rating</label>
            <div style={{ display: 'flex', gap: '8px', padding: '4px 0' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  fill={star <= (hoverRating || rating) ? 'var(--color-primary)' : 'none'}
                  color={star <= (hoverRating || rating) ? 'var(--color-primary)' : 'var(--text-muted)'}
                />
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Your Comment</label>
            <textarea
              required
              rows="4"
              placeholder="How was the dining service? Tell us what you loved!"
              className="form-control"
              style={{ resize: 'none' }}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {!user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-warning)' }}>
              <Info size={14} />
              <span>Please login to submit feedback</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>

    </div>
  );
}

export default Feedback;
