const mongoose = require('mongoose');
const app = require('../app');
const supertest = require('supertest');
const api = supertest(app);
const User = require('../models/userModel');

beforeEach(async () => {
  await User.deleteMany({});
  await User.create({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'janedoe1@mail.com',
    password: 'Password0!',
  });
});

describe('POST request to /api/login', () => {
  test('is successful if user is registered in the database', async () => {
    const response = await api
      .post('/users/login')
      .send({
        email: 'janedoe1@mail.com',
        password: 'Password0!',
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
  });

  test('returns error if incorrect details are sent', async () => {
    const response = await api
      .post('/users/login')
      .send({
        email: 'janedoe1@mail.com',
      })
      .expect(403);

    expect(response.body).not.toHaveProperty('token');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
