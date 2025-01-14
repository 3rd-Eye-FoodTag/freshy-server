import request from 'supertest';
import express from 'express';
import userRoutes from './userRoutes';

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Routes', () => {
  test('GET /users should return a success message', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Fetch all users' });
  });

  test('POST /users should create a new user', async () => {
    const newUser = { name: 'John Doe' };
    const response = await request(app).post('/users').send(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'User created',
      user: newUser,
    });
  });
});
