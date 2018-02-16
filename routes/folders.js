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
  let sort = 'name'; // default sorting

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

// GET /folders by id
router.get('/folders/:id', (req, res, next) => {
  const { id } = req.params;
  // console.log(req.params);
  // console.log(req);
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Folder.findById(id)
    .select('_id name')
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

// POST /folders 
router.post('/folders', (req, res, next) => {
  const { name } = req.body;
  
  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  
  const newItem = { name };

  Folder.create(newItem)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    // add to post and put so you won't have duplicates
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The `folder` name already exists');
        err.status = 400;
      }
      next(err);
    });
});

// PUT /folders by id
router.put('/folders/:id', (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const updateItem = { name };
  const options = { new: true };

  Folder.findByIdAndUpdate(id, updateItem, options)
    .select('_id name')
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

// DELETE /folders by id
router.delete('/folders/:id', (req, res, next) => {
  const { id } = req.params;

  const deleteFolder = Folder.findOneAndRemove({_id: req.params.id});
  const deleteNotes  = Note.deleteMany({folderId: req.params.id});
  const resetFolderId = Note.update({folderId: req.params.id}, {$set: {folderId: null}});

  Promise.all([deleteFolder, resetFolderId])
    .then(folderResults => {
      const result = folderResults[0];
      if (result) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(next);

  // Folder.findByIdAndRemove(id)
  //   .then(count => {
  //     if (count) {
  //       res.status(204).end();
  //     } else {
  //       next();
  //     }
  //   })
  //   .catch(next);
});

module.exports = router;