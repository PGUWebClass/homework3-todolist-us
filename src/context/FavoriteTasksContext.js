
import React, { createContext, useState, useEffect } from 'react';

const FavoriteTasksContext = createContext();

export const FavoriteTasksProvider = ({ children }) => {
  const [favoriteTasks, setFavoriteTasks] = useState([]);

  // Load 
  useEffect(() => {
    const storedFavoriteTasks = JSON.parse(localStorage.getItem('favoriteTasks')) || [];
    setFavoriteTasks(storedFavoriteTasks);
  }, []);

  
  useEffect(() => {
    if (favoriteTasks.length > 0) {
      localStorage.setItem('favoriteTasks', JSON.stringify(favoriteTasks));
    }
  }, [favoriteTasks]);

  const addFavoriteTask = (task) => {
    setFavoriteTasks((prevTasks) => [...prevTasks, task]);
  };

  const removeFavoriteTask = (taskId) => {
    setFavoriteTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
  };

  return (
    <FavoriteTasksContext.Provider value={{ favoriteTasks, addFavoriteTask, removeFavoriteTask }}>
      {children}
    </FavoriteTasksContext.Provider>
  );
};

export default FavoriteTasksContext;

