import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 4000;
const TODOS_PATH = path.join(__dirname, 'todos.json');

app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limit JSON body to 10kb - Prevent large payload attack

interface Todo {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}
async function readTodos(): Promise<Todo[]> {
  try {
    const data = await fs.readFile(TODOS_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeTodos(todos: Todo[]) {
  await fs.writeFile(TODOS_PATH, JSON.stringify(todos, null, 2));
}
app.get('/api/todos', async (req, res) => {
  res.json(await readTodos());
});

app.post('/api/todos', async (req, res) => {
  const { title, dueDate } = req.body;
  if (!title || !dueDate)
    return res.status(400).json({ error: 'Title and due date required.' });
  const todo: Todo = { id: uuidv4(), title, dueDate, completed: false };
  const todos = await readTodos();
  todos.push(todo);
  await writeTodos(todos);
  res.status(201).json(todo);
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, dueDate } = req.body;
  const todos = await readTodos();
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  if (title) todos[idx].title = title;
  if (dueDate) todos[idx].dueDate = dueDate;
  await writeTodos(todos);
  res.json(todos[idx]);
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  let todos = await readTodos();
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const deleted = todos[idx];
  todos = todos.filter((t) => t.id !== id);
  await writeTodos(todos);
  res.json(deleted);
});

app.patch('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const todos = await readTodos();
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  todos[idx].completed = completed;
  await writeTodos(todos);
  res.json(todos[idx]);
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
