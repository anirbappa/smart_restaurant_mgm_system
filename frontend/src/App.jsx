import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, logout } from './features/authSlice';
import { ShoppingBag, Utensils, Calendar, Clock, MessageSquare, ShieldAlert, LogOut, LogIn, UserPlus } from 'lucide-react';

// Import Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import BookTable from './pages/BookTable';
import Orders from './pages/Orders';
import Feedback from './pages/Feedback';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);

  useEffect(() => {
    if (token && !user) {
      dispatch(getProfile());
    }
  }, [dispatch, token, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          <Utensils size={24} />
          <span>GustoSmart</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/menu" className={`nav-link ${isActive('/menu') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Menu
            {totalItems > 0 && (
              <span style={{
                background: 'var(--color-primary)',
                color: 'var(--text-dark)',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                padding: '1px 6px',
                borderRadius: '10px',
                minWidth: '18px',
                textAlign: 'center'
              }}>
                {totalItems}
              </span>
            )}
          </Link>
          <Link to="/book" className={`nav-link ${isActive('/book') ? 'active' : ''}`}>
            Reservations
          </Link>
          <Link to="/feedback" className={`nav-link ${isActive('/feedback') ? 'active' : ''}`}>
            Reviews
          </Link>

          {user && (
            <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
              My Orders
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} style={{ color: 'var(--color-primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldAlert size={16} />
              Admin
            </Link>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '10px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Hi, <strong>{user.name}</strong>
              </span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <LogIn size={14} />
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <UserPlus size={14} />
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Routes */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/book" element={<BookTable />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Modern Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
        background: 'var(--bg-card)'
      }}>
        <p>&copy; {new Date().getFullYear()} GustoSmart Restaurant Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
