import request from 'supertest';
import app from '../src/app.js';

describe('Campus Store public API', () => {
  test('GET / returns the health message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/Campus Store API/);
  });

  test('an unknown route returns 404 JSON', async () => {
    const response = await request(app).get('/does-not-exist');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });

  test('Helmet adds a content security policy header', async () => {
    const response = await request(app).get('/');
    expect(response.headers['content-security-policy']).toBeDefined();
  });
});
