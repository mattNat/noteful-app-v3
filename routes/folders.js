const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
// added but not in problem statement
mongoose.Promise = global.Promise;

const Folder = require('../models/folder');
const Note = require('../models/note');

// FOLDER ROUTER ENDPOINTS HERE

// GET all /folders
router.get('/folders', (req, res, next) => {
  const { searchTerm } = req.query;

  let filter = {};
  let projection = {};
  let sort = 'created'; // default sorting

  if (searchTerm) {
    filter.$text = { $search: searchTerm };
    projection.score = { $meta: 'textScore' };
    sort = projection;
  }

  Folder.find(filter, projection)  
  // Folder.find()
    .select('_id name')
    .sort(sort)
    .then(results => {
      console.log(results);
      res.json(results);
    })
    .catch(next);
});

// // GET /folders by id
// router.get('/folders/:id', (req, res, next) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     const err = new Error('The `id` is not valid');
//     err.status = 400;
//     return next(err);
//   }

//   Note.findById(id)
//     .select('id title content')
//     .then(result => {
//       if (result) {
//         res.json(result);
//       } else {
//         next();
//       }
//     })
//     .catch(next);
// });

module.exports = router;