'use strict';

// exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://admin:admin123@localhost/tempTestDb?authSource=admin';
// exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://admin:admin123@localhost/test-restaurants-app?authSource=admin';
// exports.PORT = process.env.PORT || 8080;

exports.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost/noteful-app?authSource=admin';
exports.PORT = process.env.PORT || 8080;