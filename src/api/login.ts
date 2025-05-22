export const login = async (loginData: { login: string; password: string }) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
  } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    throw error; // Можно выбросить ошибку дальше, если нужно
  }
};
