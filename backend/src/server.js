const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount Route Files
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

// Test Route
app.get('/', (req, res) => {
  res.send('Smart Restaurant API is running');
});

// Seed Menu Items if collection is empty
const MenuItem = require('./models/MenuItem');
const seedMenu = async () => {
  try {
    const count = await MenuItem.countDocuments();
    if (count === 0) {
      const items = [
        {
          name: 'Crispy Truffle Fries',
          description: 'Golden fried potatoes tossed in white truffle oil, grated parmesan, and fresh parsley, served with garlic aioli.',
          price: 9.50,
          category: 'Appetizers',
          image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60',
          isAvailable: true,
          tags: ['Vegetarian', 'Best Seller']
        },
        {
          name: 'Classic Caesar Salad',
          description: 'Crisp romaine lettuce, sourdough croutons, parmesan shavings, tossed in creamy Caesar dressing.',
          price: 12.00,
          category: 'Salads',
          image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60',
          isAvailable: true,
          tags: ['Healthy']
        },
        {
          name: 'Signature Beef Burger',
          description: 'Flame-grilled Angus beef patty, melted cheddar cheese, butter lettuce, tomato, caramelized onions, house sauce on a toasted brioche bun.',
          price: 16.50,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
          isAvailable: true,
          tags: ['Chef Special']
        },
        {
          name: 'Neapolitan Margherita Pizza',
          description: 'Wood-fired sourdough crust topped with San Marzano tomato sauce, fresh mozzarella di bufala, extra virgin olive oil, and fresh basil.',
          price: 14.00,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60',
          isAvailable: true,
          tags: ['Vegetarian']
        },
        {
          name: 'Pan-Seared Atlantic Salmon',
          description: 'Crispy skin salmon served over roasted asparagus and garlic herb mashed potatoes, drizzled with lemon butter glaze.',
          price: 24.50,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1485962398705-ef6a17c268a0?w=500&auto=format&fit=crop&q=60',
          isAvailable: true,
          tags: ['Gluten-Free']
        },
        {
          name: 'Decadent Lava Cake',
          description: 'Warm chocolate cake with a molten chocolate center, served with a scoop of premium vanilla bean ice cream and raspberry coulis.',
          price: 8.50,
          category: 'Desserts',
          image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60',
          isAvailable: true,
          tags: ['Sweet']
        },
        {
          name: 'Premium Matcha Latte',
          description: 'Stone-ground Japanese green tea whisked with organic honey and steamed oat milk.',
          price: 5.50,
          category: 'Beverages',
          image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60',
          isAvailable: true,
          tags: ['Vegan']
        }
      ];
      await MenuItem.insertMany(items);
      console.log('Database seeded with default menu items');
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};
seedMenu();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = { app, server };
