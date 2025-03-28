// src/App.js
import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import FavoriteTasksContext, { FavoriteTasksProvider } from './context/FavoriteTasksContext';

function App() {
  const { favoriteTasks, addFavoriteTask, removeFavoriteTask } = useContext(FavoriteTasksContext);
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const addTodo = async () => {
    if (inputValue.trim() === '') return;
    const newTodo = { title: inputValue, completed: false };

    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });

    const data = await res.json();
    setTodos([...todos, data]); // به‌روزرسانی state با داده جدید از سرور
    setInputValue('');
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    const updatedTodo = { ...todo, completed: !todo.completed };

    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    });

    setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    });

    setTodos(todos.filter((t) => t.id !== id));
  };

  const handleAddToFavorites = (task) => {
    addFavoriteTask(task);
  };

  const handleRemoveFromFavorites = (taskId) => {
    removeFavoriteTask(taskId);
  };

  return (
    <div className="container">
      <h1>Todo List</h1>

      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add new task"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => toggleTodo(todo.id)}>
              {todo.title}
            </span>
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
            <button onClick={() => handleAddToFavorites(todo)}>
              Add to Favorites
            </button>
          </li>
        ))}
      </ul>

      <h2>Favorite Tasks</h2>
      <ul className="favorite-list">
        {favoriteTasks.map(task => (
          <li key={task.id}>
            <span>{task.title}</span>
            <button onClick={() => handleRemoveFromFavorites(task.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <FavoriteTasksProvider>
      <App />
    </FavoriteTasksProvider>
  );
}