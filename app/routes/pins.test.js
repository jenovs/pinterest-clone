const app = require('./../server-test');
// const app = require('./../server');
// const request = require('supertest');
const expect = require('expect');
const { seed, creatorsList, pinsList } = require('./../seed/seed');
const Pin = require('./../models/pin');
const Creator = require('./../models/creator');

const assertPinCount = (done) => {
  Pin.find()
  .then(pins => {
    expect(pins.length).toBe(pinsList.length);
    done();
  })
  .catch(e => done(e));
}

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

  describe('POST /api/pins', () => {

    const newPin = {
      caption: 'A new pin',
      imageUrl: 'https://example.com/image.png'
    }

    const username = creatorsList[0].username;

    it('Should add a pin', (done) => {
      app
      .post('/api/pins')
      .set('x-test-user', username)
      .send(newPin)
      .expect(200)
      .end(err => {
        if (err) return done(err);
        Pin.find()
        .then(pins => {
          expect(pins.length).toBe(5);
          expect(pins[4].caption).toBe(newPin.caption);
          expect(pins[4].imageUrl).toBe(newPin.imageUrl);
          expect(pins[4]._creator).toEqual(creatorsList[0]._id);
          return Creator.findOne({username})
        })
        .then(creator => {
          expect(creator.pins.length).toBe(3);
          expect(creator.pins[2]).toBeAn('object');
          done();
        })
        .catch(e => done(e));
      });
    });

    it('Should return 401 if unauthorized', (done) => {
      app
      .post('/api/pins')
      .send(newPin)
      .expect(401)
      .end(done);
    });

    it('Should not add pin if imageUrl is missing', (done) => {
      app
      .post('/api/pins/')
      .set('x-test-user', username)
      .send({caption: newPin.caption})
      .expect(400)
      .end(err => {
        if (err) done(err);
        assertPinCount(done)
      });
    });

    it('Should not add pin if caption is missing', (done) => {
      app
      .post('/api/pins/')
      .set('x-test-user', username)
      .send({imageUrl: newPin.imageUrl})
      .expect(400)
      .end(err => {
        if (err) done(err);
        assertPinCount(done)
      });
    });

    it('Should not add pin if both caption and imageUrl are missing', (done) => {
      app
      .post('/api/pins')
      .set('x-test-user', username)
      .send({})
      .expect(400)
      .end(err => {
        if (err) done(err);
        assertPinCount(done)
      });
    });
  });
});
