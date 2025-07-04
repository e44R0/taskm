export const deleteProject = async (projectId: string) => {
  try {
    const data = {
      projectId: projectId,
    };

    const response = await fetch('/api/delete-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    } else {
      console.log('Запрос на удаление проета отправлен!');
    }
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
    throw error; // Можно выбросить ошибку дальше, если нужно
  }
};
