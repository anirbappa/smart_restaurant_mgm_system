import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMenuItems, setCategory, setSearchQuery } from '../features/menuSlice';
import { addItem, removeItem, updateQuantity, setDiningOption, setTableNumber, setNotes, clearCart } from '../features/cartSlice';
import { placeOrder } from '../features/orderSlice';
import { Search, ShoppingCart, Trash2, Plus, Minus, Send, Info } from 'lucide-react';

function Menu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items, selectedCategory, searchQuery, loading, error } = useSelector((state) => state.menu);
  const cart = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchMenuItems({ category: selectedCategory, search: searchQuery }));
  }, [dispatch, selectedCategory, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
  };

  const handleCategoryChange = (cat) => {
    dispatch(setCategory(cat));
  };

  const handleAddToCart = (item) => {
    dispatch(addItem(item));
  };

  const handlePlaceOrder = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cart.items.length === 0) return;

    if (cart.diningOption === 'Dine-In' && !cart.tableNumber) {
      alert('Please enter your table number');
      return;
    }

    const orderData = {
      items: cart.items,
      totalAmount: cart.totalAmount,
      diningOption: cart.diningOption,
      tableNumber: cart.diningOption === 'Dine-In' ? parseInt(cart.tableNumber) : null,
      notes: cart.notes
    };

    dispatch(placeOrder(orderData)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(clearCart());
        setCheckoutSuccess(true);
        setTimeout(() => {
          setCheckoutSuccess(false);
          navigate('/orders');
        }, 2000);
      } else {
        alert('Order placement failed. Check connection.');
      }
    });
  };

  const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Salads'];

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
      
      {/* Menu Area */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: '800' }}>Taste the Future</h2>
            <p style={{ color: 'var(--text-muted)' }}>Explore our freshly prepared gourmet menu items</p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '350px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search food, ingredients..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>Search</button>
          </form>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem', scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className="btn"
              style={{
                background: selectedCategory === cat ? 'var(--color-primary)' : 'rgba(0, 0, 0, 0.03)',
                color: selectedCategory === cat ? 'var(--text-dark)' : 'var(--text-main)',
                border: selectedCategory === cat ? 'none' : '1px solid var(--border-color)',
                borderRadius: '30px',
                padding: '0.5rem 1.25rem',
                fontSize: '0.875rem'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Fetching delicious menu items...</p>
        ) : error ? (
          <p style={{ color: 'var(--color-danger)' }}>Error: {error}</p>
        ) : items.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No menu items found. Try another search or filter.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {items.map((item) => (
              <div key={item._id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-normal)' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  {item.tags?.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(9, 13, 22, 0.75)',
                        border: '1px solid var(--color-primary)',
                        color: 'var(--color-primary)',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-display)' }}>{item.name}</h3>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', flex: 1 }}>{item.description}</p>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '0.5rem', opacity: item.isAvailable ? 1 : 0.5 }}
                    disabled={!item.isAvailable}
                  >
                    <Plus size={16} />
                    {item.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '500px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <ShoppingCart size={18} />
          Your Order Drawer
        </h3>

        {checkoutSuccess ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '1rem',
            color: 'var(--color-success)'
          }}>
            <Send size={48} className="animate-bounce" />
            <h4 style={{ fontWeight: 'bold' }}>Order Sent to Kitchen!</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Redirecting you to track its real-time preparation status...</p>
          </div>
        ) : cart.items.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '1rem' }}>
            <ShoppingCart size={36} style={{ opacity: 0.3 }} />
            <p style={{ fontSize: '0.9rem' }}>Cart is empty</p>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
              {cart.items.map((item) => (
                <div key={item.menuItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.75rem', borderBottom: '1px dashed var(--border-color)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600' }}>{item.name}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item.menuItem, quantity: item.quantity - 1 }))}
                      style={{ background: 'rgba(0,0,0,0.05)', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '2px', borderRadius: '4px' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontSize: '0.9rem', width: '16px', textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item.menuItem, quantity: item.quantity + 1 }))}
                      style={{ background: 'rgba(0,0,0,0.05)', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '2px', borderRadius: '4px' }}
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => dispatch(removeItem(item.menuItem))}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', marginLeft: '4px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Dining Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['Dine-In', 'Takeaway', 'Delivery'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => dispatch(setDiningOption(opt))}
                    style={{
                      flex: 1,
                      padding: '6px',
                      fontSize: '0.75rem',
                      background: cart.diningOption === opt ? 'var(--color-primary)' : 'rgba(0,0,0,0.03)',
                      color: cart.diningOption === opt ? 'var(--text-dark)' : 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {cart.diningOption === 'Dine-In' && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Table Number</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 5"
                    className="form-control"
                    style={{ padding: '0.5rem' }}
                    value={cart.tableNumber}
                    onChange={(e) => dispatch(setTableNumber(e.target.value))}
                  />
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Kitchen Notes</label>
                <textarea
                  rows="2"
                  placeholder="Allergies, extra spicy..."
                  className="form-control"
                  style={{ padding: '0.5rem', resize: 'none' }}
                  value={cart.notes}
                  onChange={(e) => dispatch(setNotes(e.target.value))}
                />
              </div>
            </div>

            {/* Total and Checkout */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Total Amount:</span>
                <span style={{ color: 'var(--color-primary)' }}>${cart.totalAmount.toFixed(2)}</span>
              </div>
              
              {!user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-warning)' }}>
                  <Info size={14} />
                  <span>Please login to submit orders</span>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Place Order (${cart.totalAmount.toFixed(2)})
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Menu;
