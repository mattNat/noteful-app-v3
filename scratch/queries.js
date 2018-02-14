const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

// // find
// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const searchTerm = 'lady gaga';
//     let filter = {};

//     if (searchTerm) {
//       const re = new RegExp(searchTerm, 'i');
//       filter.title = { $regex: re };
//     }

//     return Note.find(filter)
//       .select('title created')
//       .sort('created')
//       .then(results => {
//         console.log(results);
//       })
//       .catch(console.error);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// get all items
mongoose.connect(MONGODB_URI)
  .then(() => {
    return Note.find()
      .select('title created')
      .sort('created')
      .then(results => {
        console.log(results);
      })
      .catch(console.error);
  })
  .then(() => {
    return mongoose.disconnect()
      .then(() => {
        console.info('Disconnected');
      });
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  })

// // find by id 
// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     return Note.findById('000000000000000000000007')
//       .select('title created')
//       .sort('created')
//       .then(results => {
//         console.log(results);
//       })
//       .catch(console.error);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// // create
// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     return Note.create({
//       title: 'Cats!!!',
//       content: 'Cats like tuna, so do I!'
//     })
//       .select('title created')
//       .sort('created')
//       .then(results => {
//         console.log(results);
//       })
//       .catch(console.error);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// // find by id and update
// const toUpdate = {
//   title: 'Cats!!!',
//   content: 'Cats like tuna, so do I!'
// }

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     return Note.findByIdAndUpdate('000000000000000000000007', {$set: {
//       title: 'Cats!!!',
//       content: 'Cats like tuna, so do I!'}}, {new: true}
//   )
//       // .select('title created')
//       // .sort('created')
//       .then(results => {
//         console.log(results);
//       })
//       .catch(console.error);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// // find by id and remove
// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     return Note.findByIdAndRemove('000000000000000000000003')
//       // .select('title created')
//       // .sort('created')
//       .then(results => {
//         console.log(results);
//       })
//       .catch(console.error);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });