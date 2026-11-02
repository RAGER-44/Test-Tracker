const express = require('express');

const app = express();
const PORT = 3000;

// In-memory data store
let resources = [
  { id: 1, title: 'Set up project', status: 'done' },
  { id: 2, title: 'Write API endpoints', status: 'in-progress' }
];
let nextId = 3;

// Middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// GET all
app.get('/api/resources', (req, res) => {
  res.json(resources);
});

// GET one
app.get('/api/resources/:id', (req, res) => {
  const item = resources.find((r) => r.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Resource not found' });
  res.json(item);
});

// POST create
app.post('/api/resources', (req, res) => {
  const newItem = { id: nextId++, ...req.body };
  resources.push(newItem);
  res.status(201).json(newItem);
});

// PUT update (id is protected from being overwritten)
app.put('/api/resources/:id', (req, res) => {
  const item = resources.find((r) => r.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Resource not found' });
  const { id, ...updates } = req.body;
  Object.assign(item, updates);
  res.json(item);
});

// DELETE
app.delete('/api/resources/:id', (req, res) => {
  const index = resources.findIndex((r) => r.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Resource not found' });
  const [removed] = resources.splice(index, 1);
  res.json(removed);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
