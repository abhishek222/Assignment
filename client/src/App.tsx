import React, { useEffect, useState } from 'react';
import { type Todo } from './types';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    fetch('/api/todos')
      .then((res) => res.json())
      .then(setTodos);
  }, []);

  const addTodo = async (todo: Omit<Todo, 'id'>) => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });

    const newTodo = await res.json();
    setTodos((prev) => [...prev, newTodo]);
    setEditingTodo(null);
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    const updated = await res.json();

    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    setEditingTodo(null);
  };

  const deleteTodo = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    setTodos(todos.filter((t) => t.id !== id));
  };

  const completeTodo = async (id: string, completed: boolean) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div style={{ width: 600, padding: 16 }}>
        <h1 style={{ textAlign: 'center' }}>To-Do List</h1>

        <TaskForm
          key={editingTodo?.id || 'new'}
          editingTodo={editingTodo}
          onAdd={addTodo}
          onUpdate={updateTodo}
        />

        <TaskList
          todos={todos}
          onEdit={(id) => {
            const todo = todos.find((t) => t.id === id);
            if (todo) setEditingTodo(todo);
          }}
          onDelete={deleteTodo}
          onComplete={completeTodo}
        />
      </div>
    </div>
  );
};

export default App;
