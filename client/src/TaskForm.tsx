import React, { useState } from 'react';
import { type Todo } from './types';

interface TaskFormProps {
  onAdd: (todo: Omit<Todo, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  editingTodo: Todo | null;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onAdd,
  onUpdate,
  editingTodo,
}) => {
  const [title, setTitle] = useState(editingTodo?.title ?? '');
  const [dueDate, setDueDate] = useState(editingTodo?.dueDate ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    if (editingTodo) {
      onUpdate(editingTodo.id, { title, dueDate });
    } else {
      onAdd({ title, dueDate, completed: false });
      // Clear input after adding new task
      setTitle('');
      setDueDate('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="task-form"
      style={{ marginBottom: 16, display: 'flex', width: '100%', gap: 8 }}
    >
      <input
        type="text"
        placeholder="Task title"
        data-testid="task-title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ flex: 1, padding: '8px' }}
      />
      <input
        type="date"
        aria-label="Due date"
        data-testid="task-due-input"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={{ width: 150, padding: '8px' }}
      />
      <button type="submit" data-testid="task-submit-btn">
        {editingTodo ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;
