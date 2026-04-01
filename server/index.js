require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    /\.vercel\.app$/,
    /\.onrender\.com$/,
  ],
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/forum', require('./routes/forum'));
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/admin', require('./routes/admin'));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);