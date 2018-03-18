'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Note = require('../models/note');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/notes', (req, res, next) => {
  console.log('REQ is:', req.body);

  Note.find()
    // .select('title content')
    // .sort(sort)
    .then(note => {
    res.json(note);
  })
  .catch(next)
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/notes/:id', (req, res, next) => {
  // console.log('req.params is:', req.params);
  const { id } = req.params;
  // console.log(id);

  Note.findById(id)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next()
      }
    })
    .catch(next)
})

/* ========== POST/CREATE AN ITEM ========== */
router.post('/notes', (req, res, next) => {
  console.log(req.body);
  const { title, content } = req.body;

  // passes a new error down if title not provided
  if (!title) {
    const err = new Error('Missing title in body');
    err.status = 400;
    // this passes the err to be handled
    return next(err);
  }

  // passes a new error down if title not provided
  if (!content) {
    const err = new Error('Missing content in body');
    err.status = 400;
    // this passes the err to be handled
    return next(err);
  }

  const newItem = { title, content };

  Note.create(newItem)
    .then(result => {
      console.log('RESULT IS:', result);
      console.log('req.originalUrl is:', req.originalUrl);
      console.log('result.id is:', result.id);
      // responsible for sending a response back to the url
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(next);
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/notes/:id', (req, res, next) => {
  // console.log(req.params);
  // console.log(req.body);
  const { id } = req.params;
  const { title, content } = req.body;

  const updateItem = { title, content };
  Note.findByIdAndUpdate(id, updateItem, {new: true})
    .then(result => {
      if (result) {
        console.log('RESULT IS:', result);
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {
  const { id } = req.params;

  Note.findByIdAndRemove(id)
    .then(count => {
      // console.log('COUNT IS:', count);
      if (count) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(next);
})

module.exports = router;