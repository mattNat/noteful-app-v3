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

  // method for posting
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

  // TESTING STRATEGY EXAMPLE
  // describe('GET /v3/notes/:id', function () {
  //   it('should return correct notes', function () {
  //     let data;
  //     // 1) First, call the database
  //     return Note.findOne().select('id title content')
  //       .then(_data => {
  //         data = _data;
  //         // 2) **then** call the API
  //         return chai.request(app).get(`/v3/notes/${data.id}`);
  //       })
  //       .then((res) => {
  //         expect(res).to.have.status(200);
  //         expect(res).to.be.json;

  //         expect(res.body).to.be.an('object');
  //         expect(res.body).to.have.keys('id', 'title', 'content');

  //         // 3) **then** compare
  //         expect(res.body.id).to.equal(data.id);
  //         expect(res.body.title).to.equal(data.title);
  //         expect(res.body.content).to.equal(data.content);
  //       });
  //   });
  // })

  // TEST GET endpoint
  describe('GET endpoint', function() {
    it('return all existing notes', function() {
      let res;

      return chai.request(app)
        .get('/v3/notes')
        .then(function(_res) {
          // console.log('RES IS: ', Object.keys(_res));
          res = _res;

          // console.log('RES BODY NOTES is: ', res.body.length);
          
          expect(res).to.have.status(200);
          expect(res.body).to.have.length.of.at.least(1);
          
          // console.log('Note COUNT is: ', Note.count());
          
          return Note.count();
        })
        .then(function(countVal) {
          // console.log('RES BODY is: \n', res.body);
          expect(res.body).to.have.length(countVal);
        });
    });
  });

  // TEST return notes with the right fields
  it('should return notes with the right fields', function() {
    let resNote;
    
    return chai.request(app)
      .get('/v3/notes')
      .then(function(res) {
        // console.log('RES is: \n', res);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length.of.at.least(1);
        
        res.body.forEach(function(note) {
          // console.log('NOTE is: \n', note);
          expect(note).to.be.a('object');
          expect(note).to.include.keys('id', 'title', 'content', 'created');
        })

        resNote = res.body;
        // console.log('resNote is: \n', resNote[0]);
        Note.findById(resNote.id)
          .then(id => {
            console.log('id is: \n\n', id);
            
          })
        console.log('Note find by ID is: \n', Note.findById(resNote.id));
        
      })
  })

  it('should return correct search results for a searchTerm query', function () {
    const term = 'gaga';
    const dbPromise = Note.find(
      { $text: { $search: term } },
      { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } });
    const apiPromise = chai.request(app).get(`/v3/notes?searchTerm=${term}`);

    return Promise.all([dbPromise, apiPromise])
      .then(([data, res]) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(1);
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0].id).to.equal(data[0].id);
      });
  });

  it('should return an empty array for an incorrect query', function () {
    const dbPromise = Note.find({ title: { $regex: /NotValid/i } });
    const apiPromise = chai.request(app).get('/v3/notes?searchTerm=NotValid');

    return Promise.all([dbPromise, apiPromise])
      .then(([data, res]) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(data.length);
      });
  });

});

describe('GET /v3/notes/:id', function () {

  it('should return correct notes', function () {
    let data;
    return Note.findOne().select('id title content')
      .then(_data => {
        data = _data;
        return chai.request(app).get(`/v3/notes/${data.id}`);
      })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;

        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('id', 'title', 'content');

        expect(res.body.id).to.equal(data.id);
        expect(res.body.title).to.equal(data.title);
        expect(res.body.content).to.equal(data.content);
      });
  });

  it('should respond with a 400 for improperly formatted id', function () {
    const badId = '99-99-99';
    const spy = chai.spy();
    return chai.request(app)
      .get(`/v3/notes/${badId}`)
      .then(spy)
      .then(() => {
        expect(spy).to.not.have.been.called();
      })
      .catch(err => {
        const res = err.response;
        expect(res).to.have.status(400);
        expect(res.body.message).to.eq('The `id` is not valid');
      });
  });

  it('should respond with a 404 for an invalid id', function () {
    const spy = chai.spy();
    return chai.request(app)
      .get('/v3/notes/AAAAAAAAAAAAAAAAAAAAAAAA')
      .then(spy)
      .then(() => {
        expect(spy).to.not.have.been.called();
      })
      .catch(err => {
        expect(err.response).to.have.status(404);
      });
  });

});

