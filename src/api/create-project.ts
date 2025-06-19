type NewProjectData = {
  title: string;
  tags?: string[];
};

export const createProject = async (data: NewProjectData) => {
  try {
    const response = await fetch('/api/add-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка при создании проекта:', error);
    throw error; // Можно выбросить ошибку дальше, если нужно
  }
};
