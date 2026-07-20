import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus } from '../features/orderSlice';
import { fetchAllReservations, cancelReservation } from '../features/reservationSlice';
import { fetchAllFeedback, deleteFeedback } from '../features/feedbackSlice';
import { fetchMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../features/menuSlice';
import { DollarSign, ShoppingCart, Calendar, MessageSquare, Plus, Edit2, Trash2, CheckCircle, Flame, Server, AlertOctagon } from 'lucide-react';

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  
  // Slices data
  const { orders } = useSelector((state) => state.orders);
  const { reservations } = useSelector((state) => state.reservations);
  const { feedbacks } = useSelector((state) => state.feedback);
  const { items: menuItems } = useSelector((state) => state.menu);

  // Local view tabs: 'analytics' | 'kds' | 'menu' | 'reservations' | 'feedback'
  const [activeTab, setActiveTab] = useState('analytics');

  // Menu editor states
  const [editingId, setEditingId] = useState(null);
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Main Course',
    image: '',
    isAvailable: true
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      return;
    }
    // Fetch all records for admin dashboard
    dispatch(fetchAllOrders());
    dispatch(fetchAllReservations());
    dispatch(fetchAllFeedback());
    dispatch(fetchMenuItems());
  }, [dispatch, user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '600px', margin: '3rem auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <AlertOctagon size={48} color="var(--color-danger)" />
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Access Denied</h3>
        <p style={{ color: 'var(--text-muted)' }}>You do not have administrative privileges required to view the management dashboard.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Return to Homepage</button>
      </div>
    );
  }

  // Calculate analytical insights
  const totalRevenue = orders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const totalReservations = reservations.filter(r => r.status === 'Confirmed').length;
  
  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  // Handler functions
  const handleOrderStatusUpdate = (id, newStatus) => {
    dispatch(updateOrderStatus({ id, status: newStatus }));
  };

  const handleCancelReservation = (id) => {
    dispatch(cancelReservation(id));
  };

  const handleDeleteFeedback = (id) => {
    dispatch(deleteFeedback(id));
  };

  // Menu item Form CRUD Handlers
  const handleMenuFormSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateMenuItem({ id: editingId, itemData: menuForm })).then(() => {
        setEditingId(null);
        clearMenuForm();
      });
    } else {
      dispatch(createMenuItem(menuForm)).then(() => {
        clearMenuForm();
      });
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      isAvailable: item.isAvailable
    });
  };

  const handleDeleteMenuClick = (id) => {
    if(confirm('Are you sure you want to delete this menu item?')) {
      dispatch(deleteMenuItem(id));
    }
  };

  const clearMenuForm = () => {
    setEditingId(null);
    setMenuForm({
      name: '',
      description: '',
      price: 0,
      category: 'Main Course',
      image: '',
      isAvailable: true
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: '800' }}>Admin Control Center</h2>
          <p style={{ color: 'var(--text-muted)' }}>Configure system states, manage inventory, and monitor service analytics</p>
        </div>

        {/* Tab Selectors */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.02)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {[
            { id: 'analytics', label: 'Analytics' },
            { id: 'kds', label: 'Kitchen KDS' },
            { id: 'menu', label: 'Menu CRUD' },
            { id: 'reservations', label: 'Reservations' },
            { id: 'feedback', label: 'Reviews Moderation' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                color: activeTab === tab.id ? 'var(--text-dark)' : 'var(--text-main)',
                border: 'none',
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. VIEW: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Metrics Grid */}
          <div className="stats-grid">
            <div className="glass-panel stat-card">
              <div className="stat-icon" style={{ color: 'var(--color-success)', background: 'rgba(16, 185, 129, 0.1)' }}>
                <DollarSign size={20} />
              </div>
              <div className="stat-info">
                <h3>Total Sales (USD)</h3>
                <p>${totalRevenue.toFixed(2)}</p>
              </div>
            </div>

            <div className="glass-panel stat-card">
              <div className="stat-icon" style={{ color: 'var(--color-warning)', background: 'rgba(245, 158, 11, 0.1)' }}>
                <ShoppingCart size={20} />
              </div>
              <div className="stat-info">
                <h3>Active KDS Orders</h3>
                <p>{activeOrdersCount}</p>
              </div>
            </div>

            <div className="glass-panel stat-card">
              <div className="stat-icon" style={{ color: 'var(--color-secondary)', background: 'rgba(59, 130, 246, 0.1)' }}>
                <Calendar size={20} />
              </div>
              <div className="stat-info">
                <h3>Confirmed Bookings</h3>
                <p>{totalReservations}</p>
              </div>
            </div>

            <div className="glass-panel stat-card">
              <div className="stat-icon" style={{ color: 'var(--color-primary)', background: 'rgba(245, 158, 11, 0.1)' }}>
                <MessageSquare size={20} />
              </div>
              <div className="stat-info">
                <h3>Avg rating score</h3>
                <p>{averageRating} / 5.0</p>
              </div>
            </div>
          </div>

          {/* SVG Sales Trend Chart Mock */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem' }}>Weekly Sales Performance Trend (Mocked)</h3>
            <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 20px', borderLeft: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
              {[
                { day: 'Mon', sales: 450 },
                { day: 'Tue', sales: 520 },
                { day: 'Wed', sales: 610 },
                { day: 'Thu', sales: 480 },
                { day: 'Fri', sales: 950 },
                { day: 'Sat', sales: 1250 },
                { day: 'Sun', sales: 1100 }
              ].map((d) => {
                const heightPercent = (d.sales / 1300) * 100;
                return (
                  <div key={d.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>${d.sales}</span>
                    <div style={{
                      width: '32px',
                      height: `${heightPercent * 1.5}px`,
                      background: 'linear-gradient(180deg, var(--color-primary) 0%, rgba(245, 158, 11, 0.05) 100%)',
                      borderRadius: '4px 4px 0 0',
                      boxShadow: 'var(--shadow-glow)'
                    }}></div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. VIEW: KITCHEN DISPLAY SYSTEM (KDS) */}
      {activeTab === 'kds' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          
          {/* Column 1: Pending */}
          <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '400px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-warning)', borderBottom: '2px solid var(--color-warning)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <Clock size={18} />
              Pending ({orders.filter(o => o.status === 'Pending').length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.filter(o => o.status === 'Pending').map(order => (
                <div key={order._id} style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <span>#{order._id.substring(18)}</span>
                    <span>{order.diningOption} {order.tableNumber ? `(T-${order.tableNumber})` : ''}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    {order.items.map((i, idx) => (
                      <div key={idx}>{i.name} <strong>x{i.quantity}</strong></div>
                    ))}
                  </div>
                  <button onClick={() => handleOrderStatusUpdate(order._id, 'Preparing')} className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem', padding: '6px' }}>
                    Start Preparing
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Preparing */}
          <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '400px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary)', borderBottom: '2px solid var(--color-secondary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <Flame size={18} />
              Preparing ({orders.filter(o => o.status === 'Preparing').length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.filter(o => o.status === 'Preparing').map(order => (
                <div key={order._id} style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <span>#{order._id.substring(18)}</span>
                    <span>{order.diningOption} {order.tableNumber ? `(T-${order.tableNumber})` : ''}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    {order.items.map((i, idx) => (
                      <div key={idx}>{i.name} <strong>x{i.quantity}</strong></div>
                    ))}
                  </div>
                  <button onClick={() => handleOrderStatusUpdate(order._id, 'Ready')} className="btn" style={{ width: '100%', fontSize: '0.8rem', padding: '6px', background: 'var(--color-success)', color: 'var(--text-dark)' }}>
                    Mark Ready
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Ready for Delivery/Service */}
          <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '400px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)', borderBottom: '2px solid var(--color-success)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <CheckCircle size={18} />
              Ready ({orders.filter(o => o.status === 'Ready').length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.filter(o => o.status === 'Ready').map(order => (
                <div key={order._id} style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <span>#{order._id.substring(18)}</span>
                    <span>{order.diningOption} {order.tableNumber ? `(T-${order.tableNumber})` : ''}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    {order.items.map((i, idx) => (
                      <div key={idx}>{i.name} <strong>x{i.quantity}</strong></div>
                    ))}
                  </div>
                  <button onClick={() => handleOrderStatusUpdate(order._id, 'Delivered')} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem', padding: '6px' }}>
                    Mark Completed
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 3. VIEW: MENU CRUD */}
      {activeTab === 'menu' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
          {/* Menu Table list */}
          <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Name</th>
                  <th style={{ padding: '12px' }}>Category</th>
                  <th style={{ padding: '12px' }}>Price</th>
                  <th style={{ padding: '12px' }}>Availability</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map(item => (
                  <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.name}</td>
                    <td style={{ padding: '12px' }}>{item.category}</td>
                    <td style={{ padding: '12px' }}>${item.price.toFixed(2)}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ color: item.isAvailable ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button onClick={() => handleEditClick(item)} style={{ background: 'transparent', border: 'none', color: 'var(--color-secondary)', cursor: 'pointer' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteMenuClick(item._id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Create/Edit Form */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              {editingId ? 'Edit Dish Details' : 'Add New Dish'}
            </h3>
            
            <form onSubmit={handleMenuFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Dish Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  style={{ padding: '0.5rem' }}
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Description</label>
                <textarea
                  required
                  rows="2"
                  className="form-control"
                  style={{ padding: '0.5rem', resize: 'none' }}
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="form-control"
                  style={{ padding: '0.5rem' }}
                  value={menuForm.price}
                  onChange={(e) => setMenuForm({ ...menuForm, price: parseFloat(e.target.value) })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Category</label>
                <select
                  className="form-control"
                  style={{ padding: '0.5rem', background: 'var(--bg-main)' }}
                  value={menuForm.category}
                  onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                >
                  <option value="Appetizers">Appetizers</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Salads">Salads</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ padding: '0.5rem' }}
                  placeholder="https://images.unsplash.com/..."
                  value={menuForm.image}
                  onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={menuForm.isAvailable}
                  onChange={(e) => setMenuForm({ ...menuForm, isAvailable: e.target.checked })}
                />
                <label htmlFor="isAvailable" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Available in Stock</label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '8px' }}>
                  {editingId ? 'Update' : 'Create'}
                </button>
                {editingId && (
                  <button type="button" onClick={clearMenuForm} className="btn btn-secondary" style={{ padding: '8px' }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. VIEW: RESERVATIONS */}
      {activeTab === 'reservations' && (
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Guest Name</th>
                <th style={{ padding: '12px' }}>Contact</th>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Time Slot</th>
                <th style={{ padding: '12px' }}>Seats</th>
                <th style={{ padding: '12px' }}>Table</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{res.name}</td>
                  <td style={{ padding: '12px', fontSize: '0.8rem' }}>
                    <div>{res.email}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{res.phone}</div>
                  </td>
                  <td style={{ padding: '12px' }}>{new Date(res.date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>{res.timeSlot}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{res.guestsCount}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: 'var(--color-primary)' }}>Table {res.tableNumber}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ color: res.status === 'Confirmed' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {res.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {res.status === 'Confirmed' && (
                      <button onClick={() => handleCancelReservation(res._id)} className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                        Cancel Booking
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. VIEW: FEEDBACK MODERATION */}
      {activeTab === 'feedback' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {feedbacks.map(f => (
            <div key={f._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '1rem' }}>{f.userName}</h4>
                <div style={{ display: 'flex', gap: '2px', margin: '4px 0' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} style={{ color: s <= f.rating ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '8px' }}>"{f.comment}"</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Posted: {new Date(f.createdAt).toLocaleString()}</span>
              </div>

              <button onClick={() => handleDeleteFeedback(f._id)} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '0.8rem' }}>
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
