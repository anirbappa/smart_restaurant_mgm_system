import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Calendar, Clock, Award, Star, Compass } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '3rem' }}>
      
      {/* Hero section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        alignItems: 'center',
        minHeight: '60vh',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(245, 158, 11, 0.1)',
            color: 'var(--color-primary)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            width: 'fit-content'
          }}>
            <Award size={14} />
            Award-Winning Cloud Kitchen & Dining
          </div>
          
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '4rem',
            fontWeight: '800',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, var(--text-main) 30%, var(--color-primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Smart Dining <br />
            Redefined.
          </h1>
          
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '500px' }}>
            Experience culinary perfection supported by high-tech smart management. Reserve tables, custom-order delicacies, and monitor your food preparation in real-time.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => navigate('/menu')} className="btn btn-primary" style={{ padding: '0.9rem 2rem', borderRadius: '30px' }}>
              Explore Menu
            </button>
            <button onClick={() => navigate('/book')} className="btn btn-secondary" style={{ padding: '0.9rem 2rem', borderRadius: '30px' }}>
              Book a Table
            </button>
          </div>
        </div>

        {/* Visual card elements */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.25rem',
          position: 'relative'
        }}>
          {/* Card 1 */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-secondary)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifycontent: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Live Kitchen Tracking</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Follow your orders from preparation to plate via our real-time tracker.</p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifycontent: 'center', justifyContent: 'center' }}>
              <Calendar size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Seamless Booking</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Select dates, pick table slots, and manage reservations immediately.</p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-primary)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifycontent: 'center', justifyContent: 'center' }}>
              <Utensils size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Digital Menu CRUD</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Browse high-resolution items, order tags, and search with zero latency.</p>
          </div>

          {/* Card 4 */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifycontent: 'center', justifyContent: 'center' }}>
              <Compass size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Integrated Admin</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Full system CRUD dashboard, analytics insights, and active reviews moderation.</p>
          </div>
        </div>
      </section>

      {/* Featured Reviews teaser */}
      <section className="glass-panel" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: '700' }}>Loved by Critics & Foodies</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', fontSize: '1rem' }}>
          "GustoSmart merges exquisite flavours with futuristic efficiency. The live order tracking and table selections completely redefined our dining experience."
        </p>
        <div style={{ display: 'flex', gap: '4px', color: 'var(--color-primary)' }}>
          <Star size={20} fill="var(--color-primary)" />
          <Star size={20} fill="var(--color-primary)" />
          <Star size={20} fill="var(--color-primary)" />
          <Star size={20} fill="var(--color-primary)" />
          <Star size={20} fill="var(--color-primary)" />
        </div>
        <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>— The Gastronomic Herald</span>
      </section>
    </div>
  );
}

export default Home;
