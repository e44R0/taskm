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
      return Promise.reject(new Error(`Ошибка: ${response.status}`));
    }

    return response.json();
  } catch (error) {
    console.error('Ошибка при авторизации:', error);
    return Promise.reject(error);
  }
};
