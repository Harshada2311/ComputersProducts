const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const wishlistRoutes = require('./routes/wishlist');
const authMiddleware = require('./middleware/auth');

dotenv.config();
const app = express();
const allowed = ['http://localhost:3000', 'https://hardwareinventorystore.netlify.app'];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

//app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

app.use('/auth', authRoutes);
app.use('/products', authMiddleware, productRoutes);
app.use('/wishlist', authMiddleware, wishlistRoutes);

const PORT = process.env.PORT || 5009;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
