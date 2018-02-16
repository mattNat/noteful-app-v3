'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Tag = require('../models/tag');

// ENDPOINTS GO HERE
// GET all /tags
router.get('/tags', (req, res, next) => {
  const {searchTerm, tagId} = req.query;
  console.log(req.query);
  
  Tag.find()
    .select('id name')
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(next);
})

// GET by id /tags
router.get('/tags/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Tag.findById(id)
    .select('id name')
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

// POST /tags
router.post('/tags', (req, res, next) => {
  const { name } = req.body;
  
  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  
  const newItem = { name };

  Tag.create(newItem)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(next);
});

module.exports = router;