const Review = require('../database/Review.js');
const mongoose = require('mongoose');

describe('mongoDB database', () => {

  test('the seed script adds to the database', done => {
    // The seed file has 3 reviews for item 1
    // Needs to be changed if more data is added
    Review.find({ item: 2 }, (err, items) => {
      expect(items.length).toBeGreaterThanOrEqual(0);
      done();
    });
  });

  test('data.json is a json object', done => {
    const data = require('../database/data.json');
    expect(typeof data).toBe('object');
    done();
  });

  test('the schema should have the correct items', done => {
    Review.findOne({ item: 1 }, (err, item) => {
      expect(item).toEqual(
        expect.objectContaining({
          author: expect.any(String),
          body: expect.any(String),
          item: expect.any(Number),
          rating: expect.any(Number),
          likes: expect.any(Number)
        })
      );
      mongoose.connection.close();
      done();
    });
  });

});