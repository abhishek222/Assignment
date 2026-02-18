import { setupServer } from 'msw/node';
import { rest } from 'msw';

type Todo = {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
};

type TodoInput = Omit<Todo, 'id'>;
type TodoUpdate = Partial<Todo>;

let todos: Todo[] = [
  { id: '1', title: 'Initial Task', dueDate: '2099-01-01', completed: false },
];

export const server = setupServer(
  rest.get('/api/todos', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(todos));
  }),

  rest.post('/api/todos', async (req, res, ctx) => {
    const body = (await req.json()) as TodoInput;
    const newTodo: Todo = { id: String(Date.now()), ...body };
    todos.push(newTodo);
    return res(ctx.status(201), ctx.json(newTodo));
  }),

  rest.put('/api/todos/:id', async (req, res, ctx) => {
    const { id } = req.params as { id: string };
    const body = (await req.json()) as TodoUpdate;
    todos = todos.map((t) => (t.id === id ? { ...t, ...body } : t));
    return res(ctx.json(todos.find((t) => t.id === id)));
  }),

  rest.patch('/api/todos/:id', async (req, res, ctx) => {
    const { id } = req.params as { id: string };
    const body = (await req.json()) as TodoUpdate;
    todos = todos.map((t) => (t.id === id ? { ...t, ...body } : t));
    return res(ctx.json(todos.find((t) => t.id === id)));
  }),

  rest.delete('/api/todos/:id', (req, res, ctx) => {
    const { id } = req.params as { id: string };
    todos = todos.filter((t) => t.id !== id);
    return res(ctx.status(200));
  }),
);
