export const toggleProjectFavorite = async (projectId: string) => {
  try {
    const data = {
      projectId: projectId,
    };

    const response = await fetch('/api/toggle-project-favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    } else {
      console.log('Запрос на добавление в избранное отправлен!');
    }
  } catch (error) {
    console.error('Ошибка при добавлении в избранное:', error);
    throw error;
  }
};
