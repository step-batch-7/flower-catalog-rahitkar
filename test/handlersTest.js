const fs = require('fs');
const request = require('supertest');
const app = require('../lib/handlers');
const config = require('../lib/config');

describe('GET', () => {
  it('should give index.html for / path', done => {
    request(app.serve.bind(app))
      .get('/index.html')
      .set('Accept', 'text/html')
      .expect('Content-Type', 'text/html')
      .expect(200, done);
  });
  it('should give guestBook.html for /guestBook.html path', done => {
    request(app.serve.bind(app))
      .get('/guestBook.html')
      .set('Accept', 'text/html')
      .expect('Content-Type', 'text/html')
      .expect(200, done);
  });
  it('should give Abeliophyllum.html for /Abeliophyllum.html path', done => {
    request(app.serve.bind(app))
      .get('/Abeliophyllum.html')
      .set('Accept', 'text/html')
      .expect('Content-Type', 'text/html')
      .expect(200, done);
  });
  it('should give Agerantum.html for /Agerantum.html path', done => {
    request(app.serve.bind(app))
      .get('/Agerantum.html')
      .set('Accept', 'text/html')
      .expect('Content-Type', 'text/html')
      .expect(200, done);
  });
  it('should give style.css for /css/style.css path', done => {
    request(app.serve.bind(app))
      .get('/css/style.css')
      .set('Accept', 'text/css')
      .expect('Content-Type', 'text/css')
      .expect(200, done);
  });
  it('should respond with jpg', function(done) {
    request(app.serve.bind(app))
      .get('/img/freshorigins.jpg')
      .set('Accept', '*/*')
      .expect('Content-Type', 'image/jpeg')
      .expect(200, done);
  });
});

describe('GET /badFile.html', function() {
  it('should respond with "not found"', function(done) {
    request(app.serve.bind(app))
      .get('/badFile.html')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});

describe('POST /guestBook.html', function() {
  it('should respond with "redirect and write to config path', function(done) {
    request(app.serve.bind(app))
      .post('/guestBook.html')
      .send('name=Tom&comment=HeyJerry')
      .set('Accept', '*/*')
      .expect(303, done)
      .expect(res => {
        res.headers.location === 'guestBook.html';
      });
  });
  after(() => {
    fs.truncateSync(config.DATA_STORE);
  });
});

