import React, { useState } from 'react';
import api from '../services/api';

const TaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('personal');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title required');
    try {
      const res = await api.post('/tasks', { title, description, category });
      onAdd(res.data);
      setTitle(''); setDescription(''); setCategory('personal');
    } catch (err) {
      alert('Error adding task: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd' }}>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', margin: '10px 0', padding: '8px' }} />
      <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', margin: '10px 0', padding: '8px', height: '60px' }} />
      <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', margin: '10px 0', padding: '8px' }}>
        <option value="personal">Personal</option>
        <option value="work">Work</option>
      </select>
      <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none' }}>Add Task</button>
    </form>
  );
};

export default TaskForm;