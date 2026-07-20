import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyOrders } from '../features/orderSlice';
import { Clock, Utensils, CheckCircle, PackageCheck, ShieldAlert, ArrowRight } from 'lucide-react';

function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(fetchMyOrders());
  }, [dispatch, user, navigate]);

  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Preparing': return 2;
      case 'Ready': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'var(--color-warning)';
      case 'Preparing': return 'var(--color-secondary)';
      case 'Ready': return 'var(--color-success)';
      case 'Delivered': return 'var(--text-muted)';
      case 'Cancelled': return 'var(--color-danger)';
      default: return 'white';
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: '800' }}>Order Tracking & History</h2>
        <p style={{ color: 'var(--text-muted)' }}>Follow your culinary delights live as our chefs prepare them</p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading order data...</p>
      ) : error ? (
        <p style={{ color: 'var(--color-danger)' }}>Error loading orders: {error}</p>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <Clock size={36} style={{ opacity: 0.3 }} />
          <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/menu')} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            Go to Menu
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {orders.map((order) => {
            const currentStep = getStatusStep(order.status);
            const isCancelled = order.status === 'Cancelled';
            
            return (
              <div key={order._id} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order ID: #{order._id.substring(18)}</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '4px' }}>
                      {order.diningOption} {order.tableNumber ? `(Table ${order.tableNumber})` : ''}
                    </h3>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleString()}</span>
                    <span style={{
                      color: getStatusColor(order.status),
                      fontWeight: '800',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(order.status), display: 'inline-block' }} className={order.status === 'Preparing' || order.status === 'Pending' ? 'animate-pulse' : ''}></span>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar tracker (only show if not cancelled) */}
                {!isCancelled && (
                  <div style={{ padding: '1rem 0' }}>
                    <div style={{ position: 'relative', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {/* Filled track progress */}
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: `${((currentStep - 1) / 3) * 100}%`,
                        background: 'linear-gradient(90deg, var(--color-warning) 0%, var(--color-success) 100%)',
                        borderRadius: '4px',
                        transition: 'width var(--transition-normal)'
                      }}></div>

                      {/* Step circles */}
                      {[
                        { step: 1, label: 'Order Confirmed', icon: <Clock size={12} /> },
                        { step: 2, label: 'In Kitchen', icon: <Utensils size={12} /> },
                        { step: 3, label: 'Ready for Service', icon: <CheckCircle size={12} /> },
                        { step: 4, label: 'Served/Delivered', icon: <PackageCheck size={12} /> }
                      ].map((s) => {
                        const isDone = currentStep >= s.step;
                        const isActive = currentStep === s.step;
                        return (
                          <div key={s.step} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: isDone ? 'var(--color-success)' : 'var(--bg-main)',
                              color: isDone ? 'var(--text-dark)' : 'var(--text-muted)',
                              border: isActive ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                              transition: 'all var(--transition-fast)'
                            }}>
                              {s.icon}
                            </div>
                            <span style={{
                              position: 'absolute',
                              top: '32px',
                              whiteSpace: 'nowrap',
                              fontSize: '0.7rem',
                              color: isDone ? 'var(--text-main)' : 'var(--text-muted)',
                              fontWeight: isActive ? 'bold' : 'normal',
                              transform: 'translateX(-50%)',
                              left: '50%'
                            }}>{s.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* List of items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {item.name} <strong style={{ color: 'var(--text-main)', marginLeft: '4px' }}>x{item.quantity}</strong>
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  {order.notes && (
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.75rem',
                      background: 'rgba(0, 0, 0, 0.02)',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      borderLeft: '2px solid var(--color-primary)',
                      color: 'var(--text-muted)'
                    }}>
                      <strong>Special Request:</strong> {order.notes}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontWeight: 'bold', fontSize: '1.05rem', marginTop: '0.5rem' }}>
                    <span>Total Bill:</span>
                    <span style={{ color: 'var(--color-primary)' }}>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Add standard blinking keyframes helper
const styleTag = document.createElement('style');
styleTag.innerHTML += `
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
`;
document.head.appendChild(styleTag);

export default Orders;
