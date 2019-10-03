const request = require('supertest');

const server = require('../api/server.js');

const db = require('../database/dbConfig.js');

describe('server.js', () => {
  it('should set environment to testing', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });
  describe('GET /api/jokes', () => {
    it('returns JSON', done => {
      request(server)
        .get('/api/jokes')
        .then(results => {
          expect(results.type).toMatch(/json/i);
          done();
        });
    });
    it('needs authorization', () => {
      return request(server)
        .get('/api/jokes')
        .then(results => {
          expect(results.status).toBe(400);
          expect(results.body.message).toBe('no credentials provided');
        });
    });
  });
});
describe('/api/auth/register', () => {
  beforeEach(async () => {
    await db('users').truncate();
  });
  it('returns JSON', done => {
    request(server)
      .post('/api/auth/register')
      .send({ username: 'Big', password: 'Big' })
      .then(results => {
        expect(results.type).toMatch(/json/i);
        done();
      });
  });
  it('returns 201', () => {
    return request(server)
      .post('/api/auth/register')
      .send({ username: 'Max', password: 'Max' })
      .then((res, err) => {
        expect(res.status).toBe(201);
      });
  });
});
describe('/api/auth/login', () => {
  it('returns json', done => {
    request(server)
      .post('/api/auth/login')
      .send({ username: 'Max', password: 'Max' })
      .then(res => {
        expect(res.type).toMatch(/json/i);
        done();
      });
  });
  it('returns status of 200', () => {
    return request(server)
      .post('/api/auth/login')
      .send({ username: 'Max', password: 'Max' })
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
});
