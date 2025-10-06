import React from 'react';
import { FE } from '@/types/frontend';

export const createTask = async (areaData: {
  projectId: string;
  areaId: string;
}) => {
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

    return await response.json();
  } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    throw error; // Можно выбросить ошибку дальше, если нужно
  }
};
