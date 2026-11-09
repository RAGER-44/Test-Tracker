const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');

const router = express.Router();

// Only these fields can be set by the client (so _id can't be overwritten)
const FIELDS = ['title', 'status'];
const pick = (body) =>
  Object.fromEntries(FIELDS.filter((f) => body[f] !== undefined).map((f) => [f, body[f]]));

// A malformed id can never match a document, so treat it as "not found"
const validId = (id) => mongoose.Types.ObjectId.isValid(id);
const notFound = (res) => res.status(404).json({ error: 'Resource not found' });

// GET all
router.get('/', async (req, res, next) => {
  try {
    res.json(await Task.find().sort({ createdAt: 1 }));
  } catch (err) {
    next(err);
  }
});

// GET one
router.get('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return notFound(res);
    const task = await Task.findById(req.params.id);
    if (!task) return notFound(res);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// POST create: validate, insert, return the saved document with 201
router.post('/', async (req, res, next) => {
  try {
    const task = await Task.create(pick(req.body));
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// PUT update: only the fields that were sent are changed
router.put('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return notFound(res);
    const task = await Task.findByIdAndUpdate(req.params.id, pick(req.body), {
      new: true, // return the updated document
      runValidators: true // apply the schema rules to the update too
    });
    if (!task) return notFound(res);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE: remove permanently and return the deleted task
router.delete('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return notFound(res);
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return notFound(res);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
