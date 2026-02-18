import request from 'supertest';
import { app } from '../app';

describe('Todo API', () => {
  let todoId: string;

  it('GET /api/todos -> should return array', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/todos -> create todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'Test Todo', dueDate: '2026-01-01' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Todo');
    todoId = res.body.id;
  });

  it('PATCH /api/todos/:id -> mark complete', async () => {
    const res = await request(app)
      .patch(`/api/todos/${todoId}`)
      .send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('PUT /api/todos/:id -> update todo', async () => {
    const res = await request(app)
      .put(`/api/todos/${todoId}`)
      .send({ title: 'Updated Todo' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Todo');
  });

  it('DELETE /api/todos/:id -> delete todo', async () => {
    const res = await request(app).delete(`/api/todos/${todoId}`);
    expect(res.status).toBe(200);
  });

  it('POST /api/todos -> should fail if missing fields', async () => {
    const res = await request(app).post('/api/todos').send({ title: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('PUT /api/todos/:id -> should return 404 for invalid id', async () => {
    const res = await request(app)
      .put('/api/todos/invalid-id')
      .send({ title: 'New' });
    expect(res.status).toBe(404);
  });

  it('DELETE /api/todos/:id -> should return 404 if not found', async () => {
    const res = await request(app).delete('/api/todos/invalid-id');
    expect(res.status).toBe(404);
  });

  it('PATCH /api/todos/:id -> should return 404 if not found', async () => {
    const res = await request(app)
      .patch('/api/todos/invalid-id')
      .send({ completed: true });
    expect(res.status).toBe(404);
  });
});
