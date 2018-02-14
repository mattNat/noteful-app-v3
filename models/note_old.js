const mongoose = require('mongoose');

// Mongoose internally uses a promise-like object,
// but it's better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
// const {MONGODB_URI} = require('../config');
// const {Restaurant} = require('../models');

// console.log(DATABASE_URL);


const noteSchema = new mongoose.Schema({
  title:  {type: String, index: true},
  content: String,
  create: {type: Date, default: Date.now},
});

noteSchema.index({ title: 'text', content: 'text' });

noteSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

// const Note = mongoose.model('Note', noteSchema);

// Note.create

// Note.create({
//   title: 'Cats',
//   content: 'Cats like tuna, so do I!'
// });

module.exports = mongoose.model('Note', noteSchema);