describe('POST /v3/notes', function () {

  it('should create and return a new item when provided valid data', function () {
    const newItem = {
      'title': 'The best article about cats ever!',
      'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
      'tags': []
    };
    let body;
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
        return Note.findById(body.id);
      })
      .then(data => {
        expect(body.title).to.equal(data.title);
        expect(body.content).to.equal(data.content);
      });
  });

  it('should return an error when missing "title" field', function () {
    const newItem = {
      'foo': 'bar'
    };
    const spy = chai.spy();
    return chai.request(app)
      .post('/v3/notes')
      .send(newItem)
      .then(spy)
      .then(() => {
        expect(spy).to.not.have.been.called();
      })
      .catch(err => {
        const res = err.response;
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });

});

describe('PUT /v3/notes/:id', function () {

  it('should update the note', function () {
    const updateItem = {
      'title': 'What about dogs?!',
      'content': 'woof woof'
    };
    let data;
    return Note.findOne().select('id title content')
      .then(_data => {
        data = _data;
        return chai.request(app)
          .put(`/v3/notes/${data.id}`)
          .send(updateItem);
      })
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');

        expect(res.body.id).to.equal(data.id);
        expect(res.body.title).to.equal(updateItem.title);
        expect(res.body.content).to.equal(updateItem.content);
      });
  });


  it('should respond with a 400 for improperly formatted id', function () {
    const updateItem = {
      'title': 'What about dogs?!',
      'content': 'woof woof'
    };
    const badId = '99-99-99';
    const spy = chai.spy();
    return chai.request(app)
      .put(`/v3/notes/${badId}`)
      .send(updateItem)
      .then(spy)
      .then(() => {
        expect(spy).to.not.have.been.called();
      })
      .catch(err => {
        const res = err.response;
        expect(res).to.have.status(400);
        expect(res.body.message).to.eq('The `id` is not valid');
      });
  });

  it('should respond with a 404 for an invalid id', function () {
    const updateItem = {
      'title': 'What about dogs?!',
      'content': 'woof woof'
    };
    const spy = chai.spy();
    return chai.request(app)
      .put('/v3/notes/AAAAAAAAAAAAAAAAAAAAAAAA')
      .send(updateItem)
      .then(spy)
      .then(() => {
        expect(spy).to.not.have.been.called();
      })
      .catch(err => {
        expect(err.response).to.have.status(404);
      });
  });

  it('should return an error when missing "title" field', function () {
    const updateItem = {
      'foo': 'bar'
    };
    const spy = chai.spy();
    return chai.request(app)
      .put('/v3/notes/9999')
      .send(updateItem)
      .then(spy)
      .then(() => {
        expect(spy).to.not.have.been.called();
      })
      .catch(err => {
        const res = err.response;
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });

});

describe('DELETE  /v3/notes/:id', function () {

  it('should delete an item by id', function () {
    let data;
    return Note.findOne().select('id title content')
      .then(_data => {
        data = _data;
        return chai.request(app).delete(`/v3/notes/${data.id}`);
      })
      .then(function (res) {
        expect(res).to.have.status(204);
      });
  });

  it('should respond with a 404 for an invalid id', function () {
    const spy = chai.spy();
    return chai.request(app)
      .delete('/v3/notes/AAAAAAAAAAAAAAAAAAAAAAAA')
      .then(spy)
      .then(() => {
        expect(spy).to.not.have.been.called();
      })
      .catch(err => {
        expect(err.response).to.have.status(404);
      });
  });

})

