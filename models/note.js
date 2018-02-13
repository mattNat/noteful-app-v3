const mongoose = require('mongoose');

// Mongoose internally uses a promise-like object,
// but it's better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
const {MONGODB_URI} = require('../config');
// const {Restaurant} = require('../models');

// console.log(DATABASE_URL);


const notesSchema = new mongoose.Schema({
  title:  {type: String, required: true},
  content: {type: String, required: true},
  create: {type: Date, default: Date.now},
});

const Note = mongoose.model('Note', notesSchema);

// Note.create

Note.create({
  title: 'Cats',
  content: 'Cats like tuna, so do I!'
});

module.exports = Note;