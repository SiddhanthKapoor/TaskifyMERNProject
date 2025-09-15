import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import api from '../services/api';

const Dashboard = ({ token, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [filterCategory]);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?category=${filterCategory || ''}`);
      setTasks(res.data);
    } catch (err) {
      alert('Error fetching tasks: ' + (err.response?.data?.message || err.message));
    }
  };

  const addTask = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Taskify Dashboard</h1>
      <button onClick={onLogout} style={{ float: 'right', padding: '10px', background: '#dc3545', color: 'white', border: 'none' }}>Logout</button>
      <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', marginBottom: '20px' }}>
        {showForm ? 'Hide Form' : 'Add Task'}
      </button>
      {showForm && <TaskForm onAdd={addTask} />}
      <div>
        <label>Filter by Category: </label>
        <select onChange={(e) => setFilterCategory(e.target.value)} value={filterCategory} style={{ padding: '5px' }}>
          <option value="">All</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
        </select>
        <button onClick={fetchTasks} style={{ marginLeft: '10px', padding: '5px' }}>Refresh</button>
      </div>
      <TaskList tasks={tasks} onUpdate={updateTask} onDelete={deleteTask} />
    </div>
  );
};

export default Dashboard;