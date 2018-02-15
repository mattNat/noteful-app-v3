'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const folderSchema = new mongoose.Schema({
  name: { type: String, index: true, unique:true },
});

folderSchema.index({ name: 'text'});

folderSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Folder', folderSchema);