const request = require('supertest');
const server = require('../server/index.js');

describe('jest is testing written code', () => {

  test('that jest is working', () => {
    expect(2 + 1).toBe(3);
  });

});

describe('the express server is functioning properly', () => {

  afterAll(function (done) {
    mongoose.connection.close(() =>
      server.close(done)
    );
  });

  test('It should response the GET method', done => {
    request(server)
      .get('/')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  test('It shouldn\'t get something that doesn\'t extist', done => {
    request(server)
      .get('/nothing')
      .then(response => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });

  test('It should get data from the reviews', done => {
    request(server)
      .get('/reviews/45')
      .then(response => {
        expect(response.body.length).toBeGreaterThanOrEqual(0);
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  test('The server shopuld get post requests', done => {
    request(server)
      .post('/reviews')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  test('It should recieve a review', done => {
    request(server)
      .post('/reviews')
      .then(response => {
        expect(response.body).toBe('sent');
        expect(response.statusCode).toBe(200);
        done();
      });
  });

});