import React from 'react';
import { FE } from '@/types/frontend';

export const createTask = async (
  areaData: { projectId: string; areaId: string },
  setCurrentTasks: React.Dispatch<React.SetStateAction<FE.Task[]>>
) => {
  try {
    const response = await fetch('/api/add-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(areaData),
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }

    const newTask = await response.json();
    setCurrentTasks((prevTasks) => [...prevTasks, newTask]);
  } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    throw error; // Можно выбросить ошибку дальше, если нужно
  }
};
