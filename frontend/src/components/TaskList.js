import React from 'react';
import api from '../services/api';

const TaskList = ({ tasks, onUpdate, onDelete }) => {
  const handleToggle = async (task) => {
    try {
      const res = await api.patch(`/tasks/${task.id}`, { isDone: !task.isDone });
      onUpdate(res.data);
    } catch (err) {
      alert('Error updating task: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      onDelete(id);
    } catch (err) {
      alert('Error deleting task: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {tasks.length === 0 ? <p>No tasks found.</p> : tasks.map(task => (
        <li key={task.id} style={{ display: 'flex', alignItems: 'center', padding: '10px', border: '1px solid #ddd', margin: '10px 0' }}>
          <input type="checkbox" checked={task.isDone} onChange={() => handleToggle(task)} />
          <span style={{ marginLeft: '10px', textDecoration: task.isDone ? 'line-through' : 'none', flex: 1 }}>{task.title}</span>
          <span style={{ color: '#666' }}>({task.category})</span>
          {task.description && <p style={{ marginLeft: '10px', color: '#888', flex: 1 }}>{task.description}</p>}
          <button onClick={() => handleDelete(task.id)} style={{ marginLeft: 'auto', padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none' }}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;