export const logout = async () => {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
  } catch (error) {
    console.error('Ошибка при дейстаии logout:', error);
    throw error;
  }
};
