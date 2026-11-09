require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const resourceRoutes = require('./routes/resources');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes (/api/items is an alias of /api/resources)
app.use('/api/resources', resourceRoutes);
app.use('/api/items', resourceRoutes);

// Unknown routes
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler: validation problems become 400s
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// Connect to MongoDB first, then start listening
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
