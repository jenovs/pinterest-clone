const { app } = require('./server');
const request = require('supertest');

module.exports = request(app);
