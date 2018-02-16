'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Tag = require('../models/tag');

// ENDPOINTS GO HERE
router.get('/tags', (req, res, next) => {
  const {searchTerm, tagId} = req.query;
  console.log(searchTerm, tagId);
  
})

module.exports = router;