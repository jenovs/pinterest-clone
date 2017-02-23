const app = require('./../server-test');
// const app = require('./../server');
// const request = require('supertest');
const expect = require('expect');
const { seed, usersList, booksList } = require('./../seed/seed');
const Pin = require('./../models/pin');
const Creator = require('./../models/creator');

describe('Test /api/pins router', () => {
  beforeEach(done => {
    seed(done);
  });

  it('should seed db and run tests', (done) => {
    console.log('running tests...');
    done();
  });

});
