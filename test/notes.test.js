'use strict';
const app = require('../server');

const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSpies = require('chai-spies');
const mongoose = require('mongoose');
const expect = chai.expect;

const { TEST_MONGODB_URI } = require('../config');
const seedNotes = require('../db/seed/notes');
const Note = require('../models/note')

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Notes API resource', function() {
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { autoIndex: false });
  });

  beforeEach(function () {
    // console.log(seedNotes);
    
    return Note.insertMany(seedNotes)
      .then(() => Note.ensureIndexes());
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('POST /v3/notes', function () {
    it('should create and return a new item when provided valid data', function () {
      const newItem = {
        'title': 'The best article about cats ever!',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
        'tags': []
      };
      let body;
      // 1) First, call the API
      return chai.request(app)
        .post('/v3/notes')
        .send(newItem)
        .then(function (res) {
          body = res.body;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.include.keys('id', 'title', 'content');
          // 2) **then** call the database
          return Note.findById(body.id);
        })
        // 3) **then** compare
        .then(data => {
          expect(body.title).to.equal(data.title);
          expect(body.content).to.equal(data.content);
        });
    });
  });

})

