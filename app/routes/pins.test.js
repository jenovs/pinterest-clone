const app = require('./../server-test');
// const app = require('./../server');
// const request = require('supertest');
const expect = require('expect');
const { seed, creatorsList, pinsList } = require('./../seed/seed');
const Pin = require('./../models/pin');
const Creator = require('./../models/creator');

describe('Test /api/pins router', () => {
  beforeEach(done => {
    seed(done);
  });

  describe('GET /api/pins', () => {

    it('Should get all pins', (done) => {
      app
      .get('/api/pins')
      .expect(200)
      .expect(res => {
        const d = res.body;
        expect(d.length).toBe(4);
        expect(d[0]._id).toEqual(pinsList[0]._id);
        expect(d[0]._creator._id).toEqual(pinsList[0]._creator);
        expect(d[0].imageUrl).toBe(pinsList[0].imageUrl);
        expect(d[3]._id).toEqual(pinsList[3]._id);
        expect(d[3]._creator._id).toEqual(pinsList[3]._creator);
        expect(d[3].imageUrl).toBe(pinsList[3].imageUrl);
      })
      .end(done);
    })
  });

});
