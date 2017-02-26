const app = require('./../server-test');
const expect = require('expect');
const { seed, creatorsList, pinsList } = require('./../seed/seed');
const Pin = require('./pin.model');

const { PORT } = process.env;

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

  const user = {
    _id: creatorsList[0]._id,
    username: creatorsList[0].username
  };

  describe('GET /api/pins', () => {

    it('Should get all pins sorted from newest', (done) => {
      app
      .get('/api/pins')
      .expect(200)
      .expect(res => {
        const d = res.body;
        expect(d.length).toBe(4);
        expect(d[0]._id).toEqual(pinsList[3]._id);
        expect(d[0]._creator._id).toEqual(pinsList[3]._creator);
        expect(d[0].imageUrl).toBe(pinsList[3].imageUrl);
        expect(d[3]._id).toEqual(pinsList[0]._id);
        expect(d[3]._creator._id).toEqual(pinsList[0]._creator);
        expect(d[3].imageUrl).toBe(pinsList[0].imageUrl);
      })
      .end(done);
    })
  });

  describe('POST /api/pins', () => {

    // TODO add image validation check

    const newPin = {
      caption: 'A new pin',
      imageUrl: `http://localhost:${3005}/img/test_image.jpg`
    }

    it('Should add a pin', (done) => {
      app
      .post('/api/pins')
      .set('x-test-user', JSON.stringify(user))
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
      .end(err => {
        if (err) return done(err);
        assertPinCount(done);
      });
    });

    it('Should not add pin if imageUrl is missing', (done) => {
      app
      .post('/api/pins/')
      .set('x-test-user', JSON.stringify(user))
      .send({caption: newPin.caption})
      .expect(400)
      .end(err => {
        if (err) return done(err);
        assertPinCount(done)
      });
    });

    it('Should not add pin if caption is missing', (done) => {
      app
      .post('/api/pins/')
      .set('x-test-user', JSON.stringify(user))
      .send({imageUrl: newPin.imageUrl})
      .expect(400)
      .end(err => {
        if (err) return done(err);
        assertPinCount(done)
      });
    });

    it('Should not add pin if both caption and imageUrl are missing', (done) => {
      app
      .post('/api/pins')
      .set('x-test-user', JSON.stringify(user))
      .send({})
      .expect(400)
      .end(err => {
        if (err) return done(err);
        assertPinCount(done)
      });
    });
  });

  describe('DELETE /api/pins/:id', () => {

    it('Should delete my a pin by id', (done) => {
      app
      .delete(`/api/pins/${pinsList[0]._id}`)
      .set('x-test-user', JSON.stringify(user))
      .expect(200)
      .end(err => {
        if (err) done(err);

        Pin.find()
        .then(pins => {
          expect(pins.length).toBe(pinsList.length - 1);
          expect(pins.indexOf(pinsList[0]._id)).toBe(-1);
          done();
        })
        .catch(e => done(e));
      });
    });

    it('Should return 401 if unauthorized', (done) => {
      app
      .delete(`/api/pins/${pinsList[0]._id}`)
      .expect(401)
      .end(err => {
        if (err) return done(err);
        assertPinCount(done);
      });
    });

    it('Should handle invalid pin id', (done) => {
      app
      .delete('/api/pins/123abc')
      .set('x-test-user', JSON.stringify(user))
      .expect(400)
      .end(err => {
        if (err) return done(err);
        assertPinCount(done)
      });
    });

    it('Should not delete pin I do not own', (done) => {
      app
      .delete(`/api/pins/${pinsList[2]._id}`)
      .set('x-test-user', JSON.stringify(user))
      .expect(400)
      .end(err => {
        if (err) return done(err);
        assertPinCount(done)
      });
    });
  });

  describe('PUT /api/pins', () => {

    it('Should add my like to pin', (done) => {
      app
      .put(`/api/pins/${pinsList[2]._id}`)
      .set('x-test-user', JSON.stringify(user))
      .expect(200)
      .end(err => {
        if (err) return done(err);

        Pin.findById(pinsList[2]._id)
        .then(pin => {
          expect(pin.likedBy.length).toBe(1);
          expect(pin.likedBy[0]).toEqual(user._id);
          done();
        })
        .catch(e => done(e));
      });
    });

    it('Should remove my like from pin', (done) => {
      app
      .put(`/api/pins/${pinsList[3]._id}`)
      .set('x-test-user', JSON.stringify(user))
      .expect(200)
      .end(err => {
        if (err) return done(err);

        Pin.findById(pinsList[3]._id)
        .then(pin => {
          expect(pin.likedBy.length).toBe(0);
          done();
        })
        .catch(e => done(e));
      });
    });

    it('Should return 401 if unauthorized', (done) => {
      app
      .delete(`/api/pins/${pinsList[0]._id}`)
      .expect(401)
      .end(err => {
        if (err) return done(err);
        assertPinCount(done);
      });
    })
  });
});
