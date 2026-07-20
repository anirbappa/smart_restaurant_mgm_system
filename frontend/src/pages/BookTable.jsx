import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createReservation, resetSuccess, clearResError } from '../features/reservationSlice';
import { Calendar as CalendarIcon, Users, Clock, Info, CheckCircle } from 'lucide-react';

function BookTable() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('18:00 - 19:30');
  const [guestsCount, setGuestsCount] = useState(2);
  const [selectedTable, setSelectedTable] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { loading, error, success } = useSelector((state) => state.reservations);

  useEffect(() => {
    dispatch(clearResError());
    dispatch(resetSuccess());
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [dispatch, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedTable) {
      alert('Please select a table from the floor map');
      return;
    }

    const resData = {
      name,
      email,
      phone,
      date,
      timeSlot,
      guestsCount,
      tableNumber: selectedTable
    };

    dispatch(createReservation(resData));
  };

  // Mock tables mapping (number, capacity, type)
  const tables = [
    { number: 1, capacity: 2, type: 'Couples' },
    { number: 2, capacity: 2, type: 'Couples' },
    { number: 3, capacity: 4, type: 'Standard' },
    { number: 4, capacity: 4, type: 'Standard' },
    { number: 5, capacity: 4, type: 'Standard' },
    { number: 6, capacity: 4, type: 'Standard' },
    { number: 7, capacity: 6, type: 'Family Booth' },
    { number: 8, capacity: 8, type: 'Grand Banquet' }
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: '800' }}>Table Reservations</h2>
        <p style={{ color: 'var(--text-muted)' }}>Choose your dining environment and schedule your arrival</p>
      </div>

      {success ? (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
          <CheckCircle size={56} color="var(--color-success)" />
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Reservation Confirmed!</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Thank you, {name}. Your table reservation at **Table {selectedTable}** has been successfully booked. An email confirmation has been sent to **{email}**.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => navigate('/orders')} className="btn btn-secondary">Track Orders</button>
            <button onClick={() => {
              dispatch(resetSuccess());
              setSelectedTable(null);
              setDate('');
              setPhone('');
            }} className="btn btn-primary">Book Another Table</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Floor Map Layout */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Select Table from Restaurant Floor
            </h3>

            {/* Simulated stage/door */}
            <div style={{
              background: 'rgba(0,0,0,0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              padding: '8px',
              textAlign: 'center',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginBottom: '2rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Restaurant Entrance & Reception Desk
            </div>

            {/* Tables Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem',
              justifyItems: 'center',
              marginBottom: '2rem'
            }}>
              {tables.map((table) => {
                const isSelected = selectedTable === table.number;
                return (
                  <div
                    key={table.number}
                    onClick={() => setSelectedTable(table.number)}
                    style={{
                      width: '75px',
                      height: '75px',
                      borderRadius: table.capacity === 6 ? '12px' : '50%',
                      background: isSelected ? 'var(--color-primary)' : 'rgba(0, 0, 0, 0.04)',
                      color: isSelected ? 'var(--text-dark)' : 'var(--text-main)',
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      boxShadow: isSelected ? 'var(--shadow-glow)' : 'none'
                    }}
                    onMouseOver={(e) => {
                      if(!isSelected) e.currentTarget.style.borderColor = 'var(--color-primary)';
                    }}
                    onMouseOut={(e) => {
                      if(!isSelected) e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>T - {table.number}</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>{table.capacity} Seats</span>
                  </div>
                );
              })}
            </div>

            {/* Table Details Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(0,0,0,0.04)', border: '1px solid var(--border-color)' }}></span>
                  Available
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)' }}></span>
                  Your Selection
                </span>
              </div>
              <p style={{ marginTop: '0.5rem' }}>
                * Tables 1-2 are configured for couples. Tables 7-8 are booths suited for larger groups and parties.
              </p>
            </div>
          </div>

          {/* Form Panel */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Booking Schedule Details
            </h3>

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--color-danger)',
                color: 'var(--color-danger)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                marginBottom: '1.5rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1 555-0199"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CalendarIcon size={12} />
                    Select Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    Time Slot
                  </label>
                  <select
                    className="form-control"
                    style={{ background: 'var(--bg-main)' }}
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                  >
                    <option value="12:00 - 13:30">Lunch (12:00 - 13:30)</option>
                    <option value="13:30 - 15:00">Lunch (13:30 - 15:00)</option>
                    <option value="18:00 - 19:30">Dinner (18:00 - 19:30)</option>
                    <option value="19:30 - 21:00">Dinner (19:30 - 21:00)</option>
                    <option value="21:00 - 22:30">Dinner (21:00 - 22:30)</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={12} />
                  Number of Guests
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  required
                  className="form-control"
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                />
              </div>

              {selectedTable && (
                <div style={{
                  padding: '0.75rem',
                  background: 'rgba(245, 158, 11, 0.05)',
                  border: '1px solid var(--color-primary)',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  color: 'var(--color-primary)',
                  textAlign: 'center'
                }}>
                  You have selected: <strong>Table {selectedTable}</strong>
                </div>
              )}

              {!user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-warning)' }}>
                  <Info size={14} />
                  <span>Please login to book a table</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={loading}
              >
                {loading ? 'Processing Booking...' : 'Reserve Table'}
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}

export default BookTable;
