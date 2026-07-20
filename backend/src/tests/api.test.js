const request = require('supertest');
const mongoose = require('mongoose');

// Mock Mongoose connection before importing server.js
jest.spyOn(mongoose, 'connect').mockImplementation(async () => {
  console.log('Mocked MongoDB Connection Successful');
  return {
    connection: { host: 'mocked-mongodb-host' }
  };
});

jest.spyOn(mongoose.connection, 'close').mockImplementation(async () => {
  return true;
});

const { app, server } = require('../server');

describe('API Health Checks', () => {
  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    await mongoose.connection.close();
  });

  it('should return API running message on root route', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Smart Restaurant API is running');
  });
});
