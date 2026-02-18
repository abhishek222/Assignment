import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const initialTodos = [
  {
    id: '0',
    title: 'Initial Task',
    dueDate: '2099-01-01',
    completed: false,
  },
];

beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (!options) {
      // GET /api/todos
      return Promise.resolve({
        json: () => Promise.resolve(initialTodos),
      } as Response);
    }
    const body = options.body ? JSON.parse(options.body.toString()) : null;

    if (options.method === 'POST') {
      return Promise.resolve({
        json: () => Promise.resolve({ ...body, id: '1' }),
      } as Response);
    }

    if (options.method === 'PUT' || options.method === 'PATCH') {
      return Promise.resolve({
        json: () => Promise.resolve({ ...body, id: url?.split('/').pop() }),
      } as Response);
    }

    if (options.method === 'DELETE') {
      return Promise.resolve({ status: 200 } as Response);
    }

    return Promise.resolve({
      json: () => Promise.resolve([]),
    } as Response);
  }) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
});

test('loads initial todos', async () => {
  render(<App />);
  const todoRow = await screen.findByTestId('todo-row-0');
  expect(todoRow).toBeInTheDocument();
  expect(screen.getByText('Initial Task')).toBeInTheDocument();
});

test('user can add todo', async () => {
  render(<App />);
  const titleInput = screen.getByTestId('task-title-input') as HTMLInputElement;
  const dueDateInput = screen.getByTestId('task-due-input') as HTMLInputElement;
  const submitButton = screen.getByTestId('task-submit-btn');

  await userEvent.type(titleInput, 'New Task');
  await userEvent.type(dueDateInput, '2099-12-31');
  await userEvent.click(submitButton);

  const newTodoRow = await screen.findByTestId('todo-row-1');
  expect(newTodoRow).toBeInTheDocument();
  expect(screen.getByText('New Task')).toBeInTheDocument();
});

test('user can mark todo as completed', async () => {
  render(<App />);
  const checkbox = (await screen.findByTestId(
    'todo-checkbox-0',
  )) as HTMLInputElement;
  expect(checkbox.checked).toBe(false);
  await userEvent.click(checkbox);
  await waitFor(() => expect(checkbox.checked).toBe(true));
});

test('user can edit todo', async () => {
  render(<App />);
  const editButton = await screen.findByTestId('edit-btn-0');
  await userEvent.click(editButton);

  const titleInput = screen.getByTestId('task-title-input') as HTMLInputElement;
  const submitButton = screen.getByTestId('task-submit-btn');

  fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
  await userEvent.click(submitButton);

  await waitFor(() =>
    expect(screen.getByText('Updated Task')).toBeInTheDocument(),
  );
});

test('user can delete todo', async () => {
  render(<App />);
  const deleteButton = await screen.findByTestId('delete-btn-0');
  await userEvent.click(deleteButton);

  await waitFor(() =>
    expect(screen.queryByTestId('todo-row-0')).not.toBeInTheDocument(),
  );
});
