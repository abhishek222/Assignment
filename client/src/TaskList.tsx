import React from 'react';
import { type Todo } from './types';

interface TaskListProps {
  todos: Todo[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string, completed: boolean) => void;
}

const getRowColor = (todo: Todo) => {
  const today = new Date().toISOString().split('T')[0];
  if (todo.completed) return '#d4edda'; // light green
  if (todo.dueDate < today) return '#f8d7da'; // light red
  if (todo.dueDate === today) return '#fff3cd'; // light yellow
  return 'white';
};

const TaskList: React.FC<TaskListProps> = ({
  todos,
  onEdit,
  onDelete,
  onComplete,
}) => {
  if (!todos || todos.length === 0) {
    return (
      <div style={{ marginTop: 20, textAlign: 'center', color: '#777' }}>
        No tasks yet. Add your first task above!
      </div>
    );
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Title</th>
          <th>Due Date</th>
          <th>Completed</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {todos.map((todo) => (
          <tr key={todo.id} style={{ background: getRowColor(todo) }}>
            <td>{todo.title}</td>
            <td>{todo.dueDate}</td>
            <td style={{ textAlign: 'center' }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => onComplete(todo.id, e.target.checked)}
              />
            </td>
            <td style={{ textAlign: 'center' }}>
              <div
                style={{ display: 'flex', justifyContent: 'center', gap: 8 }}
              >
                <button onClick={() => onEdit(todo.id)}>Edit</button>
                <button onClick={() => onDelete(todo.id)}>Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskList;
